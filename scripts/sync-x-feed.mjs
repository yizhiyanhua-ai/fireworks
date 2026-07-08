import { writeFile } from 'node:fs/promises';

const username = process.env.X_USERNAME || 'teach_fireworks';
const maxPosts = Number(process.env.X_MAX_POSTS || '20');
const bearerToken = process.env.X_BEARER_TOKEN;

if (!bearerToken) {
  throw new Error('Missing X_BEARER_TOKEN. Set it as a local env var or GitHub Actions secret.');
}

const headers = {
  Authorization: `Bearer ${bearerToken}`,
};

async function getJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`X API ${response.status}: ${body}`);
  }
  return response.json();
}

function compactText(text) {
  return String(text || '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferTags(text, entities) {
  const hashtags = (entities?.hashtags || []).map((item) => item.tag).slice(0, 3);
  if (hashtags.length > 0) return hashtags;

  const signals = [
    ['Codex', /codex/i],
    ['Claude Code', /claude code/i],
    ['Agent', /agent/i],
    ['RAG', /\brag\b/i],
    ['Memory', /memory|记忆/i],
    ['Workflow', /workflow|工作流/i],
    ['Eval', /eval|评测|评估/i],
    ['AI Product', /产品|product/i],
  ];

  return signals.filter(([, pattern]) => pattern.test(text)).slice(0, 3).map(([label]) => label);
}

function formatDate(value) {
  if (!value) return 'X';
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

const userUrl = `https://api.x.com/2/users/by/username/${encodeURIComponent(username)}?user.fields=name,username`;
const userPayload = await getJson(userUrl);
const user = userPayload.data;

if (!user?.id) {
  throw new Error(`Cannot resolve X user: ${username}`);
}

const timelineUrl = new URL(`https://api.x.com/2/users/${user.id}/tweets`);
timelineUrl.searchParams.set('max_results', String(Math.min(Math.max(maxPosts, 5), 100)));
timelineUrl.searchParams.set('exclude', 'retweets');
timelineUrl.searchParams.set('tweet.fields', 'created_at,entities,note_tweet,public_metrics');

const timelinePayload = await getJson(timelineUrl);
const posts = (timelinePayload.data || [])
  .map((tweet) => {
    const text = compactText(tweet.note_tweet?.text || tweet.text);
    return {
      id: tweet.id,
      url: `https://x.com/${username}/status/${tweet.id}`,
      createdAt: formatDate(tweet.created_at),
      text,
      tags: inferTags(text, tweet.entities),
      metrics: `${tweet.public_metrics?.like_count ?? 0} likes`,
    };
  })
  .filter((post) => post.text)
  .slice(0, maxPosts);

if (posts.length < Math.min(maxPosts, 20)) {
  throw new Error(`Expected at least ${Math.min(maxPosts, 20)} posts, got ${posts.length}`);
}

const feed = {
  account: {
    name: user.name || '烟花老师',
    handle: user.username || username,
    url: `https://x.com/${user.username || username}`,
  },
  updatedAt: new Date().toISOString(),
  source: 'X API / scheduled sync',
  posts,
};

await writeFile('public/assets/x-feed.json', `${JSON.stringify(feed, null, 2)}\n`);
console.log(`Wrote public/assets/x-feed.json with ${posts.length} posts from @${feed.account.handle}.`);
