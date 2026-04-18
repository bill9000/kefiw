export const SCRABBLE_VALUES: Record<string, number> = {
  a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,
  n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10,
};

export const WWF_VALUES: Record<string, number> = {
  a:1,b:4,c:4,d:2,e:1,f:4,g:3,h:3,i:1,j:10,k:5,l:2,m:4,
  n:2,o:1,p:4,q:10,r:1,s:1,t:1,u:2,v:5,w:4,x:8,y:3,z:10,
};

export function wordScore(word: string, values: Record<string, number> = SCRABBLE_VALUES): number {
  let s = 0;
  for (const ch of word.toLowerCase()) s += values[ch] ?? 0;
  return s;
}

export function sortedLetters(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('');
}

export function canMakeFromRack(word: string, rack: string): boolean {
  const counts: Record<string, number> = {};
  let blanks = 0;
  for (const ch of rack.toLowerCase()) {
    if (ch === '?') blanks++;
    else if (/[a-z]/.test(ch)) counts[ch] = (counts[ch] ?? 0) + 1;
  }
  for (const ch of word.toLowerCase()) {
    if ((counts[ch] ?? 0) > 0) counts[ch]!--;
    else if (blanks > 0) blanks--;
    else return false;
  }
  return true;
}

export function matchesPattern(word: string, pattern: string): boolean {
  if (word.length !== pattern.length) return false;
  for (let i = 0; i < word.length; i++) {
    const p = pattern[i];
    if (p === '?' || p === '_' || p === '.') continue;
    if (p.toLowerCase() !== word[i].toLowerCase()) return false;
  }
  return true;
}
