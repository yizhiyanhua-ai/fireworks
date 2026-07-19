import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { promoFilm } from '../communityData';
import { SectionIntro } from './SectionIntro';

/**
 * 官方宣传片区块。
 * 默认只加载海报（preload="none"），点击后才开始拉取视频流。
 */
export function PromoFilm() {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play();
    setStarted(true);
  };

  return (
    <section className="film" id="film">
      <div className="section-wrap">
        <SectionIntro
          eyebrow="FILM / OFFICIAL PROMO"
          title="两分钟，看完一支烟花。"
          body={promoFilm.note}
          aside={`${promoFilm.duration} / 1080P / SOUND ON`}
        />
        <div className="film-frame" data-reveal>
          <video
            ref={videoRef}
            src={promoFilm.src}
            poster={promoFilm.poster}
            preload="none"
            playsInline
            controls={started}
            onPlay={() => setStarted(true)}
            aria-label={promoFilm.title}
          />
          {!started && (
            <button className="film-overlay" type="button" onClick={start} aria-label={`播放${promoFilm.title}`}>
              <span className="film-play">
                <Play size={30} fill="currentColor" aria-hidden="true" />
              </span>
              <span className="film-caption">
                <strong>{promoFilm.title}</strong>
                <small>{promoFilm.duration} · 点击播放</small>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
