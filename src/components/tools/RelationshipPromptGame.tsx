import { useMemo, useState } from 'react';

type GameId =
  | 'date-night-questions'
  | 'flirty-truth-or-dare'
  | 'couples-never-have-i-ever'
  | 'couples-would-you-rather'
  | 'red-flag-green-flag'
  | 'couple-dare-ladder'
  | 'pillow-talk-cards';

type DateStage = 'first' | 'second' | 'third' | 'established';
type Intensity = 'easy' | 'curious' | 'flirty' | 'spicy' | 'after-dark';
type TurnFormat = 'one-phone' | 'two-phone';
type Perspective = 'partner' | 'boy-girl' | 'girl-boy';
type Context = 'date' | 'couple' | 'party';
type FlagContext = 'first-date' | 'dating' | 'relationship' | 'party' | 'silly';
type LadderLevel = 'sweet' | 'flirty' | 'close' | 'spicy' | 'after-dark';
type PillowMood = 'cozy' | 'romantic' | 'repair' | 'future' | 'surprise';

interface PromptCard {
  id: string;
  text: string;
  followUp?: string;
  dateStages?: DateStage[];
  intensities?: Intensity[];
  contexts?: Context[];
  flagContexts?: FlagContext[];
  ladderLevel?: LadderLevel;
  pillowMoods?: PillowMood[];
  kind?: 'truth' | 'dare' | 'statement' | 'choice' | 'scenario' | 'prompt';
  optionA?: string;
  optionB?: string;
}

interface Props {
  game: GameId;
}

const DATE_STAGE_LABEL: Record<DateStage, string> = {
  first: 'First date',
  second: 'Second date',
  third: 'Third date',
  established: 'More / established',
};

const INTENSITY_LABEL: Record<Intensity, string> = {
  easy: 'Easy',
  curious: 'Curious',
  flirty: 'Flirty',
  spicy: 'Spicy',
  'after-dark': 'After Dark 18+',
};

const CONTEXT_LABEL: Record<Context, string> = {
  date: 'Date',
  couple: 'Couple',
  party: 'Party',
};

const FLAG_CONTEXT_LABEL: Record<FlagContext, string> = {
  'first-date': 'First date',
  dating: 'Dating',
  relationship: 'Relationship',
  party: 'Party',
  silly: 'Silly',
};

const LADDER_LABEL: Record<LadderLevel, string> = {
  sweet: 'Sweet',
  flirty: 'Flirty',
  close: 'Close',
  spicy: 'Spicy',
  'after-dark': 'After Dark 18+',
};

const PILLOW_LABEL: Record<PillowMood, string> = {
  cozy: 'Cozy',
  romantic: 'Romantic',
  repair: 'Repair',
  future: 'Future',
  surprise: 'Surprise',
};

const ladderOrder: LadderLevel[] = ['sweet', 'flirty', 'close', 'spicy', 'after-dark'];

