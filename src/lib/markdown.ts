// Minimal markdown-to-HTML renderer for writer-AI longform prose.
// Supported: H2/H3 headings, paragraphs, inline links, bold, italic, code, blockquote.
// Intentionally small — the writer outputs a constrained dialect.

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

function renderInline(raw: string): string {
  let s = escapeHtml(raw);
  // Inline code `code`
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold **text**
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  // Italic _text_ or *text*
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/(^|[\s(])_([^_\n]+)_/g, '$1<em>$2</em>');
  // Links [label](/url/)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    const isExternal = /^https?:\/\//i.test(href);
    const attrs = isExternal ? ' rel="noopener" target="_blank"' : '';
    return `<a href="${href}"${attrs}>${label}</a>`;
  });
  return s;
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let para: string[] = [];
  let inList: 'ul' | 'ol' | null = null;

  function flushPara() {
    if (para.length > 0) {
      out.push(`<p>${renderInline(para.join(' ').trim())}</p>`);
      para = [];
    }
  }
  function flushList() {
    if (inList) {
      out.push(`</${inList}>`);
      inList = null;
    }
  }
  function flushAll() {
    flushPara();
    flushList();
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line === '') {
      flushAll();
      continue;
    }
    const h3 = /^###\s+(.+)$/.exec(line);
    const h2 = /^##\s+(.+)$/.exec(line);
    const ulItem = /^[-*]\s+(.+)$/.exec(line);
    const olItem = /^(\d+)\.\s+(.+)$/.exec(line);
    const bq = /^>\s?(.*)$/.exec(line);

    if (h3) {
      flushAll();
      out.push(`<h3>${renderInline(h3[1])}</h3>`);
    } else if (h2) {
      flushAll();
      out.push(`<h2>${renderInline(h2[1])}</h2>`);
    } else if (ulItem) {
      flushPara();
      if (inList !== 'ul') {
        flushList();
        inList = 'ul';
        out.push('<ul>');
      }
      out.push(`<li>${renderInline(ulItem[1])}</li>`);
    } else if (olItem) {
      flushPara();
      if (inList !== 'ol') {
        flushList();
        inList = 'ol';
        out.push('<ol>');
      }
      out.push(`<li>${renderInline(olItem[2])}</li>`);
    } else if (bq) {
      flushAll();
      out.push(`<blockquote>${renderInline(bq[1])}</blockquote>`);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushAll();
  return out.join('\n');
}
