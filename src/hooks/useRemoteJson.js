import { useEffect, useRef, useState } from 'react';

export function useRemoteJson(path, fallback) {
  const fallbackRef = useRef(fallback);
  const [data, setData] = useState(() => fallbackRef.current);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${import.meta.env.BASE_URL}${path}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`${path}: ${response.status}`);
        return response.json();
      })
      .then(setData)
      .catch((error) => {
        if (error.name !== 'AbortError') setData(fallbackRef.current);
      });

    return () => controller.abort();
  }, [path]);

  return data;
}
