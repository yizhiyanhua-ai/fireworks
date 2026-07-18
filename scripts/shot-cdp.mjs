// 真实时间 CDP 截图：启动带远程调试的 headless Chrome，等待真实毫秒后抓帧
// 用法: node scripts/shot-cdp.mjs <url> <waitMs> <out.png> [width] [height] [scrollY]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const [url, waitMsArg, out, widthArg, heightArg, scrollYArg, reducedArg] = process.argv.slice(2);
const waitMs = Number(waitMsArg || 5000);
const width = Number(widthArg || 1440);
const height = Number(heightArg || 900);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--no-first-run',
  '--disable-extensions',
  `--window-size=${width},${height}`,
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getWsUrl() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const data = await res.json();
      return data.webSocketDebuggerUrl;
    } catch {
      await sleep(250);
    }
  }
  throw new Error('chrome devtools not ready');
}

const ws = new WebSocket(await getWsUrl());
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let msgId = 0;
const pending = new Map();
const consoleLogs = [];
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method === 'Runtime.consoleAPICalled') {
    const text = (msg.params.args || []).map((arg) => arg.value ?? arg.description ?? '').join(' ');
    consoleLogs.push(`[${msg.params.type}] ${text}`);
  } else if (msg.method === 'Runtime.exceptionThrown') {
    consoleLogs.push(`[exception] ${JSON.stringify(msg.params.exceptionDetails?.exception?.description || msg.params)}`);
  }
};

function send(method, params = {}, sessionId) {
  msgId += 1;
  const id = msgId;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
  });
}

const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank', width, height });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });

await send('Runtime.enable', {}, sessionId);
await send('Page.enable', {}, sessionId);
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }, sessionId);
if (reducedArg === 'reduced') {
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  }, sessionId);
}

await send('Page.navigate', { url }, sessionId);

await sleep(waitMs);

if (scrollYArg !== undefined) {
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: ${Number(scrollYArg)}, behavior: 'instant' })`,
  }, sessionId);
  await sleep(1400);
}

const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));

const canvasCheck = await send('Runtime.evaluate', {
  expression: `(() => {
    const c = document.querySelector('.hero-canvas');
    return JSON.stringify({ canvas: !!c, w: c?.width, h: c?.height, stats: window.__fwScene?.stats?.() });
  })()`,
  returnByValue: true,
}, sessionId);

console.log('canvas:', canvasCheck.result?.result?.value);
console.log('console output:', consoleLogs.length ? consoleLogs.join('\n') : '(clean)');

ws.close();
chrome.kill();
console.log(`saved ${out}`);
