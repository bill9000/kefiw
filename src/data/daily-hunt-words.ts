// Curated 5-letter words for Five-Letter Hunt, indexed by day-of-year (1..366).
//
// Rules applied during curation:
//   - Exactly 5 letters, real English (no proper nouns, no abbreviations)
//   - No apostrophes, no hyphens
//   - Mix of easy and hard across the year
//   - No repeats within the year
//
// To adjust a specific day, edit that index in place. The yearly cycle repeats
// each calendar year (Apr 21 2026 = Apr 21 2027 for any given day-of-year).

export const HUNT_WORDS_LENGTH = 366;

const CURATED: string[] = [
  'CRANE', 'SLATE', 'AUDIO', 'RAISE', 'LEAST', 'SNACK', 'BRAKE', 'VOCAL', 'SPITE', 'CHART',
  'OCEAN', 'GRAVE', 'MOUSE', 'HOUSE', 'PHONE', 'WATER', 'LIGHT', 'POWER', 'PLACE', 'NIGHT',
  'STATE', 'WORLD', 'MONEY', 'PEACE', 'YOUTH', 'SHORE', 'PLANT', 'DRIVE', 'TRIBE', 'BLAZE',
  'SMILE', 'BRAVE', 'CLOUD', 'DREAM', 'EAGLE', 'FENCE', 'GRACE', 'HONEY', 'IRONY', 'JOKER',
  'KNEEL', 'LEMON', 'MARCH', 'NOBLE', 'ORGAN', 'PEARL', 'QUILT', 'RADIO', 'SAINT', 'TRAIL',
  'UNITY', 'VAPOR', 'WAGON', 'YACHT', 'ZEBRA', 'ABBEY', 'BASIC', 'CREEK', 'DINER', 'ENJOY',
  'FROST', 'GLOVE', 'HORSE', 'INBOX', 'JOINT', 'KNOCK', 'LAYER', 'MEDIA', 'NERVE', 'OASIS',
  'PRIME', 'QUEEN', 'ROBOT', 'SWIFT', 'TIGER', 'URBAN', 'VINYL', 'WRECK', 'YEARN', 'ZESTY',
  'AMBER', 'BLUSH', 'CIVIC', 'DRAFT', 'ETHIC', 'FABLE', 'GIANT', 'HATCH', 'IVORY', 'KARMA',
  'LEGAL', 'MERIT', 'NAVAL', 'OLIVE', 'PIVOT', 'QUACK', 'RAPID', 'SIEGE', 'THEME', 'UNDER',
  'WOMAN', 'ALLOY', 'BATHE', 'CLAIM', 'DECAY', 'EMBER', 'FOCUS', 'GUILT', 'HARSH', 'INLET',
  'JEWEL', 'KNOWN', 'LARGE', 'MAPLE', 'NICHE', 'OCCUR', 'PIANO', 'QUIET', 'ROUGE', 'SCOUT',
  'TREND', 'UPPER', 'VIDEO', 'ADOPT', 'BIRTH', 'COAST', 'DRESS', 'ELITE', 'FAITH', 'GENIE',
  'HASTE', 'INDIE', 'KNACK', 'LABOR', 'MOVIE', 'NURSE', 'OVERT', 'POLAR', 'QUEST', 'RELIC',
  'SCALE', 'TORCH', 'UNCLE', 'VOICE', 'WATCH', 'WHARF', 'YODEL', 'ADULT', 'BERRY', 'COMIC',
  'DONUT', 'ENTRY', 'FROTH', 'GLADE', 'HAVEN', 'INCUR', 'JOLLY', 'LASER', 'MINCE', 'OPERA',
  'PULSE', 'RANCH', 'TANGO', 'UPSET', 'VIRUS', 'XEROX', 'YIELD', 'ALPHA', 'BAKER', 'CANDY',
  'DEBIT', 'ENACT', 'FAULT', 'GORGE', 'HABIT', 'IMBUE', 'JAUNT', 'KIOSK', 'LODGE', 'MERCY',
  'NOTCH', 'PAPER', 'QUICK', 'REBEL', 'SENSE', 'TRUST', 'USAGE', 'WOUND', 'YEARS', 'AMAZE',
  'BLIMP', 'CRAZE', 'DELTA', 'EMPTY', 'FLOUR', 'HINGE', 'ICING', 'JUROR', 'LOYAL', 'MOUTH',
  'NAVEL', 'ODDLY', 'PLUSH', 'QUERY', 'RUMOR', 'SWIPE', 'TRIPE', 'USHER', 'VAULT', 'WHIRL',
  'ADOBE', 'BOUGH', 'CHESS', 'DOUBT', 'EXIST', 'FLAKY', 'GROUT', 'HOOPS', 'INDEX', 'JUMPY',
  'LATCH', 'MURAL', 'OCHER', 'PLUCK', 'QUAFF', 'ROWDY', 'SKIMP', 'TROPE', 'UDDER', 'WRYLY',
  'ABOUT', 'BELLY', 'COCOA', 'DRUNK', 'ERASE', 'FIELD', 'GAUNT', 'IDOLS', 'JOUST', 'KNOLL',
  'LYMPH', 'MANGO', 'NIECE', 'OZONE', 'PROUD', 'QUASI', 'RISEN', 'SAVOR', 'TWIRL', 'UNFIT',
  'VIPER', 'WEAVE', 'ZONED', 'ANKLE', 'BASIN', 'CEDAR', 'DWELT', 'ELBOW', 'FIEND', 'GAVEL',
  'HALVE', 'INANE', 'JAZZY', 'KINDS', 'LAGER', 'MAGIC', 'NOMAD', 'OAKEN', 'PIOUS', 'QUIRK',
  'RENTS', 'STAGE', 'TWINE', 'UPEND', 'VALVE', 'WASTE', 'AXIOM', 'BRIBE', 'CHOIR', 'DOILY',
  'ENDOW', 'FLIRT', 'FOYER', 'GAMMA', 'HAZEL', 'IRATE', 'KAZOO', 'LANKY', 'MERRY', 'OVINE',
  'PIETY', 'QUOTE', 'REMIT', 'SOBER', 'TACKY', 'ULCER', 'WINKS', 'AMPLE', 'BALMY', 'CARGO',
  'DUSKY', 'EVICT', 'FLUKE', 'GRITS', 'HOVEL', 'IDIOM', 'JEMMY', 'KNOTS', 'LUNAR', 'MERGE',
  'NUDGE', 'OUNCE', 'PLAID', 'QUELL', 'RIVAL', 'STEEP', 'THINK', 'UMBRA', 'VIXEN', 'WORTH',
  'YUCKY', 'ARSON', 'BLUNT', 'CHARM', 'DOZEN', 'EXTRA', 'FROWN', 'GRIME', 'HEWED', 'IAMBS',
  'JETTY', 'KNELT', 'LUCID', 'MAYOR', 'NOISE', 'OBESE', 'PLAIT', 'QUAKE', 'ROBED', 'SILLY',
  'TOTAL', 'URGED', 'VEERS', 'WOOZY', 'AMISS', 'BRAID', 'CLASP', 'DILLY', 'ELOPE', 'FLORA',
  'GRIEF', 'HURLS', 'INPUT', 'JINNS', 'KELPS', 'LUNCH', 'MOTTO', 'NOOSE', 'OBOES', 'PLATE',
  'QUOTA', 'REINS', 'SWATH', 'TWIXT', 'UNZIP', 'VINES',
];

if (CURATED.length !== HUNT_WORDS_LENGTH) {
  throw new Error(
    `[daily-hunt-words] expected ${HUNT_WORDS_LENGTH} entries, got ${CURATED.length}`
  );
}

export const CURATED_HUNT_WORDS: ReadonlyArray<string> = CURATED;

export function getHuntWord(dayOfYear: number): string {
  const idx = ((dayOfYear - 1) % HUNT_WORDS_LENGTH + HUNT_WORDS_LENGTH) % HUNT_WORDS_LENGTH;
  return CURATED[idx];
}
