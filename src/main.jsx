import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  CalendarDays,
  Check,
  ChevronRight,
  Code2,
  Compass,
  ExternalLink,
  Flame,
  Github,
  GitFork,
  Globe2,
  Layers3,
  Menu,
  MessageCircle,
  Network,
  Newspaper,
  Radio,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  X,
  Zap,
} from 'lucide-react';
import {
  communityBeliefs,
  communityIntro,
  contentTracks,
  featuredProjects,
  officialAccount,
  operatingPrinciples,
  projectStats,
  rhythm,
  sourceNotes,
  wechatArticles,
  xFeedFallback,
} from './communityData';
import './styles.css';

const navItems = [
  ['产品', '#products'],
  ['动态', '#signals'],
  ['社区', '#community'],
  ['方法', '#principles'],
];

const principleIcons = {
  开源开放: Github,
  共建共治: Network,
  质量优先: ShieldCheck,
  长期主义: Rocket,
  安全合规: Check,
};

const trackIcons = [Sparkles, Terminal, Compass, Code2];

function useRemoteJson(path, fallback) {
  const [data, setData] = useState(fallback);

  useEffect(() => {
    let active = true;

    fetch(`${import.meta.env.BASE_URL}${path}`, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`${path}: ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch(() => {
        if (active) setData(fallback);
      });

    return () => {
      active = false;
    };
  }, [fallback, path]);

  return data;
}

function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function Logo({ compact = false }) {
  return (
    <span className={`logo${compact ? ' logo-compact' : ''}`}>
      <img src={`${import.meta.env.BASE_URL}assets/community-logo.png`} alt="" />
      {!compact && (
        <span>
          <strong>一支烟花 AI</strong>
          <small>OPEN PRODUCT COMMUNITY</small>
        </span>
      )}
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand-link" href="#top" aria-label="返回一支烟花 AI 首页" onClick={() => setOpen(false)}>
        <Logo />
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? '关闭导航' : '打开导航'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={`main-nav${open ? ' is-open' : ''}`} aria-label="主导航">
        {navItems.map(([label, href]) => (
          <a href={href} key={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
      <a className="github-link" href="https://github.com/yizhiyanhua-ai" target="_blank" rel="noreferrer">
        <Github size={18} aria-hidden="true" />
        <span>GitHub</span>
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <img
        className="hero-image"
        src={`${import.meta.env.BASE_URL}assets/fireworks-hero.png`}
        alt="烟花形态的 AI 社区品牌视觉"
      />
      <div className="hero-shade" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-index">
          <span>COMMUNITY / 2023 - NOW</span>
          <span className="live-dot">PUBLIC BUILDING</span>
        </div>
        <h1>一支烟花 AI</h1>
        <p className="hero-statement">让硬核内容长出产品，让个人探索变成社区资产。</p>
        <p className="hero-copy">
          关注 Agent、AI 产品、模型基础设施与真实落地。我们把洞见写成文章，把方法做成工具，
          再把可复用的结果交给开源社区。
        </p>
        <div className="hero-actions">
          <a className="action action-primary" href="#products">
            <Sparkles size={18} aria-hidden="true" />
            探索 AI 产品
            <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a className="action action-ghost" href="#signals">
            <Radio size={18} aria-hidden="true" />
            进入内容现场
          </a>
        </div>
      </div>
      <div className="hero-console" aria-label="社区公开数据">
        <div className="console-head">
          <span>FIREWORKS SIGNAL ENGINE</span>
          <i />
        </div>
        <div className="console-list">
          <div>
            <span>01 / PRODUCTS</span>
            <strong>{projectStats.repos} 个公开仓库</strong>
            <small>Ideas become reusable tools</small>
          </div>
          <div>
            <span>02 / RESEARCH</span>
            <strong>{officialAccount.originalPosts} 篇原创内容</strong>
            <small>Long-form, engineering-first</small>
          </div>
          <div>
            <span>03 / OPEN SOURCE</span>
            <strong>{projectStats.stars} Stars</strong>
            <small>Verified in public</small>
          </div>
        </div>
        <div className="console-wave" aria-hidden="true">
          {Array.from({ length: 28 }, (_, index) => (
            <span key={index} style={{ '--h': `${18 + ((index * 17) % 58)}%` }} />
          ))}
        </div>
      </div>
      <a className="hero-scroll" href="#products" aria-label="向下浏览产品">
        <span>SCROLL TO EXPLORE</span>
        <ArrowDown size={15} aria-hidden="true" />
      </a>
    </section>
  );
}

function LaunchTicker() {
  const items = ['Agent Products', 'Technical Visual AI', 'Persistent Memory', 'Open Skills', 'Hardcore Research'];
  return (
    <div className="launch-ticker" aria-label="社区重点方向">
      <div className="launch-ticker-track">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}>
            <i /> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionIntro({ eyebrow, title, body, aside }) {
  return (
    <div className="section-intro" data-reveal>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className="section-intro-copy">
        <p>{body}</p>
        {aside && <span className="section-note">{aside}</span>}
      </div>
    </div>
  );
}

function GeneratedPreview({ project }) {
  const rows = project.highlights.slice(0, 3);
  return (
    <div className={`generated-preview accent-${project.accent}`} aria-hidden="true">
      <div className="generated-toolbar">
        <span />
        <span />
        <span />
        <strong>{project.productType}</strong>
      </div>
      <div className="generated-layout">
        <div className="generated-side">
          {rows.map((row, index) => (
            <span key={row} className={index === 0 ? 'active' : ''}>
              0{index + 1} {row}
            </span>
          ))}
        </div>
        <div className="generated-canvas">
          <span className="node node-a">INPUT</span>
          <span className="node node-b">AGENT</span>
          <span className="node node-c">OUTPUT</span>
          <i className="line line-a" />
          <i className="line line-b" />
          <div className="generated-result">
            <small>BUILD RESULT</small>
            <strong>{project.tagline}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductVisual({ project }) {
  if (!project.previewImage) return <GeneratedPreview project={project} />;

  return (
    <figure className="product-visual">
      <img src={project.previewImage} alt={project.previewAlt || `${project.name} 产品截图`} />
      <figcaption>
        <span>{project.previewSource || 'README PRODUCT PREVIEW'}</span>
        <a href={project.url} target="_blank" rel="noreferrer">
          查看源项目 <ExternalLink size={13} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}

function ProductLab() {
  const categories = useMemo(
    () => ['全部', ...Array.from(new Set(featuredProjects.map((project) => project.category)))],
    [],
  );
  const [category, setCategory] = useState('全部');
  const filtered = category === '全部' ? featuredProjects : featuredProjects.filter((project) => project.category === category);
  const [selectedName, setSelectedName] = useState(featuredProjects[0].name);
  const selected = filtered.find((project) => project.name === selectedName) || filtered[0];

  function selectCategory(nextCategory) {
    setCategory(nextCategory);
    const nextProjects = nextCategory === '全部'
      ? featuredProjects
      : featuredProjects.filter((project) => project.category === nextCategory);
    setSelectedName(nextProjects[0].name);
  }

  return (
    <section className="product-lab" id="products">
      <div className="section-wrap">
        <SectionIntro
          eyebrow="01 / AI PRODUCT LAB"
          title="社区的价值，要落到可以被使用的产品上。"
          body="这里展示的每个项目都来自真实工作流：观察问题、形成方法、做成工具、公开验证。你看到的不只是仓库列表，而是一组持续进化的 AI 产品。"
          aside={`${featuredProjects.length} PRODUCTS / OPEN SOURCE`}
        />
        <div className="product-filter" role="tablist" aria-label="按产品方向筛选">
          {categories.map((item) => (
            <button
              type="button"
              role="tab"
              aria-selected={category === item}
              className={category === item ? 'active' : ''}
              key={item}
              onClick={() => selectCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="product-stage" data-reveal>
          <div className="product-stage-copy">
            <div className="product-stage-meta">
              <span>{selected.launchRank}</span>
              <span>{selected.productType}</span>
              <span>{selected.language}</span>
            </div>
            <h3>{selected.name}</h3>
            <p className="product-tagline">{selected.tagline}</p>
            <p className="product-outcome">{selected.outcome}</p>
            <div className="product-usecase">
              <small>适合用在</small>
              <strong>{selected.useCase}</strong>
            </div>
            <ul className="product-highlights">
              {selected.highlights.map((highlight) => (
                <li key={highlight}>
                  <Zap size={14} aria-hidden="true" /> {highlight}
                </li>
              ))}
            </ul>
            <div className="product-metrics">
              <span><Star size={15} aria-hidden="true" /> {selected.stars.toLocaleString()} Stars</span>
              <span><GitFork size={15} aria-hidden="true" /> {selected.forks.toLocaleString()} Forks</span>
            </div>
            <div className="product-actions">
              {selected.demo && (
                <a className="action action-primary" href={selected.demo} target="_blank" rel="noreferrer">
                  体验产品 <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
              <a className="action action-outline" href={selected.url} target="_blank" rel="noreferrer">
                <Github size={17} aria-hidden="true" /> 查看源码
              </a>
            </div>
          </div>
          <ProductVisual project={selected} />
        </div>
        <div className="product-index" aria-label="AI 产品列表">
          {filtered.map((project, index) => (
            <button
              type="button"
              className={selected.name === project.name ? 'active' : ''}
              onClick={() => setSelectedName(project.name)}
              key={project.name}
            >
              <span className="product-index-number">{String(index + 1).padStart(2, '0')}</span>
              <span className={`product-index-icon accent-${project.accent}`}>
                {project.previewImage ? <img src={project.previewImage} alt="" /> : <Boxes size={22} />}
              </span>
              <span className="product-index-name">
                <strong>{project.name}</strong>
                <small>{project.tagline}</small>
              </span>
              <span className="product-index-stat">
                <Star size={13} aria-hidden="true" /> {project.stars.toLocaleString()}
              </span>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          ))}
        </div>
        <a className="all-projects-link" href="https://github.com/orgs/yizhiyanhua-ai/repositories" target="_blank" rel="noreferrer">
          浏览全部公开仓库 <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function XSignal({ feed }) {
  const posts = feed.posts?.length ? feed.posts.slice(0, 20) : xFeedFallback.posts;
  const loop = [...posts, ...posts];

  return (
    <article className="signal-column signal-x">
      <div className="signal-head">
        <div>
          <span>X / FIELD NOTES</span>
          <strong>@{feed.account?.handle || 'teach_fireworks'}</strong>
        </div>
        <a href={feed.account?.url || xFeedFallback.account.url} target="_blank" rel="noreferrer" aria-label="在 X 查看">
          <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="signal-window">
        <div className="signal-track x-track">
          {loop.map((post, index) => (
            <a className="x-signal-item" href={post.url} target="_blank" rel="noreferrer" key={`${post.id}-${index}`}>
              <div>
                <span>{post.createdAt}</span>
                <small>{post.metrics}</small>
              </div>
              <p>{post.text}</p>
              <footer>
                {post.tags?.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}
              </footer>
            </a>
          ))}
        </div>
      </div>
      <div className="signal-foot">
        <span><i /> LIVE SNAPSHOT</span>
        <span>{posts.length} SIGNALS</span>
      </div>
    </article>
  );
}

function ArticleSignal({ archive }) {
  const articles = archive.articles?.length ? archive.articles : wechatArticles;
  const loop = [...articles, ...articles];

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
          {loop.map((article, index) => (
            <a className="article-signal-item" href={article.url} target="_blank" rel="noreferrer" key={`${article.id}-${index}`}>
              <div className="article-date">
                <span>{article.date?.slice(5, 10).replace('-', '.')}</span>
                <small>{article.date?.slice(0, 4)}</small>
              </div>
              <div>
                <span className="article-category">{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
              </div>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
      <div className="signal-foot">
        <span><Newspaper size={13} /> PUBLIC ARCHIVE</span>
        <span>{articles.length} ARTICLES</span>
      </div>
    </article>
  );
}

function SignalSection() {
  const feed = useRemoteJson('assets/x-feed.json', xFeedFallback);
  const archive = useRemoteJson('assets/wechat-articles.json', {
    updatedAt: '2026-07-09T00:00:00+08:00',
    source: 'local fallback',
    articles: wechatArticles,
  });

  return (
    <section className="signals" id="signals">
      <div className="section-wrap">
        <SectionIntro
          eyebrow="02 / LIVE INTELLIGENCE"
          title="产品在仓库里生长，判断在内容里持续更新。"
          body="短观察进入 X，长研究沉淀到公众号。两条公开内容流共同记录我们如何理解 Agent、AI 产品与模型基础设施。"
          aside="PUBLIC FEEDS / CONTINUOUSLY UPDATED"
        />
        <div className="signal-board" data-reveal>
          <XSignal feed={feed} />
          <ArticleSignal archive={archive} />
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="community" id="community">
      <div className="community-lead section-wrap" data-reveal>
        <div className="community-label">
          <span>03 / COMMUNITY MANIFESTO</span>
          <Logo compact />
        </div>
        <blockquote>
          “让 AI 学习从信息消费走向作品生产，让个人经验变成别人可以继续使用的公共资产。”
        </blockquote>
        <div className="community-story">
          <h2>{communityIntro.headline}</h2>
          <p>{communityIntro.body}</p>
        </div>
      </div>
      <div className="beliefs section-wrap">
        {communityBeliefs.map((belief, index) => {
          const Icon = [Sparkles, Layers3, Network][index];
          return (
            <article key={belief.title} data-reveal>
              <span>0{index + 1}</span>
              <Icon size={25} aria-hidden="true" />
              <h3>{belief.title}</h3>
              <p>{belief.body}</p>
            </article>
          );
        })}
      </div>
      <div className="community-facts section-wrap" data-reveal>
        {communityIntro.notes.map((note) => (
          <div key={note.label}>
            <span>{note.label}</span>
            <strong>{note.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function MethodsSection() {
  return (
    <section className="methods" id="principles">
      <div className="section-wrap">
        <SectionIntro
          eyebrow="04 / HOW WE BUILD"
          title="一套能被验证的社区工作方式。"
          body="我们用内容识别问题，用项目验证判断，用公开成果连接协作者。理念必须进入交付过程，才会产生长期价值。"
          aside="CONTENT → PRODUCT → COMMUNITY"
        />
        <div className="method-flow" data-reveal>
          {rhythm.map((item, index) => {
            const Icon = [CalendarDays, BookOpen, Code2, MessageCircle, Rocket][index];
            return (
              <article key={item.title}>
                <div>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Icon size={21} aria-hidden="true" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            );
          })}
        </div>
        <div className="principle-list">
          {operatingPrinciples.map((principle) => {
            const Icon = principleIcons[principle.title];
            return (
              <article key={principle.title} data-reveal>
                <Icon size={22} aria-hidden="true" />
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
                <span className={`principle-line tone-${principle.tone}`} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContentRadar() {
  return (
    <section className="radar">
      <div className="section-wrap">
        <div className="radar-head" data-reveal>
          <span>CONTENT RADAR</span>
          <h2>我们持续追踪的四条线索</h2>
          <p>{officialAccount.tagline}</p>
        </div>
        <div className="radar-grid">
          {contentTracks.map((track, index) => {
            const Icon = trackIcons[index];
            return (
              <article className={`tone-${track.accent}`} key={track.title} data-reveal>
                <span>0{index + 1}</span>
                <Icon size={25} aria-hidden="true" />
                <h3>{track.title}</h3>
                <p>{track.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OpenSection() {
  return (
    <section className="open-layer">
      <div className="section-wrap">
        <SectionIntro
          eyebrow="05 / OPEN LAYER"
          title="公开来源，公开验证，公开继续。"
          body="社区官网只使用公开可验证的信息。私密群聊、个人联系方式、未授权材料和凭据不会进入页面。"
          aside="PRIVACY FIRST / SOURCE VISIBLE"
        />
        <div className="source-grid">
          {sourceNotes.map((source) => (
            <a
              href={source.url}
              target={source.url.startsWith('#') ? undefined : '_blank'}
              rel={source.url.startsWith('#') ? undefined : 'noreferrer'}
              key={`${source.title}-${source.url}`}
            >
              <div>
                <span>{source.type}</span>
                <strong>{source.title}</strong>
                <p>{source.summary}</p>
              </div>
              <small>{source.status}</small>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinSection() {
  return (
    <section className="join">
      <img src={`${import.meta.env.BASE_URL}assets/fireworks-hero.png`} alt="" />
      <div className="join-overlay" />
      <div className="join-content section-wrap" data-reveal>
        <span>BUILD IN PUBLIC</span>
        <h2>把下一束 AI 火花，做成真正能被使用的东西。</h2>
        <p>从一个问题、一段脚本或一次复盘开始。公开它，验证它，让更多人接着往前走。</p>
        <div className="hero-actions">
          <a className="action action-primary" href="https://github.com/yizhiyanhua-ai" target="_blank" rel="noreferrer">
            <Github size={18} aria-hidden="true" /> 加入开源共创
          </a>
          <a className="action action-ghost" href="https://hqexj12b0g.feishu.cn/docx/TyymdoAdRodWGJxCi6FcJvEUn2b" target="_blank" rel="noreferrer">
            了解社区 <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <Logo />
      <p>硬核 AI 内容 · 开源产品 · 极客共创</p>
      <div>
        <a href="https://github.com/yizhiyanhua-ai" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://x.com/teach_fireworks" target="_blank" rel="noreferrer">X / @teach_fireworks</a>
        <a href="#top">回到顶部</a>
      </div>
    </footer>
  );
}

function App() {
  useReveal();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <LaunchTicker />
        <ProductLab />
        <SignalSection />
        <CommunitySection />
        <MethodsSection />
        <ContentRadar />
        <OpenSection />
        <JoinSection />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
