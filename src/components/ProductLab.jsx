import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Github,
  GitFork,
  Star,
  Zap,
} from 'lucide-react';
import { featuredProjects } from '../communityData';
import { useRemoteJson } from '../hooks/useRemoteJson';
import { formatSnapshotDate } from '../utils/content';
import { SectionIntro } from './SectionIntro';

const PROJECT_METRICS_FALLBACK = {
  updatedAt: '2026-07-15T00:00:00+08:00',
  projects: Object.fromEntries(
    featuredProjects.map((project) => [project.name, { stars: project.stars, forks: project.forks }]),
  ),
};

function ProductVisual({ project }) {
  return (
    <figure className={`product-visual preview-${project.previewFit || 'contain'}`}>
      <img
        src={project.previewImage}
        alt={project.previewAlt || `${project.name} 项目预览`}
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <span>{project.previewSource}</span>
        <a href={project.url} target="_blank" rel="noreferrer">
          查看源项目 <ExternalLink size={13} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}

export function ProductLab() {
  const projectSnapshot = useRemoteJson('assets/github-projects.json', PROJECT_METRICS_FALLBACK);
  const projects = useMemo(
    () => featuredProjects.map((project) => ({
      ...project,
      ...projectSnapshot.projects?.[project.name],
    })),
    [projectSnapshot],
  );
  const categories = useMemo(
    () => ['全部', ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );
  const [category, setCategory] = useState('全部');
  const filtered = category === '全部' ? projects : projects.filter((project) => project.category === category);
  const [selectedName, setSelectedName] = useState(featuredProjects[0].name);
  const selected = filtered.find((project) => project.name === selectedName) || filtered[0];

  function selectCategory(nextCategory) {
    setCategory(nextCategory);
    const nextProjects = nextCategory === '全部'
      ? projects
      : projects.filter((project) => project.category === nextCategory);
    setSelectedName(nextProjects[0].name);
  }

  return (
    <section className="product-lab" id="products">
      <div className="section-wrap">
        <SectionIntro
          eyebrow="01 / AI PRODUCT LAB"
          title="社区的价值，要落到可以被使用的产品上。"
          body="这里展示的每个项目都来自真实工作流：观察问题、形成方法、做成工具、公开验证。你看到的不只是仓库列表，而是一组持续进化的 AI 产品。"
          aside={`${projects.length} PRODUCTS / OPEN SOURCE`}
        />
        <div className="product-filter" role="group" aria-label="按产品方向筛选">
          {categories.map((item) => (
            <button
              type="button"
              aria-pressed={category === item}
              className={category === item ? 'active' : ''}
              key={item}
              onClick={() => selectCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="product-stage" id="product-showcase" data-reveal aria-live="polite">
          <div className="product-stage-copy">
            <div className="product-stage-meta">
              <span>CURATED {selected.launchRank}</span>
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
            <div className="product-metrics" aria-label="GitHub 公开数据快照">
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
              aria-pressed={selected.name === project.name}
              aria-controls="product-showcase"
              className={selected.name === project.name ? 'active' : ''}
              onClick={() => setSelectedName(project.name)}
              key={project.name}
            >
              <span className="product-index-number">{String(index + 1).padStart(2, '0')}</span>
              <span className={`product-index-icon accent-${project.accent}`}>
                <img src={project.previewImage} alt="" loading="lazy" decoding="async" />
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
        <p className="product-snapshot-note">
          GitHub 数据快照更新于 {formatSnapshotDate(projectSnapshot.updatedAt)}；排名为社区策展顺序，不代表实时投票。
        </p>
        <a className="all-projects-link" href="https://github.com/orgs/yizhiyanhua-ai/repositories" target="_blank" rel="noreferrer">
          浏览全部公开仓库 <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