const datePrompts: PromptCard[] = [
  { id: 'd1', text: 'What is one small thing that instantly makes a night better for you?', followUp: 'What would that look like on a date?', dateStages: ['first', 'second'], intensities: ['easy'] },
  { id: 'd2', text: 'What is a hobby you like more than people expect?', followUp: 'What got you into it?', dateStages: ['first', 'second', 'third'], intensities: ['easy'] },
  { id: 'd3', text: 'What is your low-stakes green flag on a date?', followUp: 'Have you noticed it tonight?', dateStages: ['first', 'second'], intensities: ['curious', 'flirty'] },
  { id: 'd4', text: 'What kind of compliment do you actually believe?', followUp: 'Give one if it feels natural.', dateStages: ['first', 'second', 'third', 'established'], intensities: ['flirty'] },
  { id: 'd5', text: 'What is something you are surprisingly picky about?', followUp: 'Is it charming picky or impossible picky?', dateStages: ['first', 'second'], intensities: ['curious'] },
  { id: 'd6', text: 'What is a date idea you would almost always say yes to?', followUp: 'Would it be better spontaneous or planned?', dateStages: ['second', 'third', 'established'], intensities: ['curious'] },
  { id: 'd7', text: 'What is one thing you noticed about me before we started talking properly?', followUp: 'Was your first read accurate?', dateStages: ['second', 'third', 'established'], intensities: ['flirty'] },
  { id: 'd8', text: 'What is a tiny romantic gesture that works on you?', followUp: 'What gesture feels overdone?', dateStages: ['third', 'established'], intensities: ['flirty', 'spicy'] },
  { id: 'd9', text: 'What is a boundary that makes dating feel more relaxed for you?', followUp: 'What makes that boundary easy to respect?', dateStages: ['first', 'second', 'third'], intensities: ['curious'] },
  { id: 'd10', text: 'What is your favorite kind of tension: playful debate, slow flirting, mystery, or directness?', followUp: 'Which one do you think we have?', dateStages: ['third', 'established'], intensities: ['spicy'] },
  { id: 'd11', text: 'What is something you would rather discover slowly than ask directly?', followUp: 'Why is slow better there?', dateStages: ['second', 'third', 'established'], intensities: ['curious', 'flirty'] },
  { id: 'd12', text: 'What would make the next ten minutes more fun without making anything awkward?', followUp: 'Pick one small change.', dateStages: ['first', 'second', 'third', 'established'], intensities: ['easy', 'curious'] },
];

const truthDarePrompts: PromptCard[] = [
  { id: 'td1', kind: 'truth', text: 'Truth: What is the most attractive non-physical quality someone can have?', followUp: 'Name one moment when you saw it.', contexts: ['date', 'couple', 'party'], intensities: ['easy', 'curious'] },
  { id: 'td2', kind: 'dare', text: 'Dare: Give the other person a compliment specific enough that it could not be copied to anyone else.', contexts: ['date', 'couple', 'party'], intensities: ['easy', 'flirty'] },
  { id: 'td3', kind: 'truth', text: 'Truth: What is one harmless thing that makes you lose interest quickly?', followUp: 'Is it a dealbreaker or just a preference?', contexts: ['date', 'party'], intensities: ['curious'] },
  { id: 'td4', kind: 'dare', text: 'Dare: Trade phones only to pick a song for the other person to hear for thirty seconds.', contexts: ['date', 'couple'], intensities: ['easy', 'curious'] },
  { id: 'td5', kind: 'truth', text: 'Truth: What is a flirty move that works only when the timing is right?', contexts: ['date', 'couple'], intensities: ['flirty', 'spicy'] },
  { id: 'td6', kind: 'dare', text: 'Dare: Hold eye contact for five seconds, then both say whether it was funny, awkward, or dangerous.', contexts: ['date', 'couple'], intensities: ['flirty'] },
  { id: 'td7', kind: 'truth', text: 'Truth: What kind of party energy do you like most: observer, instigator, storyteller, or escape artist?', contexts: ['party'], intensities: ['easy', 'curious'] },
  { id: 'td8', kind: 'dare', text: 'Dare: Let the group vote on your most obvious green flag from tonight.', contexts: ['party'], intensities: ['easy', 'flirty'] },
  { id: 'td9', kind: 'truth', text: 'Truth: What is one private-context rule that makes spicy games feel safe instead of pressured?', contexts: ['couple'], intensities: ['spicy', 'after-dark'] },
  { id: 'td10', kind: 'dare', text: 'Dare: Privately agree on one boundary and one green light before choosing another After Dark card.', contexts: ['couple'], intensities: ['after-dark'] },
];

