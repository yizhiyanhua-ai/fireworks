export function formatSnapshotDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '日期待更新';

  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function isDirectXPost(url) {
  return /^https:\/\/x\.com\/[^/]+\/status\/\d+/.test(String(url || ''));
}

export function isDirectWechatArticle(url) {
  try {
    return new URL(url).hostname === 'mp.weixin.qq.com';
  } catch {
    return false;
  }
}
