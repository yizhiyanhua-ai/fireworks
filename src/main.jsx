import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen,
  Boxes,
  CalendarDays,
  ChevronUp,
  Code2,
  Compass,
  ExternalLink,
  Github,
  GitFork,
  Globe2,
  Layers3,
  Lightbulb,
  LockKeyhole,
  MessageCircle,
  Network,
  Rocket,
  ShieldCheck,
  Star,
  TerminalSquare,
  Users,
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
  xFeedFallback,
} from './communityData';
import './styles.css';

const icons = {
  开源开放: Github,
  共建共治: Users,
  质量优先: ShieldCheck,
  长期主义: Rocket,
  安全合规: LockKeyhole,
};

const navItems = [
  ['公众号', '#official-account'],
  ['社区介绍', '#community'],
  ['开源项目', '#projects'],
  ['社区理念', '#principles'],
  ['学习共创', '#rhythm'],
];

function Stat({ value, label }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ProductPreview({ project, compact = false }) {
  const previewRows = {
    diagram: ['agent graph', 'rag pipeline', 'deploy map'],
    design: ['brief intake', 'variant panel', 'critique merge'],
    memory: ['skill note', 'context layer', 'recall path'],
    tools: ['cli index', 'workflow card', 'search cache'],
    media: ['image search', 'clip queue', 'asset board'],
    registry: ['scan skills', 'update plan', 'release check'],
    research: ['terms map', 'value chain', 'players list'],
    video: ['chapter cut', 'insight card', 'study notes'],
  };
  const rows = previewRows[project.previewType] || previewRows.tools;

  return (
    <div className={`product-preview preview-${project.previewType}${compact ? ' compact' : ''}`} aria-hidden="true">
      <div className="preview-window-bar">
        <span />
        <span />
        <span />
      </div>
      {project.previewImage && !compact ? (
        <div className="preview-image-shell">
          <img src={project.previewImage} alt={project.previewAlt} loading="lazy" />
          <div className="preview-image-caption">
            <span>{project.previewSource}</span>
            <strong>{project.tagline}</strong>
          </div>
        </div>
      ) : (
        <div className="preview-canvas">
          <div className="preview-sidebar">
            {rows.map((row) => (
              <span key={row}>{row}</span>
            ))}
          </div>
          <div className="preview-main">
            <div className="preview-command">{project.tagline}</div>
            <div className="preview-graph">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-output">
              <strong>{project.productType}</strong>
              <span>{project.highlights[0]}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  if (!project.flagship) {
    return (
      <article className={`project-card product-row accent-${project.accent}`}>
        <div className="product-rank">
          <span>{project.launchRank}</span>
          <strong>
            <ChevronUp size={14} aria-hidden="true" /> {project.upvotes}
          </strong>
        </div>
        <ProductPreview project={project} compact />
        <div className="product-row-body">
          <div className="project-topline">
            <span>{project.productType}</span>
            <span>{project.category}</span>
          </div>
          <div className="project-title-row">
            <h3>{project.name}</h3>
            <span className="project-language">{project.language}</span>
          </div>
          <p className="project-tagline">{project.tagline}</p>
          <p className="project-outcome">{project.outcome}</p>
          <div className="feature-chip-row">
            {project.highlights.slice(0, 3).map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
          <div className="project-actions">
            {project.demo && (
              <a className="launch-link" href={project.demo} target="_blank" rel="noreferrer">
                体验 Demo <ExternalLink size={15} aria-hidden="true" />
              </a>
            )}
            <a href={project.url} target="_blank" rel="noreferrer">
              查看开源 <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`project-card accent-${project.accent}${project.flagship ? ' flagship' : ''}`}>
      <div className="flagship-copy">
        <div className="product-launch-meta">
          <span>{project.launchRank}</span>
          <strong>
            <ChevronUp size={15} aria-hidden="true" /> {project.upvotes}
          </strong>
          <span>社区产品发布</span>
        </div>
        <div className="project-topline">
          <span>{project.productType}</span>
          <span>{project.category}</span>
        </div>
        <div className="project-title-row">
          <h3>{project.name}</h3>
          <span className="project-language">{project.language}</span>
        </div>
        <p className="project-tagline">{project.tagline}</p>
        <p className="project-outcome">{project.outcome}</p>
        <div className="project-use-case">
          <span>使用场景</span>
          <strong>{project.useCase}</strong>
        </div>
        <div className="feature-chip-row">
          {project.highlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
        <div className="project-metrics" aria-label={`${project.name} GitHub metrics`}>
          <span>
            <Star size={15} aria-hidden="true" /> {project.stars.toLocaleString()}
          </span>
          <span>
            <GitFork size={15} aria-hidden="true" /> {project.forks.toLocaleString()}
          </span>
        </div>
        <div className="project-actions">
          {project.demo && (
            <a className="launch-link" href={project.demo} target="_blank" rel="noreferrer">
              体验 Demo <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
          <a href={project.url} target="_blank" rel="noreferrer">
            查看开源 <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
      <ProductPreview project={project} />
    </article>
  );
}

function ContentTrackCard({ track, index }) {
  const TrackIcon = [Rocket, TerminalSquare, Lightbulb, Code2][index];
  return (
    <article className={`content-track tone-${track.accent}`}>
      <TrackIcon size={28} aria-hidden="true" />
      <h3>{track.title}</h3>
      <p>{track.body}</p>
    </article>
  );
}

function XFeedPanel() {
  const [feed, setFeed] = useState(xFeedFallback);
  const posts = useMemo(() => {
    const items = feed.posts?.length ? feed.posts : xFeedFallback.posts;
    return [...items, ...items];
  }, [feed]);

  useEffect(() => {
    let active = true;

    fetch('/fireworks/assets/x-feed.json', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`x-feed ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        if (active && Array.isArray(payload.posts) && payload.posts.length > 0) {
          setFeed({
            ...xFeedFallback,
            ...payload,
            account: {
              ...xFeedFallback.account,
              ...(payload.account ?? {}),
            },
          });
        }
      })
      .catch(() => {
        if (active) {
          setFeed(xFeedFallback);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="x-feed-panel" aria-label="X 动态流">
      <div className="x-feed-header">
        <div>
          <span>X / Live Notes</span>
          <strong>@{feed.account.handle}</strong>
        </div>
        <a href={feed.account.url} target="_blank" rel="noreferrer">
          查看 X <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
      <div className="x-feed-window">
        <div className="x-feed-track">
          {posts.map((post, index) => (
            <a className="x-post-card" href={post.url} target="_blank" rel="noreferrer" key={`${post.id}-${index}`}>
              <div className="x-post-meta">
                <span>{post.createdAt}</span>
                <span>{post.metrics}</span>
              </div>
              <p>{post.text}</p>
              <div className="x-post-tags">
                {post.tags?.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="x-feed-status">
        <span>20 条公开 JSON 快照</span>
        <span>X API 定时同步预留</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark" aria-hidden="true">
            <img src="/fireworks/assets/community-logo.png" alt="" />
          </span>
          <span>一支烟花 AI 社区</span>
        </a>
        <nav className="nav-links" aria-label="主导航">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a
          className="header-action"
          href="https://github.com/yizhiyanhua-ai"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={18} aria-hidden="true" />
          GitHub
        </a>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <h1>一支烟花 AI 社区</h1>
            <p className="hero-lede">
              专注硬核 AI 内容，连接高质量洞见、开源项目与极客共创。把 AI 产品、Agent、
              模型基础设施和真实落地案例拆成可以复用的方法、工具和作品。
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#official-account">
                <MessageCircle size={18} aria-hidden="true" />
                关注公众号
              </a>
              <a
                className="button secondary"
                href="#projects"
              >
                <Boxes size={18} aria-hidden="true" />
                浏览开源项目
              </a>
            </div>
            <div className="hero-principles" aria-label="社区关键词">
              <span>硬核 AI 内容</span>
              <span>Agent 观察</span>
              <span>开源工具</span>
              <span>社群共创</span>
            </div>
            <div className="stats-row">
              <Stat value={officialAccount.originalPosts} label="原创内容" />
              <Stat value={projectStats.repos} label="公开仓库" />
              <Stat value={projectStats.stars} label="GitHub stars" />
              <Stat value={communityIntro.founded.slice(0, 4)} label="社区起点" />
            </div>
          </div>
          <div className="hero-visual" aria-label="烟花 AI 社区视觉">
            <img src="/fireworks/assets/fireworks-hero.png" alt="" />
            <div className="code-panel" aria-hidden="true">
              <span># build together</span>
              <span>def spark():</span>
              <span>  ideas = collect()</span>
              <span>  code = build(ideas)</span>
              <span>  share(code)</span>
              <span>  return impact()</span>
            </div>
          </div>
        </section>

        <section className="official-section" id="official-account">
          <div className="official-shell">
            <div className="official-copy">
              <span className="section-kicker">Official Account</span>
              <h2>公众号是社区的内容入口，也是长期研究的公开档案。</h2>
              <p>
                「{officialAccount.name}」围绕硬核 AI 内容、Agent 产品观察、模型基础设施、
                开源工具和社群共创持续输出。官网把这些内容方向和开源项目连接起来，
                让文章、代码、复盘和学习路径形成一个可继续生长的实验室。
              </p>
              <div className="official-stats" aria-label="公众号公开数据">
                <Stat value={officialAccount.originalPosts} label="原创内容" />
                <Stat value={officialAccount.videoChannel} label="视频号" />
                <Stat value={communityIntro.founded.slice(0, 4)} label="社区起点" />
              </div>
              <div className="official-proof">
                <BookOpen size={22} aria-hidden="true" />
                <span>{officialAccount.tagline}</span>
              </div>
              <div className="content-track-grid inline" aria-label="公众号内容雷达">
                {contentTracks.map((track, index) => (
                  <ContentTrackCard key={track.title} track={track} index={index} />
                ))}
              </div>
            </div>
            <aside className="official-media" aria-label="公众号入口">
              <XFeedPanel />
              <div className="qr-card compact">
                <img src={officialAccount.qrImage} alt="一支烟花 AI 公众号二维码" />
                <div>
                  <strong>扫码关注公众号</strong>
                  <span>硬核 AI 内容、Agent 观察、开源项目和社群共创记录</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="community-section section-band" id="community">
          <div className="community-shell">
            <div className="community-copy">
              <span className="section-kicker">Community Intro</span>
              <h2>{communityIntro.headline}</h2>
              <p>{communityIntro.body}</p>
              <div className="intro-notes">
                {communityIntro.notes.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="belief-panel" aria-label="社区理念">
              <div className="belief-panel-head">
                <Compass size={28} aria-hidden="true" />
                <span>公开摘要里的核心线索</span>
              </div>
              <p>
                社区介绍公开摘要显示它从 2023 年底开始，核心方向围绕 AI 实践、产品运营、
                社区定位、用户留存和差异化策略。本页只使用公开可读信息，并把不可公开部分留在来源链接里。
              </p>
              <a
                href="https://note.mowen.cn/detail/mQcaY_6GxndRz6_g8m5Uw?code=jc1ShFKLB7tkan9v"
                target="_blank"
                rel="noreferrer"
              >
                查看公开社区介绍 <ExternalLink size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="belief-grid">
            {communityBeliefs.map((belief, index) => (
              <article key={belief.title}>
                <span className="belief-icon">
                  {index === 0 && <Lightbulb size={28} aria-hidden="true" />}
                  {index === 1 && <Layers3 size={28} aria-hidden="true" />}
                  {index === 2 && <Network size={28} aria-hidden="true" />}
                </span>
                <h3>{belief.title}</h3>
                <p>{belief.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="position-section">
          <div className="section-heading left">
            <span className="section-kicker">Community Position</span>
            <h2>它连接四类长期价值。</h2>
          </div>
          <div className="position-grid">
            <article>
              <Code2 size={30} aria-hidden="true" />
              <h3>开源驱动</h3>
              <p>用代码、文档和演示站点沉淀真实经验，项目可被复制、验证和继续改造。</p>
            </article>
            <article>
              <BookOpen size={30} aria-hidden="true" />
              <h3>学习共创</h3>
              <p>把论文、工具、案例和失败复盘变成结构化材料，降低下一位实践者的成本。</p>
            </article>
            <article>
              <TerminalSquare size={30} aria-hidden="true" />
              <h3>工程落地</h3>
              <p>关注工作流、Agent、Skill、内容工具链和验证闭环，强调能跑起来的结果。</p>
            </article>
            <article>
              <Globe2 size={30} aria-hidden="true" />
              <h3>开放包容</h3>
              <p>欢迎不同背景的开发者、研究者和创作者，用公开成果连接更多协作者。</p>
            </article>
          </div>
        </section>

        <section className="projects-section section-band" id="projects">
          <div className="section-heading">
            <span className="section-kicker">AI Product Lab</span>
            <h2>把社区里的 AI 实验，打磨成可体验的产品。</h2>
            <p>
              用 Product Hunt 式的方式看这些开源项目：每个产品都对应一个真实 AI 工作流，有明确使用场景、产品特点和可复用入口。
              旗舰项目优先展示体验界面，其他工具保持清晰的产品定位。
            </p>
          </div>
          <div className="product-lab-intro" aria-label="AI 产品实验室方法">
            <span>观察前沿问题</span>
            <span>拆解真实工作流</span>
            <span>产品化为开源工具</span>
            <span>社区继续复用验证</span>
          </div>
          <div className="project-grid">
            {featuredProjects.filter((project) => project.flagship).map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
          <div className="product-portfolio-grid">
            {featuredProjects.filter((project) => !project.flagship).map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
          <div className="section-footnote">
            <a href="https://github.com/orgs/yizhiyanhua-ai/repositories" target="_blank" rel="noreferrer">
              查看全部公开仓库 <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="rhythm-section section-band" id="rhythm">
          <div className="section-heading">
            <span className="section-kicker">Learning Rhythm</span>
            <h2>学习与研究节奏</h2>
            <p>持续学习、共创分享，让长任务、工具链和开源项目形成飞轮。</p>
          </div>
          <ol className="rhythm-line">
            {rhythm.map((item, index) => (
              <li key={item.title}>
                <span className="rhythm-icon">
                  {index === 0 && <CalendarDays size={26} />}
                  {index === 1 && <BookOpen size={26} />}
                  {index === 2 && <Code2 size={26} />}
                  {index === 3 && <MessageCircle size={26} />}
                  {index === 4 && <Rocket size={26} />}
                </span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="principles-section" id="principles">
          <div className="section-heading left">
            <span className="section-kicker">Operating Principles</span>
            <h2>社区理念不是口号，是每个项目的交付标准。</h2>
            <p>官网只呈现公开且可验证的信息。私密群聊、个人联系方式、未授权材料不进入页面。</p>
          </div>
          <div className="principles-grid">
            {operatingPrinciples.map((principle) => {
              const Icon = icons[principle.title];
              return (
                <article className={`principle tone-${principle.tone}`} key={principle.title}>
                  <Icon size={30} aria-hidden="true" />
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="sources-section section-band" id="sources">
          <div className="section-heading">
            <span className="section-kicker">Resource Navigation</span>
            <h2>资源导航与公开性说明</h2>
            <p>每条来源都标注当前可验证状态，避免把登录页、私域内容或摘要片段误写成事实正文。</p>
          </div>
          <div className="source-list">
            {sourceNotes.map((source) => (
              <a
                className="source-row"
                href={source.url}
                target={source.url.startsWith('#') ? undefined : '_blank'}
                rel={source.url.startsWith('#') ? undefined : 'noreferrer'}
                key={source.url}
              >
                <div>
                  <span>{source.type}</span>
                  <h3>{source.title}</h3>
                  <p>{source.summary}</p>
                </div>
                <strong>{source.status}</strong>
              </a>
            ))}
          </div>
        </section>

        <section className="join-section">
          <div className="join-art" aria-hidden="true" />
          <div className="join-content">
            <h2>一起点燃更多 AI 的火花</h2>
            <p>
              从一个问题、一段脚本、一次复盘开始，把个人探索变成社区可以继续生长的项目、方法和理念。
            </p>
            <div className="hero-actions">
              <a
                className="button primary"
                href="https://github.com/yizhiyanhua-ai"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={18} aria-hidden="true" />
                浏览 GitHub 组织
              </a>
              <a
                className="button secondary"
                href="https://hqexj12b0g.feishu.cn/docx/TyymdoAdRodWGJxCi6FcJvEUn2b"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={18} aria-hidden="true" />
                社群介绍文档
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            <img src="/fireworks/assets/community-logo.png" alt="" />
          </span>
          <strong>一支烟花 AI 社区</strong>
        </div>
        <p>开源、共创、长期主义。本站内容基于公开资料和公开仓库构建。</p>
        <div className="footer-links">
          <a href="https://github.com/yizhiyanhua-ai" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="#projects">Projects</a>
          <a href="#sources">Sources</a>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