const neverPrompts: PromptCard[] = [
  { id: 'nh1', kind: 'statement', text: 'Never have I ever pretended to understand a date story just to keep the conversation moving.', contexts: ['date', 'party'], intensities: ['easy'] },
  { id: 'nh2', kind: 'statement', text: 'Never have I ever planned an outfit around who I hoped would notice.', contexts: ['date', 'couple', 'party'], intensities: ['easy', 'flirty'] },
  { id: 'nh3', kind: 'statement', text: 'Never have I ever had a crush become obvious to everyone except me.', contexts: ['date', 'party'], intensities: ['curious', 'flirty'] },
  { id: 'nh4', kind: 'statement', text: 'Never have I ever replayed a text before deciding whether it sounded too interested.', contexts: ['date', 'couple'], intensities: ['curious'] },
  { id: 'nh5', kind: 'statement', text: 'Never have I ever changed my mind about someone after one unusually good conversation.', contexts: ['date', 'couple', 'party'], intensities: ['curious'] },
  { id: 'nh6', kind: 'statement', text: 'Never have I ever wanted a date to make a bolder move but not known how to say it.', contexts: ['date', 'couple'], intensities: ['flirty', 'spicy'] },
  { id: 'nh7', kind: 'statement', text: 'Never have I ever learned something useful about my partner from a silly game.', contexts: ['couple'], intensities: ['easy', 'curious'] },
  { id: 'nh8', kind: 'statement', text: 'Never have I ever used humor to dodge a question I actually wanted to answer.', contexts: ['date', 'couple', 'party'], intensities: ['curious'] },
];

const wouldPrompts: PromptCard[] = [
  { id: 'wr1', kind: 'choice', optionA: 'A perfect planned date', optionB: 'A chaotic spontaneous date', text: 'Would you rather:', followUp: 'What does your answer reveal about how you like to be cared for?', dateStages: ['first', 'second', 'third', 'established'], intensities: ['easy'] },
  { id: 'wr2', kind: 'choice', optionA: 'A partner who is direct', optionB: 'A partner who is subtle', text: 'Would you rather:', followUp: 'Where does subtle become confusing?', dateStages: ['first', 'second', 'third'], intensities: ['curious'] },
  { id: 'wr3', kind: 'choice', optionA: 'Slow-burn chemistry', optionB: 'Instant spark', text: 'Would you rather:', followUp: 'Which one has fooled you before?', dateStages: ['second', 'third', 'established'], intensities: ['flirty'] },
  { id: 'wr4', kind: 'choice', optionA: 'Cook together badly', optionB: 'Order perfectly and talk all night', text: 'Would you rather:', followUp: 'What would you order or ruin?', dateStages: ['first', 'second', 'third', 'established'], intensities: ['easy'] },
  { id: 'wr5', kind: 'choice', optionA: 'Be teased playfully', optionB: 'Be complimented sincerely', text: 'Would you rather:', followUp: 'What kind of teasing crosses the line?', dateStages: ['third', 'established'], intensities: ['flirty', 'spicy'] },
  { id: 'wr6', kind: 'choice', optionA: 'Know their whole dating history', optionB: 'Only know what matters now', text: 'Would you rather:', followUp: 'What is healthy curiosity versus oversharing?', dateStages: ['third', 'established'], intensities: ['curious'] },
  { id: 'wr7', kind: 'choice', optionA: 'A quiet couch night', optionB: 'A loud party entrance', text: 'Would you rather:', followUp: 'Which one fits this week?', dateStages: ['second', 'third', 'established'], intensities: ['easy', 'curious'] },
];

const flagPrompts: PromptCard[] = [
  { id: 'rf1', kind: 'scenario', text: 'They ask a thoughtful follow-up instead of jumping to their own story.', followUp: 'Green, red, beige, or depends?', flagContexts: ['first-date', 'dating', 'relationship'], intensities: ['easy'] },
  { id: 'rf2', kind: 'scenario', text: 'They are funny to the waiter but rude when something goes wrong.', followUp: 'Does charm cancel the rude part?', flagContexts: ['first-date', 'dating'], intensities: ['curious'] },
  { id: 'rf3', kind: 'scenario', text: 'They say they hate games but get very competitive after one round.', followUp: 'Beige flag or secret green flag?', flagContexts: ['party', 'silly'], intensities: ['easy'] },
  { id: 'rf4', kind: 'scenario', text: 'They talk about an ex with accountability instead of blame.', followUp: 'What detail changes your answer?', flagContexts: ['dating', 'relationship'], intensities: ['curious'] },
  { id: 'rf5', kind: 'scenario', text: 'They want to skip a prompt and say so clearly.', followUp: 'Why can that be a green flag?', flagContexts: ['first-date', 'dating', 'party', 'relationship'], intensities: ['easy', 'curious'] },
  { id: 'rf6', kind: 'scenario', text: 'They plan the next date before this one ends.', followUp: 'Sweet, too much, or depends on chemistry?', flagContexts: ['first-date', 'dating'], intensities: ['flirty'] },
  { id: 'rf7', kind: 'scenario', text: 'They make every answer into a bit.', followUp: 'Funny shield or avoidance?', flagContexts: ['party', 'dating', 'silly'], intensities: ['easy', 'curious'] },
];

