import { writeFile } from 'node:fs/promises';

const appId = process.env.WECHAT_APPID;
const appSecret = process.env.WECHAT_APPSECRET;
const envToken = process.env.WECHAT_ACCESS_TOKEN;
const maxArticles = Number(process.env.WECHAT_ARTICLE_LIMIT || '40');
const outputPath = process.env.WECHAT_ARTICLE_OUTPUT || 'public/assets/wechat-articles.json';

async function getJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json();

  if (!response.ok || payload.errcode) {
    throw new Error(`WeChat API error: ${response.status} ${JSON.stringify(payload)}`);
  }

  return payload;
}

async function getAccessToken() {
  if (envToken) return envToken;

  if (!appId || !appSecret) {
    throw new Error('Missing WECHAT_ACCESS_TOKEN or WECHAT_APPID + WECHAT_APPSECRET.');
  }

  const tokenUrl = new URL('https://api.weixin.qq.com/cgi-bin/token');
  tokenUrl.searchParams.set('grant_type', 'client_credential');
  tokenUrl.searchParams.set('appid', appId);
  tokenUrl.searchParams.set('secret', appSecret);

  const payload = await getJson(tokenUrl);
  return payload.access_token;
}

function formatDate(seconds) {
  if (!seconds) return '公众号';

  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(seconds * 1000));
}

function inferCategory(title) {
  if (/agent|codex|claude code|harness|skill/i.test(title)) return 'Agent 工程';
  if (/gpt|deepseek|模型|llm|reasoning|thinking/i.test(title)) return '模型基础';
  if (/产品|saas|创业|商业|gemini/i.test(title)) return 'AI 产品';
  if (/知识库|memory|记忆/i.test(title)) return '知识系统';
  if (/开源|github|coze|dify/i.test(title)) return '开源工具';
  return '公众号文章';
}

function compactText(value, fallback) {
  const text = String(value || fallback || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return text.length > 92 ? `${text.slice(0, 90)}...` : text;
}

function normalizeArticle(item, article, index) {
  const title = article.title || '未命名文章';
  return {
    id: article.url || `${item.article_id || item.media_id || 'wechat'}-${index}`,
    title,
    date: formatDate(item.update_time),
    category: inferCategory(title),
    summary: compactText(article.digest, '点击阅读一支烟花 AI 公众号原文。'),
    url: article.url,
    source: '公众号原文',
  };
}

const accessToken = await getAccessToken();
const articles = [];
let total = Infinity;
let offset = 0;

while (articles.length < maxArticles && offset < total) {
  const url = `https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token=${encodeURIComponent(accessToken)}`;
  const payload = await getJson(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      offset,
      count: Math.min(20, maxArticles - articles.length),
      no_content: 1,
    }),
  });

  total = payload.total_count ?? articles.length;
  offset += payload.item_count ?? 0;

  for (const item of payload.item || []) {
    for (const article of item.content?.news_item || []) {
      if (article.url && article.title) {
        articles.push(normalizeArticle(item, article, articles.length));
      }
    }
  }

  if (!payload.item_count) break;
}

if (articles.length === 0) {
  throw new Error('WeChat API returned no articles.');
}

const archive = {
  account: {
    name: '一支烟花 AI',
  },
  updatedAt: new Date().toISOString(),
  source: 'WeChat Official Account API / freepublish batchget',
  endpoint: 'POST /cgi-bin/freepublish/batchget',
  articles: articles.slice(0, maxArticles),
};

await writeFile(outputPath, `${JSON.stringify(archive, null, 2)}\n`);
console.log(`Wrote ${archive.articles.length} WeChat articles to ${outputPath}.`);
