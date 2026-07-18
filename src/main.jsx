import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  Code2,
  Compass,
  ExternalLink,
  Github,
  Layers3,
  Menu,
  MessageCircle,
  Network,
  Radio,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import {
  communityBeliefs,
  communityIntro,
  contentTracks,
  officialAccount,
  operatingPrinciples,
  projectStats,
  rhythm,
  sourceNotes,
} from './communityData';
import { ProductLab } from './components/ProductLab';
import { SectionIntro } from './components/SectionIntro';
import { SignalSection } from './components/SignalSection';
import { FireworksCanvas } from './components/FireworksCanvas';
import { CommunityGroups } from './components/CommunityGroups';
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
      <div className="hero-nebula" aria-hidden="true" />
      <FireworksCanvas
        fallbackImage={`${import.meta.env.BASE_URL}assets/fireworks-hero.png`}
        fallbackAlt="烟花形态的 AI 社区品牌视觉"
      />
      <div className="hero-shade" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-index">
          <span>COMMUNITY / 2023 - NOW</span>
          <span className="live-dot">PUBLIC BUILDING</span>
        </div>
        <h1>
          一支烟花 <span className="hero-title-ai">AI</span>
        </h1>
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
        <p className="hero-hint">
          <Sparkles size={13} aria-hidden="true" />
          点击夜空，亲手放一束烟花
        </p>
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
        <div className="launch-ticker-copy">
          {items.map((item) => <span key={item}><i /> {item}</span>)}
        </div>
        <div className="launch-ticker-copy" aria-hidden="true">
          {items.map((item) => <span key={`duplicate-${item}`}><i /> {item}</span>)}
        </div>
      </div>
    </div>
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
      <FireworksCanvas
        className="join-scene"
        fallbackImage={`${import.meta.env.BASE_URL}assets/fireworks-hero.png`}
        sceneOptions={{ cadence: [1.0, 2.2], finaleChance: 0.14, burstScale: 1, openingBurst: false }}
        interactive={false}
      />
      <div className="join-overlay" />
      <div className="join-content section-wrap" data-reveal>
        <span>BUILD IN PUBLIC</span>
        <h2>把下一束 AI 火花，做成真正能被使用的东西。</h2>
        <p>从一个问题、一段脚本或一次复盘开始。公开它，验证它，让更多人接着往前走。</p>
        <div className="hero-actions">
          <a className="action action-primary" href="https://hqexj12b0g.feishu.cn/docx/TyymdoAdRodWGJxCi6FcJvEUn2b" target="_blank" rel="noreferrer">
            了解社区 <ExternalLink size={16} aria-hidden="true" />
          </a>
          <a className="action action-ghost" href="https://github.com/yizhiyanhua-ai" target="_blank" rel="noreferrer">
            <Github size={18} aria-hidden="true" /> 加入开源共创
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
        <CommunityGroups />
        <JoinSection />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
