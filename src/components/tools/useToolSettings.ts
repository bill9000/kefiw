import { useEffect, useState } from 'react';

export function useToolSetting<T extends string>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    try {
      const v = localStorage.getItem(key);
      if (v !== null) setValue(v as T);
    } catch { /* noop */ }
  }, [key]);
  const set = (v: T) => {
    setValue(v);
    try { localStorage.setItem(key, v); } catch { /* noop */ }
  };
  return [value, set];
}

export function useToolBool(key: string, initial: boolean): [boolean, (v: boolean) => void] {
  const [value, setValue] = useState<boolean>(initial);
  useEffect(() => {
    try {
      const v = localStorage.getItem(key);
      if (v !== null) setValue(v === '1');
    } catch { /* noop */ }
  }, [key]);
  const set = (v: boolean) => {
    setValue(v);
    try { localStorage.setItem(key, v ? '1' : '0'); } catch { /* noop */ }
  };
  return [value, set];
}
