import { ArrowUpRight, Newspaper } from 'lucide-react';
import { officialAccount, wechatArticles, xFeedFallback } from '../communityData';
import { useRemoteJson } from '../hooks/useRemoteJson';
import { formatSnapshotDate, isDirectWechatArticle, isDirectXPost } from '../utils/content';
import { SectionIntro } from './SectionIntro';

const WECHAT_FALLBACK = {
  updatedAt: '2026-07-09T00:00:00+08:00',
  source: 'local fallback',
  articles: wechatArticles,
};

function XSignalItem({ post, duplicate = false }) {
  const directPost = isDirectXPost(post.url);
  const Tag = directPost ? 'a' : 'article';
  const linkProps = directPost
    ? { href: post.url, target: '_blank', rel: 'noreferrer', tabIndex: duplicate ? -1 : undefined }
    : {};

  return (
    <Tag className={`x-signal-item${directPost ? '' : ' is-archive'}`} {...linkProps}>
      <div>
        <span>{post.createdAt}</span>
        <small>{directPost ? 'X 原帖' : '观点归档'}</small>
      </div>
      <p>{post.text}</p>
      <footer>
        {post.tags?.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}
      </footer>
    </Tag>
  );
}

function ArticleSignalItem({ article, duplicate = false }) {
  const directArticle = isDirectWechatArticle(article.url);
  const sourceLabel = directArticle ? '公众号原文' : article.source || '公开归档';

  return (
    <a
      className={`article-signal-item${directArticle ? ' is-direct' : ''}`}
      href={article.url}
      target="_blank"
      rel="noreferrer"
      tabIndex={duplicate ? -1 : undefined}
    >
      <div className="article-date">
        <span>{article.date?.slice(5, 10).replace('-', '.')}</span>
        <small>{article.date?.slice(0, 4)}</small>
      </div>
      <div>
        <span className="article-category">{article.category}</span>
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
        <small className="article-source">{sourceLabel}</small>
      </div>
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}

function XSignal({ feed }) {
  const posts = feed.posts?.length ? feed.posts.slice(0, 20) : xFeedFallback.posts;

  return (
    <article className="signal-column signal-x">
      <div className="signal-head">
        <div>
          <span>X / FIELD NOTES</span>
          <strong>@{feed.account?.handle || 'teach_fireworks'}</strong>
        </div>
        <a href={feed.account?.url || xFeedFallback.account.url} target="_blank" rel="noreferrer" aria-label="在 X 查看">
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
      <div className="signal-window">
        <div className="signal-track x-track">
          <div className="signal-copy">
            {posts.map((post) => <XSignalItem post={post} key={post.id} />)}
          </div>
          <div className="signal-copy signal-copy-duplicate" aria-hidden="true">
            {posts.map((post) => <XSignalItem post={post} duplicate key={`duplicate-${post.id}`} />)}
          </div>
        </div>
      </div>
      <div className="signal-foot">
        <span><i /> 公开快照 · {formatSnapshotDate(feed.updatedAt)}</span>
        <span>{posts.length} 条内容</span>
      </div>
    </article>
  );
}

function ArticleSignal({ archive }) {
  const articles = archive.articles?.length ? archive.articles : wechatArticles;

  return (
    <article className="signal-column signal-wechat">
      <div className="signal-head signal-head-qr">
        <div>
          <span>WECHAT / DEEP RESEARCH</span>
          <strong>一支烟花 AI</strong>
        </div>
        <div className="mini-qr">
          <img src={officialAccount.qrImage} alt="一支烟花 AI 公众号二维码" />
          <span>扫码关注</span>
        </div>
      </div>
      <div className="signal-window">
        <div className="signal-track article-track">
          <div className="signal-copy">
            {articles.map((article) => <ArticleSignalItem article={article} key={article.id} />)}
          </div>
          <div className="signal-copy signal-copy-duplicate" aria-hidden="true">
            {articles.map((article) => <ArticleSignalItem article={article} duplicate key={`duplicate-${article.id}`} />)}
          </div>
        </div>
      </div>
      <div className="signal-foot">
        <span><Newspaper size={13} aria-hidden="true" /> 归档更新 · {formatSnapshotDate(archive.updatedAt)}</span>
        <span>{articles.length} 篇文章</span>
      </div>
    </article>
  );
}

export function SignalSection() {
  const feed = useRemoteJson('assets/x-feed.json', xFeedFallback);
  const archive = useRemoteJson('assets/wechat-articles.json', WECHAT_FALLBACK);

  return (
    <section className="signals" id="signals">
      <div className="section-wrap">
        <SectionIntro
          eyebrow="02 / PUBLIC SIGNALS"
          title="产品在仓库里生长，判断在内容里持续更新。"
          body="短观察进入 X，长研究沉淀到公众号。原帖、原文与公开归档会被明确标注，让每条内容的来源都能被理解和验证。"
          aside="PUBLIC FEEDS / SOURCE LABELED"
        />
        <div className="signal-board" data-reveal>
          <XSignal feed={feed} />
          <ArticleSignal archive={archive} />
        </div>
      </div>
    </section>
  );
}
