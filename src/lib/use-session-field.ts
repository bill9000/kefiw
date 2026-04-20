import { useEffect, useState } from 'react';
import { readContext, subscribe, type FieldValue } from './session-context';

export function useSessionField(key: string): FieldValue | undefined {
  const [field, setField] = useState<FieldValue | undefined>(undefined);

  useEffect(() => {
    setField(readContext()[key]);
    const unsubscribe = subscribe(() => {
      setField(readContext()[key]);
    });
    return unsubscribe;
  }, [key]);

  return field;
}

export function useSessionContext(): Record<string, FieldValue> {
  const [ctx, setCtx] = useState<Record<string, FieldValue>>({});

  useEffect(() => {
    setCtx(readContext());
    const unsubscribe = subscribe(() => setCtx(readContext()));
    return unsubscribe;
  }, []);

  return ctx;
}
