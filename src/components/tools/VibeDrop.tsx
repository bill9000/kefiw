import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, Zap } from 'lucide-react';

const STORAGE_KEY = 'vibedrop-stats-v1';
const COLS = 7;
const ROWS = 9;
const TILE = 48;
const GAP = 6;
const CELL = TILE + GAP;
const MIN_WORD = 3;
const BLAST_LEN = 5;

const LETTER_BAG =
  'E'.repeat(12) +
  'A'.repeat(9) +
  'I'.repeat(9) +
  'O'.repeat(8) +
  'N'.repeat(6) +
  'R'.repeat(6) +
  'T'.repeat(6) +
  'S'.repeat(4) +
  'L'.repeat(4) +
  'D'.repeat(4) +
  'U'.repeat(4) +
  'G'.repeat(3) +
  'H'.repeat(3) +
  'C'.repeat(2) +
  'M'.repeat(2) +
  'W'.repeat(2) +
  'Y'.repeat(2) +
  'F'.repeat(2) +
  'P'.repeat(2) +
  'B'.repeat(2) +
  'V'.repeat(2) +
  'KJXQZ';

function randomLetter(): string {
  return LETTER_BAG[Math.floor(Math.random() * LETTER_BAG.length)];
}

type Tile = { id: string; letter: string; row: number; col: number };
type Cell = { row: number; col: number };

let tileCounter = 0;
function makeTile(letter: string, row: number, col: number): Tile {
  return { id: `t${++tileCounter}`, letter, row, col };
}

function generateBoard(): Tile[] {
  const t: Tile[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) t.push(makeTile(randomLetter(), r, c));
  }
  return t;
}

function adjacent(a: Cell, b: Cell): boolean {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return dr <= 1 && dc <= 1 && dr + dc > 0;
}

function same(a: Cell, b: Cell): boolean {
  return a.row === b.row && a.col === b.col;
}

