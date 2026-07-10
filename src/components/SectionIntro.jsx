export function SectionIntro({ eyebrow, title, body, aside }) {
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
