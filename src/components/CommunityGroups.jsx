import { useEffect, useRef } from 'react';
import { ArrowUpRight, BookOpen, ExternalLink, ShieldCheck, Users } from 'lucide-react';
import { communityAccess, communityGroups } from '../communityData';
import { SectionIntro } from './SectionIntro';

/**
 * 3D 倾斜卡片：跟随指针的小角度旋转 + 高光扫过。
 * prefers-reduced-motion 时自动禁用。
 */
function useTilt() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const MAX = 6;
    let raf = 0;

    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        node.style.transform = `perspective(900px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX).toFixed(2)}deg) translateY(-4px)`;
        node.style.setProperty('--glare-x', `${((px + 0.5) * 100).toFixed(1)}%`);
        node.style.setProperty('--glare-y', `${((py + 0.5) * 100).toFixed(1)}%`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      node.style.transform = '';
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return ref;
}

function GroupCategoryCard({ category }) {
  const tiltRef = useTilt();

  return (
    <article className={`group-card group-card-${category.accent}`} ref={tiltRef} data-reveal>
      <div className="group-card-head">
        <span>{category.code}</span>
        <i />
      </div>
      <h3>{category.category}</h3>
      <p>{category.summary}</p>
      <ul>
        {category.groups.map((group) => (
          <li key={group.name}>
            <strong>{group.name}</strong>
            <small>{group.note}</small>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function CommunityGroups() {
  return (
    <section className="groups" id="groups">
      <div className="section-wrap">
        <SectionIntro
          eyebrow="06 / COMMUNITY GROUPS"
          title="十七个社群，各自专注一个战场。"
          body="社群按技术方向、产品联合运营和城市群三条线组织。这里只展示公开分类与定位，群聊内容、成员信息与联系方式不会出现在官网。"
          aside="PUBLIC CATEGORIES ONLY"
        />
        <div className="group-grid">
          {communityGroups.map((category) => (
            <GroupCategoryCard category={category} key={category.category} />
          ))}
        </div>
        <div className="group-cta" data-reveal>
          <div className="group-cta-main">
            <span className="group-cta-eyebrow">
              <Users size={15} aria-hidden="true" /> 加入对应社群
            </span>
            <h3>想看看哪个群适合你？</h3>
            <p>{communityAccess.joinNote}</p>
            <div className="group-cta-facts">
              <span>
                <BookOpen size={14} aria-hidden="true" /> {communityAccess.knowledgeBase}
              </span>
              <span>
                <ShieldCheck size={14} aria-hidden="true" /> {communityAccess.neutrality}
              </span>
            </div>
          </div>
          <a
            className="action action-primary group-cta-button"
            href={communityAccess.docUrl}
            target="_blank"
            rel="noreferrer"
          >
            了解社区与社群
            <ExternalLink size={16} aria-hidden="true" />
          </a>
          <ArrowUpRight className="group-cta-spark" size={64} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