// Instant-play core dictionary (~350 common 3-6 letter words).
// Augmented at mount from /data/enable.txt (172k words) when available.
const CORE_WORDS: Set<string> = new Set([
  'ace','act','add','age','ago','aid','aim','air','all','and','any','arc','are','arm','art','ash','ask','ate','awe','axe',
  'bad','bag','ban','bar','bat','bay','bed','bee','beg','bet','bid','big','bin','bit','bow','box','boy','bud','bug','bun','bus','but','buy','bye',
  'cab','can','cap','car','cat','cow','cry','cub','cue','cup','cut',
  'dad','dam','day','den','did','die','dig','dim','dip','dog','dot','dry','due','dug','duo',
  'ear','eat','egg','ego','end','era','eve','eye',
  'fan','far','fat','fed','fee','few','fig','fin','fit','fix','fly','foe','for','fox','fry','fun','fur',
  'gag','gap','gas','gem','get','gin','got','gum','gun','gut','guy','gym',
  'had','has','hat','hay','hem','hen','her','hey','hid','him','hip','his','hit','hot','how','hub','hug','hut',
  'ice','icy','ill','ink','inn','its',
  'jab','jam','jar','jaw','jet','job','jog','joy','jug',
  'key','kid','kin','kit',
  'lab','lad','lag','lap','law','lay','led','leg','let','lid','lie','lip','lit','log','lot','low',
  'mad','man','map','mat','may','men','met','mid','mix','mob','mom','mop','mud','mug',
  'nap','net','new','nil','nip','nod','nor','not','now','nut',
  'oak','oar','odd','off','oil','old','one','orb','our','out','owe','owl','own',
  'pad','pal','pan','pat','paw','pay','pea','pen','per','pet','pie','pig','pin','pit','pod','pop','pot','pub','pun','put',
  'rag','ram','ran','rap','rat','raw','ray','red','rib','rid','rig','rim','rip','rob','rod','rot','row','rub','rug','rum','run','rye',
  'sad','sap','sat','saw','say','sea','see','set','sew','she','shy','sin','sip','sir','sit','six','ski','sky','sly','sob','son','soy','spa','spy','sub','sum','sun',
  'tab','tag','tan','tap','tar','tax','tea','tee','ten','the','tie','tin','tip','toe','ton','too','top','tot','toy','try','tub','tug','two',
  'urn','use','van','vat','vet','via','vie','vow',
  'wag','war','was','wax','way','web','wed','wee','wet','who','why','wig','win','wit','woe','won','woo','wow',
  'yak','yam','yap','yea','yen','yes','yet','you','zap','zip','zoo',
  'able','acid','area','army','back','ball','band','bank','base','bath','bean','bear','beat','been','beer','bell','belt','best','bike','bill','bird','blow','blue','boat','body','bond','bone','book','boom','born','boss','both','bowl','burn','busy',
  'cake','call','calm','came','camp','card','care','case','cash','cast','cell','chat','chip','city','club','coal','coat','code','cold','come','cook','cool','cope','copy','core','cost','crew','crop','cure','cute',
  'dark','data','date','dawn','dead','deal','dear','debt','deep','deny','desk','dial','dice','diet','dirt','dish','done','door','dose','down','draw','drew','drip','drop','drug','drum','dual','duck','duke','dull','dust','duty',
  'each','earn','ease','east','easy','edge','else','even','ever','exit','face','fact','fade','fail','fair','fall','farm','fast','fate','fear','feed','feel','fell','felt','file','fill','film','find','fine','fire','firm','fish','five','flag','flat','flew','flow','food','foot','form','four','free','from','fuel','full','fund',
  'gain','game','gate','gave','gear','gene','gift','girl','give','glad','goal','goes','gold','gone','good','gray','grew','grid','grip','grow',
  'hair','half','hall','hand','hang','hard','harm','hate','have','head','hear','heat','held','help','here','hero','high','hill','hint','hire','hold','hole','holy','home','hope','horn','host','hour','huge','hunt','hurt',
  'idea','inch','into','iron','item','jack','jade','jazz','join','joke','jump','just','keep','kept','kick','kill','kind','king','knee','knew','know',
  'lack','lady','laid','lake','lamp','land','lane','last','late','lead','leaf','lean','left','less','life','lift','like','line','link','list','live','load','loan','lock','long','look','loop','lord','lose','loss','lost','loud','love','luck',
  'made','mail','main','make','male','mall','many','mark','mask','mass','mate','math','mean','meat','meet','melt','menu','mere','mile','milk','mill','mind','mine','miss','mode','mood','moon','more','most','move','much','must',
  'name','navy','near','neck','need','news','next','nice','nine','none','nose','note','noun','null','once','only','open','over','pace','pack','page','paid','pain','pair','pale','palm','park','part','pass','past','path','peak','pick','pile','pill','pine','pink','pipe','pity','plan','play','plot','plus','poem','poet','pole','poll','pond','pool','poor','port','pose','post','pour','pray','prey','pull','pump','pure','push',
  'quit','race','rack','rage','rail','rain','rank','rare','rate','read','real','rear','rent','rest','rice','rich','ride','ring','rise','risk','road','rock','role','roll','roof','room','root','rope','rose','rude','rule','rush',
  'safe','said','sail','salt','same','sand','save','scan','seal','seat','seed','seek','seem','seen','self','sell','send','sent','ship','shoe','shop','shot','show','shut','sick','side','sigh','sign','silk','sing','sink','site','size','skin','slid','slim','slip','slow','snow','soap','soft','soil','sold','sole','solo','some','song','soon','sore','sort','soul','soup','spin','spot','star','stay','stem','step','stir','stop','such','suit','sure','swim',
  'tail','take','tale','talk','tall','tame','tank','tape','task','team','tear','teen','tell','tend','tent','term','test','text','than','that','them','then','they','thin','this','tick','tide','tied','tile','till','time','tiny','tire','told','tone','took','tool','torn','tour','town','trap','tray','tree','trim','trip','true','tube','tune','turn','twin','type',
  'unit','upon','used','user','vary','vast','verb','very','vote','wade','wage','wait','wake','walk','wall','want','warm','warn','wash','wave','weak','wear','week','well','went','were','west','what','when','whom','wide','wife','wild','will','wind','wine','wing','wipe','wire','wise','wish','with','wolf','wood','wool','word','wore','work','worm','worn','wrap','yard','year','your','zero','zone','zoom',
  'above','actor','acute','admit','adopt','adult','after','agent','agree','ahead','alarm','album','alert','alien','alike','alive','allow','alone','along','alpha','alter','among','anger','angle','angry','apart','apple','apply','arena','argue','arise','arrow','aside','audio','avoid','awake','award','aware','basic','basis','batch','beach','began','begin','begun','being','below','bench','birth','black','blade','blame','blank','blast','blaze','blend','bless','blind','block','blood','bloom','blown','board','boast','boost','borne','bound','brain','brake','brand','brass','brave','bread','break','brick','brief','bring','broad','broke','brown','brush','build','built','burst','cabin','cable','canal','candy','canoe','carve','cause','chain','chair','chalk','chart','chase','cheap','cheek','cheer','chest','chief','child','chime','chord','chose','claim','class','clean','clear','clerk','click','cliff','climb','close','cloth','cloud','coach','coast','could','count','court','cover','crack','craft','crane','crash','crate','crazy','cream','creek','creep','crest','crime','crisp','crowd','crown','crude','cruel','cycle','daily','dairy','dance','debut','decay','delay','delta','dense','depth','devil','diary','dirty','dodge','doubt','dough','dozen','draft','drain','drama','drank','drawn','dread','dream','dress','drift','drill','drink','drive','drove','drown','eager','eagle','early','earth','eaten','eight','elbow','elder','elect','elite','email','empty','enact','enemy','enjoy','enter','entry','equal','error','essay','event','exact','exist','extra','fable','faint','faith','false','fancy','fatal','fault','favor','feast','fence','ferry','fetch','fever','fiber','field','fifth','fight','final','first','fixed','flame','flash','fleet','flesh','flick','fling','flint','float','flock','flood','floor','flour','fluid','flute','focus','force','forge','forty','forum','found','frame','fraud','fresh','front','frost','frown','fruit','funny','giant','given','globe','gloom','glory','glove','grace','grade','grain','grand','grant','grape','graph','grasp','grass','grave','great','greed','green','greet','grief','grill','grind','gross','group','grown','guard','guess','guest','guide','guilt','habit','happy','hardy','harsh','hasty','hatch','haunt','haven','heart','heavy','hedge','honey','honor','horse','hotel','hound','house','human','humor','hurry','ideal','idiot','imply','index','inner','input','issue','ivory','jelly','joint','joker','jolly','judge','juice','knife','knock','known','label','labor','large','laser','latch','later','laugh','layer','learn','lease','least','leave','ledge','legal','lemon','level','lever','light','limit','linen','liver','lobby','local','lodge','logic','loose','loser','lover','lower','lucky','lunar','lunch','lunge','magic','major','maker','manor','maple','march','marsh','match','mayor','meant','medal','media','merge','merit','merry','meter','metro','might','mince','miner','minor','mixed','moist','money','month','moral','motel','motor','mount','mouse','mouth','mover','movie','muddy','mural','music','naive','naked','nasty','nerve','never','newly','night','ninja','ninth','noble','noise','north','notch','novel','nurse','nylon','ocean','offer','often','olive','onion','onset','opera','orbit','order','organ','other','ought','ounce','outer','owner','paint','panda','panel','panic','paper','party','paste','patch','peace','peach','pearl','pedal','perch','phase','phone','photo','piece','pilot','pinch','pitch','pivot','pixel','pizza','place','plain','plane','plank','plant','plate','plead','point','poker','polar','porch','pouch','pound','power','press','price','pride','prime','print','prior','prism','prize','probe','prone','proof','proud','prove','proxy','prune','pulse','punch','pupil','puppy','purse','quack','quail','quake','quart','queen','queer','quest','queue','quick','quiet','quilt','quirk','quite','quote','radar','radio','raise','rally','range','rapid','ratio','raven','razor','reach','ready','realm','rebel','refer','relay','renew','repay','reply','reset','rhyme','rider','ridge','rifle','right','rigid','rinse','risen','risky','rival','river','roast','robot','rocky','rodeo','rogue','roost','rough','round','route','royal','ruler','rural','rusty','saint','salad','salon','salty','sandy','sauce','savor','scale','scalp','scare','scarf','scary','scene','scent','scope','score','scorn','scout','scowl','scrap','screw','scrub','seize','sense','serve','setup','seven','shade','shaft','shake','shaky','shall','shame','shape','shard','share','shark','sharp','shave','sheep','sheer','sheet','shelf','shell','shift','shine','shiny','shirt','shock','shone','shook','shoot','shore','short','shout','shown','shred','shrub','shrug','sight','silly','since','singe','siren','sixth','sixty','skate','skier','skill','skirt','skull','skunk','slack','slash','slate','slave','sleek','sleep','sleet','slept','slice','slick','slide','slime','slimy','sling','slope','sloth','slump','small','smart','smash','smear','smell','smile','smirk','smoke','smoky','snack','snail','snake','snare','sneak','sniff','snipe','snore','snort','snout','snowy','solar','solid','solve','sonic','sorry','sound','south','space','spade','spank','spare','spark','speak','spear','spell','spend','spent','spice','spicy','spike','spine','split','spoil','spoke','spool','spoon','sport','spout','spray','squad','squat','squid','stack','staff','stage','stain','stair','stake','stale','stalk','stall','stamp','stand','stare','stark','start','state','steak','steal','steam','steel','steep','steer','stern','stick','stiff','still','sting','stink','stock','stoke','stone','stony','stood','stool','store','storm','story','stout','stove','strap','straw','stray','strip','study','stuff','stump','style','sugar','suite','sunny','super','surge','swamp','sweat','sweep','sweet','swell','swept','swift','swing','swirl','sword','sworn','table','taken','taker','tardy','taste','tasty','teach','tempo','tempt','tenor','tense','tenth','thank','theft','their','theme','there','these','thick','thief','thigh','thine','thing','think','third','those','three','threw','throb','throw','thumb','thump','thyme','tiger','tight','timer','tired','title','toast','today','token','tonic','topic','torch','total','touch','tough','tower','toxic','trace','track','trade','trail','train','trait','tramp','trash','tread','treat','trend','tribe','trick','tried','troll','troop','trout','truce','truck','truly','trunk','trust','truth','tulip','tumor','twice','twine','twist','ultra','uncle','under','union','unite','unity','until','upper','upset','urban','usage','usher','using','usual','utter','vague','valid','value','valve','vapor','vault','venom','venue','verge','verse','video','villa','vinyl','viola','viper','viral','virus','visit','vista','vital','vivid','vocal','voice','voter','vowel','wafer','wager','wagon','waist','watch','water','weary','weave','wedge','weigh','weird','whale','wheat','wheel','where','which','while','whine','whirl','white','whole','whose','wider','widow','width','witch','witty','woman','women','world','worry','worse','worst','worth','would','wound','woven','wreck','wrist','write','wrong','wrote','yacht','yeast','yield','young','youth','zebra',
  'action','animal','anyone','around','artist','attack','battle','beauty','before','behind','better','bridge','bright','button','camera','candle','carbon','career','center','chance','change','charge','cheese','choice','choose','chosen','church','circle','client','clinic','coffee','common','corner','couple','course','credit','damage','danger','decide','decade','defend','degree','demand','design','desire','detail','detect','device','differ','direct','divide','doctor','double','driver','during','editor','effect','effort','either','empire','engine','enough','entire','equity','escape','estate','expect','expert','export','extend','facing','factor','family','famous','father','female','figure','filter','finger','finish','flower','follow','forest','forget','formal','former','fought','friend','frozen','future','galaxy','garden','gentle','global','golden','govern','ground','growth','handle','happen','harbor','hardly','health','height','hidden','higher','hostel','impact','income','indeed','indoor','infant','inform','injury','inside','insist','intake','intend','invent','invest','invite','island','itself','jacket','kidney','kitten','ladder','launch','lawyer','league','legacy','length','lesson','letter','likely','linger','liquid','listen','little','living','locked','longer','lovely','making','manage','manner','manual','marble','margin','market','master','matter','medium','member','memory','mental','merely','method','middle','minute','mirror','mobile','modern','modest','modify','moment','mother','motion','motive','murder','museum','mutual','narrow','nation','native','nature','nearby','normal','notice','number','object','oblige','obtain','office','online','option','orange','output','oxygen','parent','partly','passed','patent','patrol','people','pepper','person','pickup','planet','plenty','pocket','poetry','poison','police','polish','polite','potato','powder','prefer','pretty','prince','prison','profit','proper','proven','public','punish','purple','pursue','puzzle','quartz','rabbit','racing','random','rather','rating','really','reason','recall','recent','recipe','record','reduce','reform','refuge','refund','refuse','regard','region','regret','reject','relate','relief','remain','remark','remedy','remind','remote','remove','render','repair','repeat','replay','report','rescue','reside','resign','resist','result','resume','retail','retain','retire','return','reveal','review','reward','rhythm','ribbon','ritual','robust','rocket','rodent','rubber','saddle','safely','safety','salmon','sample','school','scream','screen','search','season','second','secret','sector','secure','select','seller','senior','sensor','series','server','settle','severe','sexual','shadow','shaped','shield','should','shower','signal','silent','silver','simple','simply','single','sister','slight','smooth','soccer','social','softer','softly','solely','sorrow','source','speaker','spread','spring','square','stable','status','steady','sticky','strand','stream','street','stress','strict','strike','string','strong','struck','studio','stupid','submit','subtle','sudden','suffer','summer','summit','sunset','supply','surely','survey','switch','symbol','system','tackle','talent','target','taught','temper','temple','tenant','tender','tennis','theory','thirty','though','thread','threat','thrill','throat','throne','thrown','thrust','ticket','timing','tissue','toggle','tomato','tongue','toward','travel','treaty','trendy','trophy','troupe','trusty','tumble','turkey','typist','unable','unfair','unfold','unique','united','unkind','unless','unlike','unload','unlock','update','upheld','uphold','uplift','upload','urgent','usable','useful','valley','valued','vendor','verbal','versus','victim','violet','violin','virtue','vision','visual','voyage','walnut','wander','warmth','wealth','weapon','weekly','weight','window','winter','wisdom','wisely','within','wonder','wooden','worker','writer','yellow','zombie',
]);

