import type { ContentPageConfig } from '../content-pages';

export const ARTICLES_PROPERTY_HVAC: ContentPageConfig[] = [
  {
    id: 'hvac-diagnosis-live-matrix',
    kind: 'guide',
    section: 'guides',
    slug: 'hvac-diagnosis-live-matrix',
    guideCategory: 'Property',
    title: 'HVAC Diagnosis Live Matrix: Symptoms Before Replacement',
    h1: 'HVAC Diagnosis Live Matrix',
    subhead: 'AC, heater, gas furnace, electric heat, heat pump, thermostat, board, and safety symptoms mapped to real repair questions.',
    outcomeLine: 'Use symptoms and history to make the service call prove its claim before the sales quote names the replacement system.',
    description: 'Real-world HVAC diagnosis guide covering heater problems, capacitor, contactor, float switch, flame sensor, sequencer, board, thermostat, compressor, refrigerant, and replacement red flags.',
    keywords: ['hvac diagnosis matrix', 'heater not working', 'furnace flame sensor', 'electric furnace sequencer', 'ac capacitor failure', 'thermostat hvac issue'],
    intro:
      'HVAC diagnosis should start with the symptom sequence and recent history, not the replacement package. The homeowner should not have to know the failed part; the technician should prove it.',
    keyPoints: [
      'Dead AC can be capacitor, contactor, float switch, thermostat, fan motor, breaker, or compressor.',
      'A heater call starts by identifying the heat type: gas furnace, electric strips, heat pump plus auxiliary heat, boiler, or another setup.',
      'Gas furnace lights then shuts off often points to flame sensing or proof-of-flame logic before full replacement.',
      'Electric heat can fail by sequencer, relay, heat-strip stage, breaker, or thermostat setup.',
      'Board replacement should name the failed input or output, not just “bad board.”',
      'Gas smell, CO alarm, flame rollout, burning smell, melted wiring, or repeated breaker trips are stop conditions.',
    ],
    whenToUse: [],
    relatedLinks: [
      { label: 'HVAC Diagnosis Live Matrix Tool', href: '/property/hvac-diagnosis-live-matrix/' },
      { label: 'HVAC Replacement Cost Calculator', href: '/property/hvac-replacement-cost/' },
      { label: 'HVAC Repair vs Replace Calculator', href: '/property/hvac-repair-vs-replace/' },
      { label: 'Before You Replace Your HVAC', href: '/guides/hvac-full-replacement-alternatives/' },
    ],
    primaryCta: { label: 'Open the diagnosis matrix', href: '/property/hvac-diagnosis-live-matrix/' },
    secondaryCtas: [
      { label: 'Estimate replacement paths', href: '/property/hvac-replacement-cost/' },
      { label: 'Run repair vs replace', href: '/property/hvac-repair-vs-replace/' },
    ],
    longformMarkdown: `
## Safety first, then diagnosis

This guide is not a repair manual. It is a homeowner script for making the service call honest.

Stop using the system and get qualified help if there is gas smell, a carbon monoxide alarm, flame rollout, burning smell, melted wiring, immediate breaker trips, or a technician documents a cracked heat exchanger. Those are not bargaining topics.

For everything else, start with what you actually saw: silent outdoor unit, humming, fan running without cooling, ice, water in the pan, blank thermostat, weak heat, burner lights then shuts off, breaker trips, rooms that never cool, or a recent thermostat/service change. That is enough. The technician's job is to connect that history to measurements and a repair choice.

## Cooling: AC seems dead

Do not jump from "outdoor unit is dead" to "replace the system." Ask what the outdoor unit did when the thermostat called.

- Silent: contactor, low-voltage signal, float switch, breaker, disconnect, or board/control issue.
- Hums but fan does not spin: capacitor, fan motor, hard-start, or compressor start problem.
- Fan runs but compressor does not: capacitor, compressor, contactor, wiring, overload, or refrigerant/safety condition.
- Breaker trips immediately: shorted compressor, wiring, motor, or electrical fault. Stop DIY troubleshooting.

The homeowner pushback is simple: "Did you test the capacitor, contactor, voltage, amp draw, and fan motor before quoting replacement?"

## Cooling: warm air or weak cooling

Warm air can be low refrigerant, but it can also be airflow, dirty condenser coil, dirty indoor coil, bad blower, blocked filter, iced evaporator, duct leakage, or thermostat/setup issue.

Ask whether the system was thawed before testing, whether static pressure was checked, whether the indoor coil was inspected, and whether the condenser coil was cleaned.

## Heater not working: identify the heat type first

"The heater is out" is not enough information for a replacement quote. A gas furnace, electric furnace, heat pump with auxiliary heat, boiler, and dual-fuel system fail in different ways.

Ask the technician to identify the heat type and the failed sequence:

- gas furnace: inducer, pressure switch, igniter, gas valve, flame proof, rollout/limit safeties, and blower delay,
- electric furnace or air handler: sequencer, relay, heat-strip stage, breaker, blower, and thermostat auxiliary-heat call,
- heat pump: outdoor heat output, reversing valve, defrost behavior, auxiliary heat staging, and thermostat setup.

If the quote jumps straight to "replace the heater," ask which symptom and measurement supports that conclusion and what cheaper service-call path was ruled out.

## Gas heat: burner lights then shuts off

This is where the flame sensor matters. If the burners light for a few seconds and then drop out, the furnace may not be proving flame. A dirty flame sensor, grounding issue, wiring issue, or board flame-sense circuit can cause that pattern.

That is very different from "replace the furnace." Ask: "What step in the ignition sequence failed? Did you clean and test the flame sensor? Did you verify ground and flame signal?"

## Gas heat: inducer runs but no ignition

The sequence matters:

- thermostat calls for heat,
- inducer starts,
- pressure switch proves draft,
- igniter energizes,
- gas valve opens,
- flame is proven,
- blower starts after delay.

If the sequence stops, ask where. Pressure switch, blocked venting, inducer, igniter, gas valve, flame sensor, rollout switch, limit switch, and board can all be involved.

## Electric heat: sequencer and heat strips

Electric furnaces and air handlers are high-current systems. A sequencer or relay can fail so the blower runs but heat strips do not energize, or only some stages heat. A thermostat can also fail to call auxiliary heat correctly.

Ask: "Which heat-strip stages energized, what amperage did each stage draw, and did the sequencer or relay fail?"

If the breaker trips when heat starts, treat that as a safety/electrical diagnosis, not a casual reset problem.

## Heat pump: separate outdoor heat from auxiliary heat

A heat pump may be fine in cooling but weak in heating, or the outdoor unit may run while auxiliary heat never stages. Thermostat configuration can make this worse by locking out heat pump stages or overusing expensive auxiliary heat.

Ask: "Is the outdoor unit producing heat, is auxiliary heat staging, and is the thermostat configured for this exact equipment type?"

## Board replacement: make them prove it

Control boards fail. But "bad board" is also a common lazy diagnosis.

A real board diagnosis should name the failed input or output:

- power enters board but no inducer output,
- thermostat call reaches board but no outdoor call,
- flame signal is present but board drops gas valve,
- relay output fails under load.

Ask what cheaper component was ruled out before the board quote.

## Service-call worksheet: questions by symptom

Use this as a private script before the technician arrives. The point is not to diagnose the system yourself. The point is to keep the conversation tied to symptoms, measurements, and cheaper causes before the quote becomes a replacement package.

For cooling that seems dead, write down whether the thermostat is blank, whether the indoor blower runs, whether the outdoor unit is silent, humming, spinning without cooling, or tripping the breaker. Then ask which low-voltage call, safety switch, capacitor, contactor, motor, compressor, and breaker readings support the recommendation.

For weak cooling, write down whether the filter was dirty, whether the coil iced over, whether airflow feels weak, whether one room is the problem, and whether anything changed recently. Then ask whether airflow, static pressure, indoor coil condition, condenser cleanliness, duct leakage, and refrigerant charge were checked in that order.

For gas heat, write down whether the inducer runs, whether the igniter glows, whether flame starts and drops out, whether the blower starts, and whether any safety switch is open. Then ask for the failed sequence step: pressure switch, igniter, gas valve, flame sensor, rollout, limit, board input, or board output.

For electric heat, write down whether the blower runs, whether heat is weak or absent, whether only auxiliary heat works, and whether a breaker trips. Then ask which sequencer, relay, heat-strip stage, thermostat call, and amperage reading was tested.

For heat pumps, write down whether cooling works, whether outdoor heat works, whether auxiliary heat stages, whether defrost happens, and whether the thermostat was recently replaced. Then ask whether the thermostat is configured for the exact equipment type and whether the reversing valve, outdoor unit, and auxiliary heat were tested separately.

If replacement is still recommended, ask for the evidence sentence: "The symptom was X, the measured failed item was Y, cheaper causes A/B/C were ruled out, and replacement is recommended because Z." If the answer is only "it is old," you do not have a diagnosis yet.

## Replacement is valid when the diagnosis supports it

Replacement becomes more serious when multiple major parts are failing, the compressor is confirmed shorted or mechanically locked, the heat exchanger is unsafe, the coil is old and leaking, refrigerant economics are ugly, or the system is near end of life and repair cost is high.

But the quote should still connect the homeowner symptom to evidence. "Old" is not a diagnosis.
`,
    faq: [
      {
        q: 'Can a capacitor make my AC look dead?',
        a: 'Yes. A failed capacitor can stop the outdoor fan or compressor from starting and can make the system hum, short cycle, or appear dead.',
      },
      {
        q: 'Does a dirty flame sensor mean I need a new furnace?',
        a: 'Usually no. If the burner lights briefly and shuts off, flame sensing should be checked before a replacement quote is taken seriously.',
      },
      {
        q: 'Should I replace the HVAC control board?',
        a: 'Only after the technician explains which board input or output failed and rules out thermostat power, safeties, sensors, relays, wiring, and obvious service-call causes.',
      },
      {
        q: 'What should I ask the HVAC technician before accepting replacement?',
        a: 'Ask them to connect your symptom to test readings, name the failed sequence step, and list the cheaper causes they ruled out. A serious replacement quote should explain why capacitor, contactor, thermostat, safety switch, flame sensor, sequencer, airflow, duct, or board-output problems do not explain the failure.',
      },
    ],
  },
  {
    id: 'ac-dead-not-always-replacement',
    kind: 'guide',
    section: 'guides',
    slug: 'ac-dead-not-always-replacement',
    guideCategory: 'Property',
    title: 'Your AC Is Dead: Why That Does Not Always Mean Replacement',
    h1: 'Your AC Is Dead: Why That Does Not Always Mean Replacement',
    subhead: 'Capacitors, contactors, float switches, thermostats, filters, fan motors, and compressor start failures before a full-system quote.',
    outcomeLine: 'A dead-looking AC is a symptom, not a replacement diagnosis.',
    description: 'Homeowner guide to AC dead calls: capacitor, contactor, float switch, breaker, dirty filter, iced coil, fan motor, compressor, refrigerant, and replacement red flags.',
    keywords: ['ac dead not replacement', 'ac capacitor failure', 'ac contactor failure', 'air conditioner not turning on'],
    intro:
      'If your AC died, the first question is not "how much is a new system?" The first question is "what did it do, what was tested, and what evidence supports the recommendation?"',
    keyPoints: [
      'A bad capacitor can make the outdoor unit hum or fail to start.',
      'A bad contactor or low-voltage problem can make the outdoor unit silent.',
      'A float switch can shut the system off because the drain is clogged.',
      'A dirty filter or iced coil can create warm air and shutdown symptoms.',
      'A truly shorted compressor is different from a compressor that simply did not start.',
    ],
    whenToUse: [],
    relatedLinks: [
      { label: 'HVAC Diagnosis Live Matrix', href: '/property/hvac-diagnosis-live-matrix/' },
      { label: 'HVAC Replacement Cost Calculator', href: '/property/hvac-replacement-cost/' },
      { label: 'HVAC Repair vs Replace Calculator', href: '/property/hvac-repair-vs-replace/' },
    ],
    primaryCta: { label: 'Open the diagnosis matrix', href: '/property/hvac-diagnosis-live-matrix/' },
    longformMarkdown: `
## Do not let "dead AC" become an automatic sales call

A dead AC call should begin with simple electrical and safety checks. The outdoor unit may look dead because it is not receiving a call, the contactor is not pulling in, the capacitor failed, the drain float switch is open, the breaker tripped, or the thermostat is not configured correctly.

## Ask for test readings

Do not accept "it is old" as the diagnosis. Ask for the capacitor reading, contactor condition, voltage, amp draw, breaker behavior, and whether the compressor is electrically shorted or just not starting.

## Capacitor and contactor failures

Capacitors are common failure points. A weak or failed capacitor can stop the fan or compressor from starting. Contactors can burn or fail so the outdoor unit does not energize.

Those repairs are not the same as replacing the whole HVAC system.

## Float switch and drain shutdowns

Many systems are wired so a clogged condensate drain trips a float switch and stops cooling. That protects the house from water damage. It can look like a dead system from the thermostat.

Ask whether the drain pan or float switch was checked before the replacement conversation started.

## Compressor diagnosis must be specific

"Bad compressor" should mean something specific: shorted windings, grounded compressor, locked rotor, failed start components, internal mechanical failure, or repeated overload. Some start problems are not compressor death.

If the system is old, full replacement may still be right. But make the diagnosis earn the quote.
`,
    faq: [
      {
        q: 'Can a clogged drain stop my AC?',
        a: 'Yes. A float switch can shut down the system to prevent water damage.',
      },
      {
        q: 'Is a bad capacitor expensive?',
        a: 'Compared with replacement, it is usually a service-call repair. Pricing varies, but it should not be treated as proof the full system is bad.',
      },
    ],
  },
  {
    id: 'hvac-full-replacement-alternatives',
    kind: 'guide',
    section: 'guides',
    slug: 'hvac-full-replacement-alternatives',
    guideCategory: 'Property',
    title: 'Before You Replace Your HVAC: Repair and Partial-Replacement Options',
    h1: 'Before You Replace Your HVAC',
    subhead: 'What to price before accepting a full system replacement quote.',
    outcomeLine: 'A failed AC part is not automatic proof that the furnace, blower, ductwork, housing, and line set all need to be replaced.',
    description: 'Practical HVAC replacement alternatives: compressor repair, condenser and coil replacement, keeping a gas furnace, duct fixes, and mini-split add-ons.',
    keywords: ['hvac replacement alternatives', 'repair vs replace hvac', 'condenser and coil replacement', 'compressor repair vs replacement'],
    intro:
      'HVAC contractors often quote the cleanest, safest, and most profitable scope: full replacement. Sometimes that is right. Sometimes the symptoms point to a narrower repair or partial replacement.',
    keyPoints: [
      'Give the contractor symptoms and history, then ask what evidence proves the claimed bad item: compressor, condenser, coil, blower, control board, furnace, ductwork, or comfort design.',
      'Ask for at least one partial-scope quote and one full-scope quote.',
      'A usable gas furnace and blower can sometimes stay while cooling equipment is replaced.',
      'Mini-splits are a zone strategy, not one generic wall unit sized like a central AC.',
      'Full replacement should be justified with age, compatibility, safety, refrigerant, warranty, or labor economics.',
    ],
    whenToUse: [],
    relatedLinks: [
      { label: 'HVAC Replacement Cost Calculator', href: '/property/hvac-replacement-cost/' },
      { label: 'HVAC Repair vs Replace Calculator', href: '/property/hvac-repair-vs-replace/' },
      { label: 'Heat Pump Cost Calculator', href: '/property/heat-pump-cost/' },
      { label: 'Ductwork Cost Calculator', href: '/property/ductwork-cost/' },
      { label: 'Replace My HVAC Track', href: '/tracks/replace-my-hvac/' },
    ],
    primaryCta: { label: 'Estimate HVAC options', href: '/property/hvac-replacement-cost/' },
    secondaryCtas: [
      { label: 'Run repair vs replace', href: '/property/hvac-repair-vs-replace/' },
      { label: 'Open HVAC track', href: '/tracks/replace-my-hvac/' },
    ],
    longformMarkdown: `
## Start with symptoms and history, not the sales package

The useful question is not "how much is a new HVAC system?" The useful question is "what did the homeowner observe, what can the technician prove, what still has useful life, and which replacement scopes are technically reasonable?"

If the compressor shorted, the outdoor unit may be the problem. If the condenser failed, the indoor furnace and blower may still be fine. If the indoor coil leaks, the coil and condenser match may matter more than the gas furnace. If the rooms are uncomfortable, the real issue may be return air, duct leakage, zoning, insulation, or load mismatch.

## Options to ask for before full replacement

### Compressor-only repair

This can be worth pricing when the system is not very old, the refrigerant is serviceable, the indoor coil is clean, and labor plus parts do not approach the price of a condenser or full replacement.

Pushback question: "What is the installed compressor price, what warranty applies, and why is it worse than replacing the condenser?"

### Condenser plus indoor coil

This can be the most important counter-scope for a gas furnace plus split AC house. The cooling side can be replaced while the furnace, blower, cabinet, and some existing infrastructure stay in service.

Pushback question: "Can you quote condenser plus matching coil while reusing the furnace and blower? If not, what specific compatibility or safety issue prevents it?"

### Keep gas heat and add mini-splits

If the gas furnace still heats well but cooling is weak, adding mini-splits can be a staged option. It can target bedrooms, offices, additions, upstairs rooms, or hot rooms without rebuilding the entire ducted system.

Pushback question: "Which rooms need heads, what BTU does each room need, where do the line sets run, where does condensate drain, and what electrical work is included?"

### Duct repair before equipment replacement

If the problem is comfort, dust, hot rooms, weak returns, or rooms that never cool, equipment replacement may not solve the problem. Duct sealing, return sizing, insulation, balancing, or zoning may be the better first quote.

Pushback question: "What duct measurement or inspection supports replacing the equipment instead of fixing airflow?"

### Full replacement

Full replacement can be right when the furnace or air handler is old, the coil is incompatible, refrigerant economics are bad, controls are failing, the cabinet or heat exchanger has safety issues, or the labor economics make a repair poor value.

Pushback question: "List the symptom evidence, incompatible parts, and parts replaced mainly for warranty or labor simplicity."

## R-22, reclaimed refrigerant, and the Freon scare pitch

"Your Freon is phased out" is not enough reason to buy a full system. It is a reason to price the refrigerant path honestly.

Existing R-22 systems can still be serviced with recovered, recycled, or reclaimed R-22. That supply is not infinite and it can be expensive, but expensive refrigerant is different from impossible repair. If the system is otherwise healthy, a refrigerant repair or retrofit can buy several more years.

Ask for three numbers:

- the price to repair and charge with reclaimed R-22,
- the price to convert to a compatible R-22 replacement refrigerant,
- the price difference between partial equipment replacement and full system replacement.

Also ask what happens to recovered R-22. Reclaimed R-22 has value in the service chain. It should not disappear into the quote without explanation.

## R-407-style retrofits are not magic, but they are real

Some R-22 systems can be converted to retrofit refrigerants such as R-407-family or R-438A-style replacements. The important homeowner point is not the brand name. The important point is that "R-22 phased out" does not automatically equal "replace everything."

A serious retrofit quote should say what refrigerant is being used, whether oil work is needed, whether seals or metering devices need attention, what capacity loss is expected, how the system will be labeled, and why retrofit is or is not worth it compared with a condenser/coil or full replacement.

## Coil age changes the decision

If the indoor coil is 20+ years old, plan to replace it, especially if the condenser is being replaced. Coils often leak first. Keeping an old coil while replacing an outdoor unit can create a false cheap quote: you save money today, then pay again when the coil leaks or compatibility causes problems.

Going from R-22 to R-410A is not automatically an "upgrade" from the homeowner's point of view. It may be driven by refrigerant availability and equipment platform rules. If the existing system can reasonably be kept alive with reclaimed R-22 or a retrofit refrigerant, make the contractor prove why full replacement is better.

## The contractor incentive problem

Full replacement is easier to sell, easier to warranty, and usually more profitable than diagnostic repair or partial replacement. That does not make it dishonest. It does mean you should force a scope comparison.

Ask for:

- repair scope,
- partial cooling-side replacement scope,
- full replacement scope,
- duct or airflow scope,
- rebate and financing assumptions,
- what is excluded from each quote.

## What a serious HVAC quote should state

A serious quote names the equipment, matched components, refrigerant, efficiency rating, thermostat, duct work, line-set reuse or replacement, electrical work, condensate handling, permit, labor warranty, manufacturer warranty, and what happens if hidden problems are found.

If the quote is just "replace system" and a price, it is not detailed enough.
`,
    faq: [
      {
        q: 'Should I always replace the full HVAC system if the compressor fails?',
        a: 'No. A compressor failure can justify replacement, but it should also trigger a comparison against compressor repair or condenser-and-coil replacement when the rest of the system is still usable.',
      },
      {
        q: 'Can I keep my gas furnace and replace only AC parts?',
        a: 'Sometimes. In a gas furnace plus split AC setup, the furnace and blower may be reusable if they are compatible, safe, and not near end of life.',
      },
      {
        q: 'Are mini-splits a replacement for central AC?',
        a: 'Sometimes, but not as one generic unit. A mini-split plan needs room-by-room load, head count, line-set routing, drains, electrical work, and comfort expectations.',
      },
    ],
  },
  {
    id: 'mini-splits-vs-central-ac',
    kind: 'guide',
    section: 'guides',
    slug: 'mini-splits-vs-central-ac',
    guideCategory: 'Property',
    title: 'Mini-Splits vs Central AC: When Ductless Is Actually Smart',
    h1: 'Mini-Splits vs Central AC',
    subhead: 'Use mini-splits for zones, additions, bad ducts, and staged cooling — not as a vague magic replacement.',
    outcomeLine: 'Mini-splits are planned by rooms, heads, BTU, line sets, drains, and electrical scope.',
    description: 'When mini-splits beat central AC, when they do not, and how to ask for a real ductless quote.',
    keywords: ['mini splits vs central ac', 'ductless mini split cost', 'mini split zones', 'add mini splits to house'],
    intro:
      'A mini-split quote should not sound like "install a 4 ton mini split." Ductless systems are zone tools. The question is which rooms need capacity and how the equipment will be installed.',
    keyPoints: [
      'Mini-splits can be strong for additions, upstairs bedrooms, offices, hot rooms, and houses with bad ducts.',
      'Central AC can still be better for whole-house even comfort when ducts are sound.',
      'The cost pressure moves from ducts to indoor heads, line sets, drains, outdoor-unit location, and electrical work.',
      'Keeping gas heat and adding mini-splits for cooling can be a staged path.',
    ],
    whenToUse: [],
    relatedLinks: [
      { label: 'Heat Pump Cost Calculator', href: '/property/heat-pump-cost/' },
      { label: 'HVAC Replacement Cost Calculator', href: '/property/hvac-replacement-cost/' },
      { label: 'Energy Savings Estimate', href: '/property/energy-savings-estimate/' },
      { label: 'HVAC Alternatives Guide', href: '/guides/hvac-full-replacement-alternatives/' },
    ],
    primaryCta: { label: 'Compare HVAC paths', href: '/property/hvac-replacement-cost/' },
    longformMarkdown: `
## When mini-splits make sense

Mini-splits are strongest when the house has a zone problem:

- one hot bedroom,
- a garage conversion,
- a room over the garage,
- a sunroom or addition,
- a home office that needs independent control,
- weak ducts that are expensive to fix,
- a plan to keep gas heat but add heat-pump cooling and shoulder-season heating.

## When central AC is still better

Central AC can still win when the ductwork is good, the whole home needs even cooling, aesthetics matter, or indoor wall heads would be awkward. Ductless is not automatically more comfortable.

## What to ask for in a mini-split quote

Ask for the room-by-room BTU assumption, number of indoor heads, outdoor unit size, line-set route, condensate drain route, electrical panel impact, permit, labor warranty, and what the quote does not include.

If the contractor says "4 tons" without showing room/zone logic, ask them to translate that into heads and room loads.

## Staged strategy: keep gas heat

For a house with a working gas furnace, mini-splits can be added first for cooling or problem rooms. The furnace remains backup heat. Later, the owner can decide whether to replace the ducted system, add more ductless zones, or move to a central heat pump.
`,
    faq: [
      {
        q: 'Is there such a thing as a 4 ton mini-split?',
        a: 'There can be multi-zone outdoor units with large total capacity, but the useful design is by room and indoor head, not one generic wall unit for the whole house.',
      },
      {
        q: 'Do mini-splits need ductwork?',
        a: 'Ductless mini-splits do not use the central duct system. Some ducted mini-split designs exist, but a standard ductless quote should focus on heads, line sets, drains, and electrical work.',
      },
    ],
  },
];
