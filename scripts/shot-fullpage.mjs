// 真实时间 CDP 整页截图：滚到底部触发懒加载后回顶部，抓整页
// 用法: node scripts/shot-fullpage.mjs <url> <out.png> [width]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const [url, out, widthArg] = process.argv.slice(2);
const width = Number(widthArg || 1440);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9334;

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--no-first-run',
  '--disable-extensions',
  `--window-size=${width},900`,
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
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
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

const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });

await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
await send('Page.navigate', { url }, sessionId);
await sleep(4500);

// 触发所有 reveal / lazy 图片（instant 滚动，避免 smooth 被合并）
await send('Runtime.evaluate', {
  expression: `(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 650) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 180));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  })()`,
  awaitPromise: true,
}, sessionId);
await sleep(2200);

const metrics = await send('Page.getLayoutMetrics', {}, sessionId);
const height = Math.min(16000, Math.ceil(metrics.result.cssContentSize.height));

const shot = await send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width, height, scale: 1 },
}, sessionId);
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
console.log(`saved ${out} (${width}x${height})`);

ws.close();
chrome.kill();
