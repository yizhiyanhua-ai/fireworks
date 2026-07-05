import { createRoot } from 'react-dom/client';
import {
  BookOpen,
  Boxes,
  CalendarDays,
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
  Sparkles,
  Star,
  TerminalSquare,
  Users,
} from 'lucide-react';
import {
  communityBeliefs,
  communityIntro,
  featuredProjects,
  operatingPrinciples,
  projectStats,
  rhythm,
  sourceNotes,
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
  ['社区介绍', '#community'],
  ['社区理念', '#principles'],
  ['开源项目', '#projects'],
  ['学习共创', '#rhythm'],
  ['资源导航', '#sources'],
];

function Stat({ value, label }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article className={`project-card accent-${project.accent}`}>
      <div className="project-topline">
        <span>{project.category}</span>
        <span>{project.language}</span>
      </div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="tag-row">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
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
        <a href={project.url} target="_blank" rel="noreferrer">
          GitHub <ExternalLink size={15} aria-hidden="true" />
        </a>
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer">
            Demo <ExternalLink size={15} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}

function App() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark" aria-hidden="true">
            <Sparkles size={20} />
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
              把 AI 实践变成可复用的方法、工具和作品。连接学习共创、工程项目和内容研究，
              让一次探索成为下一次行动的基础设施，也让社区的知识和理念不断沉淀。
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">
                <Boxes size={18} aria-hidden="true" />
                浏览开源项目
              </a>
              <a
                className="button secondary"
                href="#community"
              >
                <Users size={18} aria-hidden="true" />
                了解社区理念
              </a>
            </div>
            <div className="hero-principles" aria-label="社区关键词">
              <span>开源开放</span>
              <span>知识共创</span>
              <span>透明协作</span>
              <span>长期主义</span>
            </div>
            <div className="stats-row">
              <Stat value={projectStats.repos} label="公开仓库" />
              <Stat value={projectStats.stars} label="GitHub stars" />
              <Stat value={projectStats.forks} label="Forks" />
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

        <section className="projects-section" id="projects">
          <div className="section-heading">
            <span className="section-kicker">Open Source Matrix</span>
            <h2>开源项目矩阵</h2>
            <p>
              以下项目来自 yizhiyanhua-ai 组织公开仓库。星标、Fork 和更新时间来自 2026-07-05
              的 GitHub API 快照。
            </p>
          </div>
          <div className="project-grid">
            {featuredProjects.map((project) => (
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
              <a className="source-row" href={source.url} target="_blank" rel="noreferrer" key={source.url}>
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
            <Sparkles size={18} />
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
