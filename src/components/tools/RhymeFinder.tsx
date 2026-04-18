import { useEffect, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import CopyButton from '../CopyButton';

export default function RhymeFinder() {
  const { send } = useWordWorker();
  const [word, setWord] = useState('');
  const [data, setData] = useState<{ perfect: string[]; near: string[] }>({ perfect: [], near: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const v = word.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!v) { setData({ perfect: [], near: [] }); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const res = await send<{ perfect: string[]; near: string[] }>('rhymes', { word: v });
      setData(res);
      setLoading(false);
    }, 160);
    return () => clearTimeout(t);
  }, [word, send]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label" htmlFor="w">Word</label>
        <input id="w" className="input font-mono" value={word} onChange={(e) => setWord(e.target.value)} placeholder="e.g. time" autoFocus />
      </div>
      {loading && <div className="text-sm text-slate-500">Searching rhymes…</div>}
      {!loading && (data.perfect.length > 0 || data.near.length > 0) && (
        <>
          <RhymeBlock title="Perfect rhymes" words={data.perfect} />
          <RhymeBlock title="Near rhymes" words={data.near} />
        </>
      )}
      <p className="text-xs text-slate-500">Rhymes are computed by trailing-letter match. For a full phonetic dictionary, a CMU-style engine is planned.</p>
    </div>
  );
}

function RhymeBlock({ title, words }: { title: string; words: string[] }) {
  if (!words.length) return null;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-sm font-medium text-slate-700">{title} ({words.length})</div>
        <CopyButton value={words.join('\n')} label="Copy" />
      </div>
      <div className="flex flex-wrap gap-1">
        {words.map((w) => <span key={w} className="chip">{w}</span>)}
      </div>
    </div>
  );
}
