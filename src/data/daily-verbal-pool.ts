// Puzzle pools for Kefiw Verbal daily games. Kept separate from the standalone
// Vibe components (src/components/tools/Vibe*.tsx) so the daily pipeline can
// evolve without touching the evergreen tools. Some content is duplicated on
// purpose — that's the trade-off for zero churn on existing pages.
//
// Each pool feeds `src/lib/daily-verbal-puzzles.ts`, which deterministically
// picks one puzzle per (dailyDate, gameId).

// ---------------------------------------------------------------------------
// Cryptogram quotes (verbal-crypt)
// ---------------------------------------------------------------------------
export interface CryptQuote {
  text: string;
  author: string;
}

export const CRYPT_QUOTES: CryptQuote[] = [
  { text: 'THE GREATEST DANGER TO THE FUTURE IS APATHY.', author: 'JANE GOODALL' },
  { text: 'THE MEASURE OF INTELLIGENCE IS THE ABILITY TO CHANGE.', author: 'ALBERT EINSTEIN' },
  { text: 'THE BEST WAY TO PREDICT THE FUTURE IS TO INVENT IT.', author: 'ALAN KAY' },
  { text: 'SIMPLICITY IS THE ULTIMATE SOPHISTICATION.', author: 'LEONARDO DA VINCI' },
  { text: 'I THINK THEREFORE I AM.', author: 'RENE DESCARTES' },
  { text: 'THE UNEXAMINED LIFE IS NOT WORTH LIVING.', author: 'SOCRATES' },
  { text: 'KNOWLEDGE ITSELF IS POWER.', author: 'FRANCIS BACON' },
  { text: 'IMAGINATION IS MORE IMPORTANT THAN KNOWLEDGE.', author: 'ALBERT EINSTEIN' },
  { text: 'THE ONLY TRUE WISDOM IS IN KNOWING YOU KNOW NOTHING.', author: 'SOCRATES' },
  { text: 'THE MIND IS NOT A VESSEL TO BE FILLED BUT A FIRE TO BE KINDLED.', author: 'PLUTARCH' },
  { text: 'PROGRAMS MUST BE WRITTEN FOR PEOPLE TO READ.', author: 'HAROLD ABELSON' },
  { text: 'WE SHAPE OUR TOOLS AND THEREAFTER OUR TOOLS SHAPE US.', author: 'MARSHALL MCLUHAN' },
  { text: 'WHAT WE KNOW IS A DROP WHAT WE DO NOT KNOW IS AN OCEAN.', author: 'ISAAC NEWTON' },
  { text: 'IT IS NEVER TOO LATE TO BE WHAT YOU MIGHT HAVE BEEN.', author: 'GEORGE ELIOT' },
  { text: 'TO IMPROVE IS TO CHANGE TO BE PERFECT IS TO CHANGE OFTEN.', author: 'CHURCHILL' },
  { text: 'THE BEST TIME TO PLANT A TREE WAS TWENTY YEARS AGO THE NEXT BEST TIME IS NOW.', author: 'PROVERB' },
  { text: 'WE CANNOT SOLVE OUR PROBLEMS WITH THE SAME THINKING WE USED TO CREATE THEM.', author: 'ALBERT EINSTEIN' },
  { text: 'IN THE MIDDLE OF DIFFICULTY LIES OPPORTUNITY.', author: 'ALBERT EINSTEIN' },
  { text: 'DO ONE THING EVERY DAY THAT SCARES YOU.', author: 'ELEANOR ROOSEVELT' },
  { text: 'WELL DONE IS BETTER THAN WELL SAID.', author: 'BENJAMIN FRANKLIN' },
];

// ---------------------------------------------------------------------------
// Link / grouping puzzles (verbal-link) — 4 categories of 4 items each
// ---------------------------------------------------------------------------
export type LinkLevel = 1 | 2 | 3 | 4;
export interface LinkCategory {
  key: string;
  name: string;
  level: LinkLevel;
  items: string[];
}
export interface LinkPuzzleDef {
  id: string;
  title: string;
  categories: LinkCategory[];
}