const ladderPrompts: PromptCard[] = [
  { id: 'cl1', ladderLevel: 'sweet', text: 'Say one thing the other person did recently that made life easier.', followUp: 'Keep it specific.' },
  { id: 'cl2', ladderLevel: 'sweet', text: 'Choose the next shared snack, song, or couch position.', followUp: 'Small choices count.' },
  { id: 'cl3', ladderLevel: 'flirty', text: 'Tell the other person one look, habit, or phrase of theirs that still gets you.', followUp: 'No generic compliments.' },
  { id: 'cl4', ladderLevel: 'flirty', text: 'Trade a harmless confession about something you find attractive but rarely say out loud.', followUp: 'Either person may pass.' },
  { id: 'cl5', ladderLevel: 'close', text: 'Ask for one kind of closeness that would feel good tonight: talk, touch, quiet, play, or space.', followUp: 'The answer sets the pace.' },
  { id: 'cl6', ladderLevel: 'close', text: 'Pick a green light and a boundary before moving any higher on the ladder.', followUp: 'If either answer is unclear, stay here.' },
  { id: 'cl7', ladderLevel: 'spicy', text: 'Name one romantic scene that feels appealing in mood, not instructions.', followUp: 'Keep it suggestive, not performative.' },
  { id: 'cl8', ladderLevel: 'spicy', text: 'Choose whether the next round should be verbal, closer, or lower intensity.', followUp: 'Any answer is valid.' },
  { id: 'cl9', ladderLevel: 'after-dark', text: 'Clothing-optional branch: both people must say yes, or the game levels down automatically.', followUp: 'No yes, no escalation.' },
  { id: 'cl10', ladderLevel: 'after-dark', text: 'Decide together whether to stop the game here, stay verbal, or return to a lower level.', followUp: 'Ending well is part of the game.' },
];

const pillowPrompts: PromptCard[] = [
  { id: 'pt1', text: 'What is one ordinary memory with me that you like more than I realize?', followUp: 'What detail do you remember?', pillowMoods: ['cozy', 'romantic'] },
  { id: 'pt2', text: 'What is one thing we used to do that would be worth bringing back?', followUp: 'Make it small enough to do this week.', pillowMoods: ['cozy', 'future'] },
  { id: 'pt3', text: 'What is a repair attempt from me that actually works on you?', followUp: 'How can I make it easier to receive?', pillowMoods: ['repair'] },
  { id: 'pt4', text: 'What do you want our next quiet night to feel like?', followUp: 'Pick one sensory detail.', pillowMoods: ['cozy', 'future', 'surprise'] },
  { id: 'pt5', text: 'What is one future version of us that makes you smile?', followUp: 'What is one step toward it?', pillowMoods: ['future', 'romantic'] },
  { id: 'pt6', text: 'What is one compliment you could hear again and again without getting tired of it?', followUp: 'Say it if you mean it.', pillowMoods: ['romantic', 'surprise'] },
  { id: 'pt7', text: 'What is one topic we should revisit when we are both rested?', followUp: 'Name it without solving it tonight.', pillowMoods: ['repair'] },
];

function clampText(value: string): string {
  return value.slice(0, 40);
}

