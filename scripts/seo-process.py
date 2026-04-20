"""Process the latest SEO signal cache and emit a structured summary."""
import json, os, sys

CACHE_ROOT = r'D:\kefiw\.seo-cache'

def latest_ts():
    with open(os.path.join(CACHE_ROOT, 'latest.txt'), encoding='utf-8') as f:
        return f.read().strip()

def load(d, name):
    p = os.path.join(d, name)
    try:
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        return {'_err': str(e)}

def main():
    ts = sys.argv[1] if len(sys.argv) > 1 else latest_ts()
    d = os.path.join(CACHE_ROOT, ts)
    print(f'Cache: {d}')
    files = sorted(os.listdir(d))
    print(f'Files: {len(files)}')

    print('\n=== PAA REFI ===')
    x = load(d, 'paa-refi.json')
    for q in (x.get('related_questions') or [])[:8]:
        print('  Q:', q.get('question'))
    print('  Related:')
    for r in (x.get('related_searches') or [])[:8]:
        print('   -', r.get('query'))

    print('\n=== PAA SMBTAX ===')
    x = load(d, 'paa-sbtax.json')
    for q in (x.get('related_questions') or [])[:8]:
        print('  Q:', q.get('question'))
    print('  Related:')
    for r in (x.get('related_searches') or [])[:8]:
        print('   -', r.get('query'))

    print('\n=== AUTOCOMPLETE ===')
    for f in files:
        if f.startswith('ac-'):
            x = load(d, f)
            seed = f[3:].replace('+', ' ').replace('.json', '')
            sugs = (x.get('suggestions') or [])[:6]
            print(f'  [{seed}]')
            for s in sugs:
                print('    -', s.get('value'))

    print('\n=== TRENDING NOW — money-adjacent ===')
    t = load(d, 'trending.json')
    trends = t.get('trending_searches') or []
    money_kw = ['tax','refinanc','loan','mortgage','insur','income','credit','invest',
                'salary','stock','401','medicare','social security','bill','rent',
                'budget','retir','debt','afford','ira','hsa','roi','freelanc','pay']
    hits = []
    for tr in trends[:300]:
        q = (tr.get('query') or '').lower()
        if any(k in q for k in money_kw):
            hits.append(tr.get('query'))
    print(f'  {len(hits)} hits from top 300')
    for h in hits[:15]:
        print('  -', h)

    print('\n=== PRODUCT HUNT top 10 ===')
    ph = load(d, 'ph.json')
    edges = ((ph.get('data') or {}).get('posts') or {}).get('edges', [])
    for e in edges[:10]:
        n = e['node']
        topics = ','.join(t['node']['name'] for t in n.get('topics', {}).get('edges', [])[:3])
        print(f"  - {n['name']} ({n['votesCount']}) [{topics}] — {n['tagline'][:70]}")

    print('\n=== HN calc/tool stories ===')
    hn = load(d, 'hn.json')
    for h in (hn.get('hits') or [])[:10]:
        print(f"  - [{h.get('points')}] {h.get('title','')[:90]}")

    print('\n=== TAVILY synthesis ===')
    tv = load(d, 'tavily.json')
    print('Answer:', (tv.get('answer') or '')[:500])
    for r in (tv.get('results') or [])[:5]:
        print(f"  - {r.get('title','')[:70]}")

    print('\n=== EXA neural ===')
    ex = load(d, 'exa.json')
    for r in (ex.get('results') or [])[:8]:
        print(f"  - {r.get('title','')[:70]} — {r.get('url','')[:50]}")

    print('\n=== REDDIT top by sub ===')
    for sub in ['personalfinance', 'Entrepreneur', 'smallbusiness', 'freelance']:
        x = load(d, f'reddit-{sub}.json')
        posts = ((x.get('data') or {}).get('children') or [])[:5]
        print(f'  [r/{sub}]')
        for p in posts:
            title = p['data'].get('title', '')[:85]
            ups = p['data'].get('ups', 0)
            print(f"    ({ups}) {title}")

if __name__ == '__main__':
    main()