export const LINK_PUZZLES: LinkPuzzleDef[] = [
  {
    id: 'ai-stack',
    title: 'AI Stack',
    categories: [
      { key: 'llms',   name: 'LLM Chatbots',    level: 1, items: ['GPT', 'CLAUDE', 'LLAMA', 'GEMINI'] },
      { key: 'fw',     name: 'JS Frameworks',   level: 2, items: ['REACT', 'VUE', 'SVELTE', 'ANGULAR'] },
      { key: 'cloud',  name: 'Cloud Platforms', level: 3, items: ['AWS', 'AZURE', 'VERCEL', 'HEROKU'] },
      { key: 'snakes', name: 'Snakes',          level: 4, items: ['PYTHON', 'COBRA', 'VIPER', 'MAMBA'] },
    ],
  },
  {
    id: 'terminal',
    title: 'Terminal World',
    categories: [
      { key: 'cmd',    name: 'Terminal Commands', level: 1, items: ['LS', 'CD', 'GREP', 'SUDO'] },
      { key: 'distro', name: 'Linux Distros',     level: 2, items: ['UBUNTU', 'FEDORA', 'ARCH', 'DEBIAN'] },
      { key: 'editor', name: 'Text Editors',      level: 3, items: ['VIM', 'EMACS', 'NANO', 'ATOM'] },
      { key: 'db',     name: 'Databases',         level: 4, items: ['POSTGRES', 'REDIS', 'MONGO', 'MYSQL'] },
    ],
  },
  {
    id: 'crypto',
    title: 'Secure Channel',
    categories: [
      { key: 'hash',   name: 'Hash Algorithms',   level: 1, items: ['SHA256', 'MD5', 'BLAKE', 'BCRYPT'] },
      { key: 'proto',  name: 'Network Protocols', level: 2, items: ['HTTP', 'SSH', 'FTP', 'DNS'] },
      { key: 'cipher', name: 'Ciphers',           level: 3, items: ['AES', 'RSA', 'DES', 'ECDSA'] },
      { key: 'ports',  name: 'Famous Ports',      level: 4, items: ['80', '443', '22', '21'] },
    ],
  },
  {
    id: 'kitchen',
    title: 'Kitchen Table',
    categories: [
      { key: 'fruit',  name: 'Fruits',            level: 1, items: ['APPLE', 'PEAR', 'GRAPE', 'MANGO'] },
      { key: 'herb',   name: 'Kitchen Herbs',     level: 2, items: ['BASIL', 'THYME', 'MINT', 'DILL'] },
      { key: 'spice',  name: 'Warm Spices',       level: 3, items: ['CINNAMON', 'CLOVE', 'NUTMEG', 'GINGER'] },
      { key: 'pepper', name: 'Chili Peppers',     level: 4, items: ['SERRANO', 'POBLANO', 'HABANERO', 'GHOST'] },
    ],
  },
  {
    id: 'on-paper',
    title: 'On Paper',
    categories: [
      { key: 'poem',   name: 'Poem Forms',        level: 1, items: ['HAIKU', 'SONNET', 'ODE', 'TANKA'] },
      { key: 'fiction',name: 'Fiction Genres',    level: 2, items: ['MYSTERY', 'FANTASY', 'HORROR', 'ROMANCE'] },
      { key: 'author', name: 'American Authors',  level: 3, items: ['HEMINGWAY', 'FITZGERALD', 'MORRISON', 'BALDWIN'] },
      { key: 'verb',   name: 'Writing Verbs',     level: 4, items: ['DRAFT', 'REVISE', 'PUBLISH', 'RETRACT'] },
    ],
  },
  {
    id: 'workshop',
    title: 'Workshop',
    categories: [
      { key: 'wood',   name: 'Woodworking Tools', level: 1, items: ['SAW', 'DRILL', 'CHISEL', 'PLANE'] },
      { key: 'metal',  name: 'Metal Types',       level: 2, items: ['STEEL', 'BRASS', 'COPPER', 'ALUMINUM'] },
      { key: 'fasten', name: 'Fasteners',         level: 3, items: ['SCREW', 'BOLT', 'RIVET', 'NAIL'] },
      { key: 'finish', name: 'Finishes',          level: 4, items: ['VARNISH', 'LACQUER', 'STAIN', 'SHELLAC'] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Letter-shift columns (verbal-shift) — column-shift into target words
// ---------------------------------------------------------------------------
export interface ShiftLevel {
  name: string;
  columns: string[][];
  words: string[];
}

export const SHIFT_LEVELS: ShiftLevel[] = [
  { name: 'Ignition',  columns: [['S'], ['H', 'T', 'M'], ['I', 'O'], ['N', 'L'], ['E']],                words: ['SHINE', 'STONE', 'SMILE'] },
  { name: 'Voltage',   columns: [['C', 'B'], ['R'], ['A'], ['N', 'I', 'T', 'K'], ['E']],                words: ['CRANE', 'BRAIN', 'CRATE', 'BRAKE'] },
  { name: 'Chromatic', columns: [['S'], ['M', 'T', 'H', 'P'], ['A'], ['R'], ['T', 'D', 'K']],          words: ['SMART', 'START', 'SHARD', 'SHARK', 'SPARK'] },
  { name: 'Canyon',    columns: [['G', 'W'], ['R', 'A'], ['A', 'T'], ['V', 'N'], ['E', 'D']],          words: ['GRAVE', 'GRADE', 'WATER', 'WADED'] },
  { name: 'Horizon',   columns: [['P', 'L'], ['L', 'I'], ['A', 'G'], ['N', 'H'], ['E', 'T']],          words: ['PLANE', 'LIGHT', 'PIGHT', 'PLANT'] },
  { name: 'Mesa',      columns: [['M', 'T'], ['A', 'O'], ['R', 'W'], ['E', 'C'], ['H', 'R']],          words: ['MARCH', 'TOWER', 'MOTHER'] },
];

// ---------------------------------------------------------------------------
// Mini crosswords (verbal-crosser) — small grids with a letter pool
// ---------------------------------------------------------------------------
export type CrosserDir = 'H' | 'V';
export interface CrosserPlacement {
  row: number;
  col: number;
  dir: CrosserDir;
}
export interface CrosserPuzzleDef {
  letters: string;
  words: string[];
  placements: Record<string, CrosserPlacement>;
  rows: number;
  cols: number;
}

export const CROSSER_PUZZLES: CrosserPuzzleDef[] = [
  {
    letters: 'SHIRT',
    words: ['SHIRT', 'HITS', 'STIR'],
    placements: {
      SHIRT: { row: 0, col: 0, dir: 'H' },
      HITS:  { row: 0, col: 1, dir: 'V' },
      STIR:  { row: 0, col: 0, dir: 'V' },
    },
    rows: 4,
    cols: 5,
  },
  {
    letters: 'CRANE',
    words: ['CRANE', 'RACE', 'CAR'],
    placements: {
      CRANE: { row: 0, col: 0, dir: 'H' },
      RACE:  { row: 0, col: 1, dir: 'V' },
      CAR:   { row: 0, col: 0, dir: 'V' },
    },
    rows: 4,
    cols: 5,
  },
  {
    letters: 'BRAIN',
    words: ['BRAIN', 'RAIN', 'BAR'],
    placements: {
      BRAIN: { row: 0, col: 0, dir: 'H' },
      RAIN:  { row: 0, col: 1, dir: 'V' },
      BAR:   { row: 0, col: 0, dir: 'V' },
    },
    rows: 4,
    cols: 5,
  },
  {
    letters: 'STONE',
    words: ['STONE', 'TONE', 'SON'],
    placements: {
      STONE: { row: 0, col: 0, dir: 'H' },
      TONE:  { row: 0, col: 1, dir: 'V' },
      SON:   { row: 0, col: 0, dir: 'V' },
    },
    rows: 4,
    cols: 5,
  },
  {
    letters: 'PRIME',
    words: ['PRIME', 'RIME', 'PIE'],
    placements: {
      PRIME: { row: 0, col: 0, dir: 'H' },
      RIME:  { row: 0, col: 1, dir: 'V' },
      PIE:   { row: 0, col: 0, dir: 'V' },
    },
    rows: 4,
    cols: 5,
  },
  {
    letters: 'CLOUD',
    words: ['CLOUD', 'LOUD', 'CUE'],
    placements: {
      CLOUD: { row: 0, col: 0, dir: 'H' },
      LOUD:  { row: 0, col: 1, dir: 'V' },
      CUE:   { row: 0, col: 0, dir: 'V' },
    },
    rows: 4,
    cols: 5,
  },
];

// ---------------------------------------------------------------------------
// Word-twist seeds (verbal-twist) — find as many real words as possible
// ---------------------------------------------------------------------------
export const TWIST_SEEDS: string[] = [
  'RETAINS', 'PAINTER', 'THUNDER', 'OUTLINE', 'GLISTEN',
  'CAPITOL', 'NUCLEAR', 'GRANITE', 'STEWARD', 'BEDROCK',
  'PASTURE', 'DIAMOND', 'OPERATE', 'BALANCE', 'QUARTER',
  'SPINACH', 'CONSUME', 'PROTECT', 'JOURNAL', 'MARVELS',
];