function loadStats(): { high: number; last: number } {
  if (typeof window === 'undefined') return { high: 0, last: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { high: 0, last: 0 };
    const p = JSON.parse(raw);
    return { high: Number(p.high) || 0, last: Number(p.last) || 0 };
  } catch {
    return { high: 0, last: 0 };
  }
}

function saveStats(s: { high: number; last: number }): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export default function VibeDrop() {
  const [tiles, setTiles] = useState<Tile[]>(() => generateBoard());
  const [path, setPath] = useState<Cell[]>([]);
  const [dragging, setDragging] = useState(false);
  const [dictionary, setDictionary] = useState<Set<string>>(CORE_WORDS);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [blast, setBlast] = useState(false);
  const [toast, setToast] = useState<{ text: string; blast: boolean } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const dictRef = useRef<Set<string>>(CORE_WORDS);

  const grid = useMemo(() => {
    const g: (Tile | null)[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    for (const t of tiles) {
      if (t.row >= 0 && t.row < ROWS && t.col >= 0 && t.col < COLS) g[t.row][t.col] = t;
    }
    return g;
  }, [tiles]);

  useEffect(() => {
    const s = loadStats();
    setHighScore(s.high);

    let cancelled = false;
    fetch('/data/enable.txt')
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error('dict unavailable'))))
      .then((text) => {
        if (cancelled) return;
        const words = new Set<string>();
        for (const line of text.split('\n')) {
          const w = line.trim().toLowerCase();
          if (w) words.add(w);
        }
        CORE_WORDS.forEach((w) => words.add(w));
        dictRef.current = words;
        setDictionary(words);
      })
      .catch(() => {
        dictRef.current = CORE_WORDS;
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (score === 0) return;
    const h = Math.max(highScore, score);
    if (h !== highScore) setHighScore(h);
    saveStats({ high: h, last: score });
  }, [score]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentWord = useMemo(
    () => path.map((p) => grid[p.row]?.[p.col]?.letter ?? '').join(''),
    [path, grid],
  );

  const isValid = useMemo(() => {
    if (currentWord.length < MIN_WORD) return false;
    return dictionary.has(currentWord.toLowerCase());
  }, [currentWord, dictionary]);

  const getCellFromPointer = useCallback(
    (clientX: number, clientY: number): Cell | null => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return null;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
      const col = Math.floor(x / CELL);
      const row = Math.floor(y / CELL);
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
      const localX = x - col * CELL;
      const localY = y - row * CELL;
      if (localX > TILE || localY > TILE) return null;
      if (!grid[row][col]) return null;
      return { row, col };
    },
    [grid],
  );

  const applyClear = useCallback((cells: Cell[], word: string) => {
    const len = cells.length;
    const isBlast = len >= BLAST_LEN;
    const toClear = new Set<string>(cells.map((c) => `${c.row},${c.col}`));
    if (isBlast) {
      for (const c of cells) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const r = c.row + dr;
            const cc = c.col + dc;
            if (r >= 0 && r < ROWS && cc >= 0 && cc < COLS) toClear.add(`${r},${cc}`);
          }
        }
      }
    }

    setTiles((prev) => {
      const survivors = prev.filter((t) => !toClear.has(`${t.row},${t.col}`));
      const next: Tile[] = [];
      for (let c = 0; c < COLS; c++) {
        const colTiles = survivors.filter((t) => t.col === c).sort((a, b) => a.row - b.row);
        const bottomStart = ROWS - colTiles.length;
        colTiles.forEach((t, i) => next.push({ ...t, row: bottomStart + i, col: c }));
        for (let r = 0; r < bottomStart; r++) next.push(makeTile(randomLetter(), r, c));
      }
      return next;
    });

    const points = len * len * 10;
    setScore((s) => s + points);

    if (isBlast) {
      setBlast(true);
      window.setTimeout(() => setBlast(false), 700);
      setToast({ text: `VIBE BLAST! ${word.toUpperCase()} +${points}`, blast: true });
    } else {
      setToast({ text: `${word.toUpperCase()} +${points}`, blast: false });
    }
    window.setTimeout(() => setToast(null), 1400);
  }, []);

  const startPath = useCallback((cell: Cell) => {
    setDragging(true);
    setPath([cell]);
  }, []);

  const extendPath = useCallback((cell: Cell) => {
    setPath((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (same(last, cell)) return prev;
      if (prev.length >= 2 && same(prev[prev.length - 2], cell)) return prev.slice(0, -1);
      if (prev.some((p) => same(p, cell))) return prev;
      if (!adjacent(last, cell)) return prev;
      return [...prev, cell];
    });
  }, []);

  const endPath = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    setPath((prev) => {
      if (prev.length >= MIN_WORD) {
        const word = prev.map((p) => grid[p.row]?.[p.col]?.letter ?? '').join('');
        if (dictRef.current.has(word.toLowerCase())) {
          applyClear(prev, word);
        }
      }
      return [];
    });
  }, [dragging, grid, applyClear]);

  const resetBoard = useCallback(() => {
    setTiles(generateBoard());
    setPath([]);
    setDragging(false);
    setScore(0);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const cell = getCellFromPointer(e.clientX, e.clientY);
    if (cell) {
      e.preventDefault();
      try {
        boardRef.current?.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      startPath(cell);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const cell = getCellFromPointer(e.clientX, e.clientY);
    if (cell) extendPath(cell);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      boardRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    endPath();
  };

  const pathPoints = path.map((p) => ({
    x: p.col * CELL + TILE / 2,
    y: p.row * CELL + TILE / 2,
  }));
  const pathStr = pathPoints.map((pt) => `${pt.x},${pt.y}`).join(' ');

  const selectedSet = useMemo(
    () => new Set(path.map((p) => `${p.row},${p.col}`)),
    [path],
  );

  const boardW = COLS * CELL - GAP;
  const boardH = ROWS * CELL - GAP;

  return (
    <div
      className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-fuchsia-500/20 p-4 text-slate-100 shadow-[0_0_60px_rgba(236,72,153,0.15)] sm:p-6"
      style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #0f0c29 100%)' }}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-fuchsia-300/80">
            VibeDrop
          </p>
          <h2
            className="font-mono text-4xl font-black leading-none text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #f472b6, #60a5fa)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 12px rgba(236,72,153,0.45))',
            }}
          >
            {score.toString().padStart(4, '0')}
          </h2>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Best: <span className="font-mono text-cyan-300">{highScore}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={resetBoard}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 transition hover:border-fuchsia-400/60 hover:text-fuchsia-200"
          aria-label="New board"
          title="New board"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </header>

      <div className="mb-3 flex min-h-[32px] items-center justify-center">
        <div
          className={`rounded-full border px-4 py-1 font-mono text-sm tracking-[0.3em] transition ${
            isValid
              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.45)]'
              : currentWord
                ? 'border-fuchsia-500/40 bg-fuchsia-500/5 text-fuchsia-200'
                : 'border-slate-700 bg-slate-900/40 text-slate-500'
          }`}
        >
          {currentWord || '—'}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div
          ref={boardRef}
          className="relative"
          style={{ width: boardW, height: boardH, touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <AnimatePresence>
            {tiles.map((tile) => {
              const isSelected = selectedSet.has(`${tile.row},${tile.col}`);
              return (
                <motion.div
                  key={tile.id}
                  initial={{ x: tile.col * CELL, y: -CELL * 2, opacity: 0, scale: 0.7 }}
                  animate={{ x: tile.col * CELL, y: tile.row * CELL, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.3, rotate: 180, transition: { duration: 0.3 } }}
                  transition={{ type: 'spring', stiffness: 360, damping: 18, mass: 1 }}
                  style={{
                    width: TILE,
                    height: TILE,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 10,
                  }}
                  className={`flex select-none items-center justify-center rounded-lg border font-mono text-lg font-bold backdrop-blur-sm ${
                    isSelected
                      ? isValid
                        ? 'border-cyan-300 bg-cyan-400/30 text-white shadow-[0_0_20px_rgba(34,211,238,0.7)]'
                        : 'border-fuchsia-300 bg-fuchsia-500/25 text-white shadow-[0_0_18px_rgba(236,72,153,0.7)]'
                      : 'border-fuchsia-500/30 bg-indigo-900/40 text-fuchsia-100'
                  }`}
                >
                  {tile.letter}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {path.length > 0 && (
            <svg
              className="pointer-events-none absolute inset-0"
              width={boardW}
              height={boardH}
              style={{ overflow: 'visible', zIndex: 20 }}
            >
              {path.length >= 2 && (
                <>
                  <polyline
                    points={pathStr}
                    fill="none"
                    stroke={isValid ? 'rgba(34,211,238,0.4)' : 'rgba(236,72,153,0.35)'}
                    strokeWidth={14}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={pathStr}
                    fill="none"
                    stroke={isValid ? '#67e8f9' : '#f9a8d4'}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}
              {pathPoints.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={6}
                  fill={isValid ? '#22d3ee' : '#ec4899'}
                  stroke={isValid ? '#ecfeff' : '#fdf2f8'}
                  strokeWidth={2}
                />
              ))}
            </svg>
          )}

          <AnimatePresence>
            {blast && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="pointer-events-none absolute inset-0"
                style={{
                  zIndex: 25,
                  background:
                    'radial-gradient(circle at center, rgba(34,211,238,0.35) 0%, rgba(236,72,153,0.25) 40%, transparent 72%)',
                  mixBlendMode: 'screen',
                  borderRadius: 12,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 top-24 flex justify-center"
            style={{ zIndex: 40 }}
          >
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold tracking-wider ${
                toast.blast
                  ? 'border-cyan-300 bg-cyan-400/20 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.55)]'
                  : 'border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-100 shadow-[0_0_20px_rgba(236,72,153,0.45)]'
              }`}
            >
              {toast.blast && <Zap className="h-4 w-4" />}
              {toast.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[11px]">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1 text-slate-400">
          Drag 3+ adjacent letters to spell a word
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-2 py-1 text-cyan-300">
          5+ letters triggers a Vibe Blast
        </div>
      </div>
    </div>
  );
}
