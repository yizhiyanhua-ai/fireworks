import { useEffect, useRef, useState } from 'react';
import { createFireworksScene } from '../webgl/fireworks-scene';

/**
 * 通用烟花画布。
 * - WebGL2 不可用时回退为静态品牌图（提供 fallbackImage 时）
 * - prefers-reduced-motion 直接渲染静态图 / 不启动动画
 * - 滚出视口 / 页面隐藏时自动暂停渲染
 * - interactive=false 时仅作氛围背景（无指针视差与点击发射）
 */
export function FireworksCanvas({
  fallbackImage,
  fallbackAlt = '',
  className = '',
  sceneOptions = {},
  interactive = true,
  label,
}) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setFallback(true);
      return undefined;
    }

    let scene;
    try {
      scene = createFireworksScene(canvasRef.current, sceneOptions);
    } catch {
      setFallback(true);
      return undefined;
    }
    scene.start();
    window.__fwScene = window.__fwScene || scene;

    const host = hostRef.current;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) scene.start();
        else scene.stop();
      },
      { threshold: 0.02 },
    );
    visibilityObserver.observe(host);

    const onVisibilityChange = () => {
      if (document.hidden) scene.stop();
      else scene.start();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let onPointerMove;
    let onClick;
    if (interactive) {
      onPointerMove = (event) => {
        const rect = host.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        scene.setPointer(nx, -ny);
      };
      onClick = (event) => {
        const rect = host.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        scene.launchAt(Math.max(-1, Math.min(1, nx)));
      };
      host.addEventListener('pointermove', onPointerMove);
      host.addEventListener('click', onClick);
    }

    return () => {
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (interactive) {
        host.removeEventListener('pointermove', onPointerMove);
        host.removeEventListener('click', onClick);
      }
      scene.destroy();
      if (window.__fwScene === scene) delete window.__fwScene;
    };
  }, []);

  if (fallback) {
    if (!fallbackImage) return null;
    return <img className={`${className} hero-image`} src={fallbackImage} alt={fallbackAlt} />;
  }

  return (
    <div className={`hero-scene ${className}`} ref={hostRef} aria-hidden={label ? undefined : 'true'} aria-label={label}>
      <canvas ref={canvasRef} className="hero-canvas" />
    </div>
  );
}