function labelPair(perspective: Perspective, a: string, b: string): [string, string] {
  if (perspective === 'boy-girl') return ['Boy', 'Girl'];
  if (perspective === 'girl-boy') return ['Girl', 'Boy'];
  return [a.trim() || 'Partner A', b.trim() || 'Partner B'];
}

function allowedDateIntensities(stage: DateStage): Intensity[] {
  if (stage === 'first') return ['easy', 'curious'];
  if (stage === 'second') return ['easy', 'curious', 'flirty'];
  return ['easy', 'curious', 'flirty', 'spicy'];
}

function includesOrEmpty<T>(values: T[] | undefined, selected: T): boolean {
  return !values || values.includes(selected);
}

function cardDeck(game: GameId): PromptCard[] {
  if (game === 'date-night-questions') return datePrompts;
  if (game === 'flirty-truth-or-dare') return truthDarePrompts;
  if (game === 'couples-never-have-i-ever') return neverPrompts;
  if (game === 'couples-would-you-rather') return wouldPrompts;
  if (game === 'red-flag-green-flag') return flagPrompts;
  if (game === 'couple-dare-ladder') return ladderPrompts;
  return pillowPrompts;
}

export default function RelationshipPromptGame({ game }: Props) {
  const [dateStage, setDateStage] = useState<DateStage>('first');
  const [intensity, setIntensity] = useState<Intensity>('easy');
  const [turnFormat, setTurnFormat] = useState<TurnFormat>('one-phone');
  const [perspective, setPerspective] = useState<Perspective>('partner');
  const [context, setContext] = useState<Context>('date');
  const [flagContext, setFlagContext] = useState<FlagContext>('first-date');
  const [ladderLevel, setLadderLevel] = useState<LadderLevel>('sweet');
  const [pillowMood, setPillowMood] = useState<PillowMood>('cozy');
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [labelA, setLabelA] = useState('Partner A');
  const [labelB, setLabelB] = useState('Partner B');
  const [turn, setTurn] = useState(0);

  const safeIntensity = useMemo(() => {
    if (game !== 'date-night-questions') return intensity;
    const allowed = allowedDateIntensities(dateStage);
    return allowed.includes(intensity) ? intensity : allowed[allowed.length - 1];
  }, [dateStage, game, intensity]);

  const [firstLabel, secondLabel] = labelPair(perspective, labelA, labelB);
  const asker = turn % 2 === 0 ? firstLabel : secondLabel;
  const answerer = turn % 2 === 0 ? secondLabel : firstLabel;

  const available = useMemo(() => {
    return cardDeck(game).filter((card) => {
      if (game === 'date-night-questions') {
        return includesOrEmpty(card.dateStages, dateStage) && includesOrEmpty(card.intensities, safeIntensity);
      }
      if (game === 'flirty-truth-or-dare') {
        return includesOrEmpty(card.contexts, context) && includesOrEmpty(card.intensities, intensity);
      }
      if (game === 'couples-never-have-i-ever') {
        return includesOrEmpty(card.contexts, context) && includesOrEmpty(card.intensities, intensity);
      }
      if (game === 'couples-would-you-rather') {
        return includesOrEmpty(card.dateStages, dateStage) && includesOrEmpty(card.intensities, intensity);
      }
      if (game === 'red-flag-green-flag') {
        return includesOrEmpty(card.flagContexts, flagContext) && includesOrEmpty(card.intensities, intensity);
      }
      if (game === 'couple-dare-ladder') {
        return card.ladderLevel === ladderLevel;
      }
      return pillowMood === 'surprise' || includesOrEmpty(card.pillowMoods, pillowMood);
    });
  }, [context, dateStage, flagContext, game, intensity, ladderLevel, pillowMood, safeIntensity]);

  const lockedForAdult =
    (game === 'flirty-truth-or-dare' && intensity === 'after-dark' && !adultConfirmed) ||
    (game === 'couple-dare-ladder' && ['close', 'spicy', 'after-dark'].includes(ladderLevel) && (!adultConfirmed || !agreed));

  const card = available.length > 0 ? available[turn % available.length] : undefined;
  const cardNumber = available.length > 0 ? (turn % available.length) + 1 : 0;

  const reset = () => {
    setTurn(0);
    setAdultConfirmed(false);
    setAgreed(false);
  };

  const levelIndex = ladderOrder.indexOf(ladderLevel);

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Game setup</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Local pass-and-play only. Nothing here needs an account, sync, or saved answers.
            </p>
          </div>
          <button type="button" onClick={reset} className="btn-ghost text-sm">Reset</button>
        </div>

        {(game === 'date-night-questions' || game === 'couples-would-you-rather') && (
          <ControlGroup label="Date stage">
            {(Object.keys(DATE_STAGE_LABEL) as DateStage[]).map((stage) => (
              <Pill key={stage} active={dateStage === stage} onClick={() => { setDateStage(stage); setTurn(0); }}>
                {DATE_STAGE_LABEL[stage]}
              </Pill>
            ))}
          </ControlGroup>
        )}

        {game === 'date-night-questions' && (
          <>
            <ControlGroup label="Turn format">
              <Pill active={turnFormat === 'one-phone'} onClick={() => setTurnFormat('one-phone')}>One phone, pass it</Pill>
              <Pill active={turnFormat === 'two-phone'} onClick={() => setTurnFormat('two-phone')}>Two phones, manual turns</Pill>
            </ControlGroup>
            <ControlGroup label="Perspective">
              <Pill active={perspective === 'partner'} onClick={() => setPerspective('partner')}>Partner A / B</Pill>
              <Pill active={perspective === 'boy-girl'} onClick={() => setPerspective('boy-girl')}>Boy / Girl</Pill>
              <Pill active={perspective === 'girl-boy'} onClick={() => setPerspective('girl-boy')}>Girl / Boy</Pill>
            </ControlGroup>
          </>
        )}

        {game !== 'couple-dare-ladder' && game !== 'pillow-talk-cards' && (
          <ControlGroup label="Intensity">
            {(Object.keys(INTENSITY_LABEL) as Intensity[])
              .filter((value) => game !== 'date-night-questions' || allowedDateIntensities(dateStage).includes(value))
              .filter((value) => game !== 'red-flag-green-flag' || value !== 'after-dark')
              .filter((value) => game !== 'couples-would-you-rather' || value !== 'after-dark')
              .filter((value) => game !== 'couples-never-have-i-ever' || value !== 'after-dark')
              .map((value) => (
                <Pill key={value} active={(game === 'date-night-questions' ? safeIntensity : intensity) === value} onClick={() => { setIntensity(value); setTurn(0); }}>
                  {INTENSITY_LABEL[value]}
                </Pill>
              ))}
          </ControlGroup>
        )}

        {(game === 'flirty-truth-or-dare' || game === 'couples-never-have-i-ever') && (
          <ControlGroup label="Context">
            {(Object.keys(CONTEXT_LABEL) as Context[]).map((value) => (
              <Pill key={value} active={context === value} onClick={() => { setContext(value); setTurn(0); }}>
                {CONTEXT_LABEL[value]}
              </Pill>
            ))}
          </ControlGroup>
        )}

        {game === 'red-flag-green-flag' && (
          <ControlGroup label="Scenario type">
            {(Object.keys(FLAG_CONTEXT_LABEL) as FlagContext[]).map((value) => (
              <Pill key={value} active={flagContext === value} onClick={() => { setFlagContext(value); setTurn(0); }}>
                {FLAG_CONTEXT_LABEL[value]}
              </Pill>
            ))}
          </ControlGroup>
        )}

        {game === 'couple-dare-ladder' && (
          <>
            <ControlGroup label="Ladder level">
              {ladderOrder.map((value) => (
                <Pill key={value} active={ladderLevel === value} onClick={() => { setLadderLevel(value); setTurn(0); }}>
                  {LADDER_LABEL[value]}
                </Pill>
              ))}
            </ControlGroup>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <input type="checkbox" checked={adultConfirmed} onChange={(e) => setAdultConfirmed(e.target.checked)} className="mt-1" />
                <span>Both players confirm this is private adult play.</span>
              </label>
              <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
                <span>Both players agree skip, level down, and stop are always valid.</span>
              </label>
            </div>
          </>
        )}

        {game === 'pillow-talk-cards' && (
          <ControlGroup label="Deck mood">
            {(Object.keys(PILLOW_LABEL) as PillowMood[]).map((value) => (
              <Pill key={value} active={pillowMood === value} onClick={() => { setPillowMood(value); setTurn(0); }}>
                {PILLOW_LABEL[value]}
              </Pill>
            ))}
          </ControlGroup>
        )}

        {(game === 'date-night-questions' || game === 'couple-dare-ladder') && perspective === 'partner' && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="label-a">Partner A label</label>
              <input id="label-a" className="input" value={labelA} onChange={(e) => setLabelA(clampText(e.target.value))} />
            </div>
            <div>
              <label className="label" htmlFor="label-b">Partner B label</label>
              <input id="label-b" className="input" value={labelB} onChange={(e) => setLabelB(clampText(e.target.value))} />
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-pink-200 bg-gradient-to-br from-rose-50 via-white to-amber-50 p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <span>{available.length} matching cards</span>
          <span>{cardNumber > 0 ? `Card ${cardNumber} of ${available.length}` : 'No cards'}</span>
        </div>

        {turnFormat === 'two-phone' && game === 'date-night-questions' && (
          <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900">
            Two-phone mode is manual: open this page on both phones, choose the same setup, and alternate together. There is no sync or multiplayer state.
          </div>
        )}

        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
          Pass is always allowed. A skipped prompt is not a failed turn.
        </div>

        {lockedForAdult ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            This tier is locked until the adult/private and mutual-skip confirmations are selected. Lower levels remain available.
          </div>
        ) : card ? (
          <PromptCardView card={card} asker={asker} answerer={answerer} game={game} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            No cards match this setup yet. Lower the intensity, choose another context, or reset the deck.
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={() => setTurn((v) => v + 1)}>Next card</button>
          <button type="button" className="btn-ghost" onClick={() => setTurn((v) => Math.max(0, v - 1))}>Back</button>
          <button type="button" className="btn-ghost" onClick={() => setTurn((v) => v + 1)}>Skip</button>
          {game === 'couple-dare-ladder' && (
            <>
              <button type="button" className="btn-ghost" onClick={() => setLadderLevel(ladderOrder[Math.max(0, levelIndex - 1)])}>Level down</button>
              <button type="button" className="btn-ghost" onClick={() => setLadderLevel(ladderOrder[Math.min(ladderOrder.length - 1, levelIndex + 1)])}>Level up</button>
              <button type="button" className="btn-ghost" onClick={() => { setLadderLevel('sweet'); setTurn(0); }}>Stop / return to Sweet</button>
            </>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <strong>Scope:</strong> These are entertainment and conversation games. They do not predict compatibility, replace therapy, or store private answers.
      </section>
    </div>
  );
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? 'border-brand-600 bg-brand-50 text-brand-800'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function PromptCardView({ card, asker, answerer, game }: { card: PromptCard; asker: string; answerer: string; game: GameId }) {
  const showTurn = game === 'date-night-questions' || game === 'couple-dare-ladder' || game === 'pillow-talk-cards';
  return (
    <div className="rounded-2xl border border-white bg-white/90 p-5 shadow-sm">
      {showTurn && (
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-rose-600">
          {asker} asks · {answerer} answers
        </div>
      )}
      {card.kind === 'choice' ? (
        <>
          <div className="text-sm font-semibold text-slate-700">{card.text}</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-base font-semibold text-slate-900">{card.optionA}</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-base font-semibold text-slate-900">{card.optionB}</div>
          </div>
        </>
      ) : (
        <p className="text-xl font-semibold leading-snug text-slate-950">{card.text}</p>
      )}
      {card.followUp && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Follow-up: {card.followUp}
        </p>
      )}
    </div>
  );
}
