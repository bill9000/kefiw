import { useEffect, useRef, useCallback } from 'react';

type Envelope = { id: number; payload: any };

export function useWordWorker() {
  const workerRef = useRef<Worker | null>(null);
  const seqRef = useRef(0);
  const pendingRef = useRef<Map<number, (payload: any) => void>>(new Map());

  useEffect(() => {
    const w = new Worker(new URL('../../workers/word.worker.ts', import.meta.url), { type: 'module' });
    w.onmessage = (e: MessageEvent<Envelope>) => {
      const { id, payload } = e.data;
      const resolver = pendingRef.current.get(id);
      if (resolver) {
        pendingRef.current.delete(id);
        resolver(payload);
      }
    };
    workerRef.current = w;
    return () => {
      w.terminate();
      workerRef.current = null;
    };
  }, []);

  const send = useCallback(<T = any>(kind: string, data: Record<string, unknown> = {}): Promise<T> => {
    return new Promise((resolve, reject) => {
      const w = workerRef.current;
      if (!w) { reject(new Error('worker not ready')); return; }
      const id = ++seqRef.current;
      pendingRef.current.set(id, resolve);
      w.postMessage({ id, kind, ...data });
    });
  }, []);

  return { send };
}
