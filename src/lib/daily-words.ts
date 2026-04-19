export const DAILY_5 = [
  'hoist','tangy','piano','brave','cloud','flame','grape','honey','ivory','jolly',
  'kiosk','lemon','mango','night','ocean','peach','queen','raven','salad','tiger',
  'urban','vapor','wafer','xenon','yacht','zebra','apple','blend','crisp','dream',
  'eager','fable','glide','haven','index','juicy','karma','lucky','magic','noble',
  'opera','pride','quest','robin','swamp','tonic','union','valid','witty','yield',
  'adobe','basil','chart','delta','ember','flint','gecko','happy','inbox','jumbo',
  'koala','liver','mercy','nerdy','orbit','proxy','quick','rusty','sober','tulip',
  'udder','vigor','wheat','yoke','above','beach','claim','depth','equal','fault',
  'grace','heart','ideal','joint','kneel','lobby','mount','nurse','olive','place',
  'quilt','raise','sheep','table','uncle','vivid','whisk','youth','aroma','bloom',
] as const;

export const DAILY_6 = [
  'wander','shadow','marble','galaxy','dragon','forest','harbor','jasper','kettle','lounge',
  'meadow','nectar','oyster','piazza','quartz','rascal','silver','temple','unique','velvet',
  'whimsy','zephyr','acumen','beacon','castle','dreamy','eclair','fable','garnet','hazard',
  'insect','jungle','kidney','lantern','mellow','native','orange','pastel','quiver','rascal',
  'saddle','tender','unfair','vortex','window','yellow','absorb','beauty','cactus','dinner',
  'effort','falcon','gentle','honest','iguana','jolly','knight','lovely','mirror','nugget',
  'office','puzzle','quarry','rabbit','salmon','tunnel','useful','voyage','wallet','accent',
  'banana','cheese','donkey','ember','friend','guitar','helmet','island','jewel','kernel',
  'leader','mentor','nobody','offend','player','quaint','random','sphere','tennis','unlock',
  'volley','walnut','accept','branch','circle','device','engine','fabric','gossip','hunter',
] as const;

export const DAILY_7 = [
  'journey','mystery','harmony','penguin','tornado','diamond','blossom','captain','delight','eclipse',
  'freedom','gateway','harvest','iceberg','jungle','kingdom','laptop','mailbox','network','octopus',
  'pyramid','quarrel','rainbow','sparkle','trumpet','uniform','village','whisper','yonder','zombie',
  'amazing','bedtime','compact','destiny','elegant','funnier','gorilla','horizon','improve','justice',
  'kindred','library','marathon','nearby','outgoing','predict','quicken','respect','sunrise','trouble',
  'upgrade','velocity','warning','yoghurt','artwork','biology','concert','dentist','emerald','factory',
  'giraffe','hopeful','involve','joyful','kimono','leaflet','machine','nervous','orchard','perfect',
  'quickly','rhythm','silence','texture','upstairs','violent','wealthy','yearly','analyst','breathe',
] as const;

export function daySeedUTC(date = new Date()): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  return y * 10000 + m * 100 + d;
}

export function pickDaily<T>(pool: readonly T[], seed: number): T {
  let h = 2166136261 ^ seed;
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h ^= h >>> 16;
  const idx = Math.abs(h) % pool.length;
  return pool[idx];
}

export function scrambleWord(word: string, seed: number): string {
  const arr = word.toUpperCase().split('');
  let h = seed;
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr.join('') === word.toUpperCase()) {
    [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
  }
  return arr.join('');
}
