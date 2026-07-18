import { useEffect, useRef, useState } from 'react';
import { createFireworksScene } from '../webgl/fireworks-scene';

/**
 * Hero 3D 烟花画布。
 * - WebGL2 不可用时回退为静态品牌图
 * - prefers-reduced-motion 直接渲染静态图
 * - 滚出视口 / 页面隐藏时自动暂停渲染
 */
export function HeroScene({ fallbackImage, fallbackAlt }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setFallback(true);
      return undefined;
    }

    let scene;
    try {
      scene = createFireworksScene(canvasRef.current);
    } catch {
      setFallback(true);
      return undefined;
    }
    sceneRef.current = scene;
    scene.start();
    window.__fwScene = scene;

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

    const onPointerMove = (event) => {
      const rect = host.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      scene.setPointer(nx, -ny);
    };
    const onClick = (event) => {
      const rect = host.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      scene.launchAt(Math.max(-1, Math.min(1, nx)));
    };
    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('click', onClick);

    return () => {
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('click', onClick);
      scene.destroy();
      sceneRef.current = null;
      if (window.__fwScene === scene) delete window.__fwScene;
    };
  }, []);

  if (fallback) {
    return <img className="hero-image" src={fallbackImage} alt={fallbackAlt} />;
  }

  return (
    <div className="hero-scene" ref={hostRef} aria-hidden="true">
      <canvas ref={canvasRef} className="hero-canvas" />
    </div>
  );
}
