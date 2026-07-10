import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { featuredProjects } from '../src/communityData.js';
import { formatSnapshotDate, isDirectWechatArticle, isDirectXPost } from '../src/utils/content.js';

const xFeed = JSON.parse(readFileSync(new URL('../public/assets/x-feed.json', import.meta.url), 'utf8'));
const wechatArchive = JSON.parse(readFileSync(new URL('../public/assets/wechat-articles.json', import.meta.url), 'utf8'));
const projectSnapshot = JSON.parse(readFileSync(new URL('../public/assets/github-projects.json', import.meta.url), 'utf8'));

test('public content URLs are classified without treating profile or search pages as originals', () => {
  assert.equal(isDirectXPost('https://x.com/teach_fireworks/status/2050190799837741377'), true);
  assert.equal(isDirectXPost('https://x.com/teach_fireworks'), false);
  assert.equal(isDirectWechatArticle('https://mp.weixin.qq.com/s/example'), true);
  assert.equal(isDirectWechatArticle('https://weixin.sogou.com/weixin?query=example'), false);
});

test('snapshot dates are formatted for the public status line', () => {
  assert.equal(formatSnapshotDate('2026-07-08T00:00:00+08:00'), '07/08');
  assert.equal(formatSnapshotDate('invalid-date'), '日期待更新');
});

test('every featured project has traceable visual evidence', () => {
  assert.equal(featuredProjects.length, 8);
  assert.equal(new Set(featuredProjects.map((project) => project.name)).size, featuredProjects.length);

  for (const project of featuredProjects) {
    assert.match(project.url, /^https:\/\/github\.com\/yizhiyanhua-ai\//);
    assert.match(project.previewImage, /^\/fireworks\/assets\/product-.*\.(png|webp|svg)$/);
    assert.equal(
      existsSync(new URL(`../public${project.previewImage.replace('/fireworks', '')}`, import.meta.url)),
      true,
    );
    assert.ok(project.previewAlt.length > 12);
    assert.ok(project.previewSource.length > 8);
    assert.equal(Number.isFinite(project.stars), true);
    assert.equal(Number.isFinite(project.forks), true);
  }
});

test('GitHub metrics snapshot covers the complete product matrix', () => {
  assert.equal(Object.keys(projectSnapshot.projects).length, featuredProjects.length);

  for (const project of featuredProjects) {
    const metrics = projectSnapshot.projects[project.name];
    assert.ok(metrics);
    assert.equal(Number.isInteger(metrics.stars), true);
    assert.equal(Number.isInteger(metrics.forks), true);
  }
});

test('public feeds keep enough content for the scrolling surfaces', () => {
  assert.ok(xFeed.posts.length >= 20);
  assert.ok(wechatArchive.articles.length >= 20);
  assert.ok(xFeed.posts.every((post) => post.id && post.text && post.url));
  assert.ok(wechatArchive.articles.every((article) => article.id && article.title && article.url && article.source));
});
