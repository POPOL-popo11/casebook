import type { CaseContent } from '../../contracts/types'

// The Urgent Onboarding Request, shared by Tom H. (Risk & Onboarding Operations). Individual mode only.
// The source gives the task, the four starting materials, the three materials the learner can
// request, the core conflict (urgency is no substitute for evidence; a difference does not by itself
// mean the customer is a problem), the submission, the three Team Lead observations and the
// follow-up. It also says the rules a learner needs must be given as case material, so nobody has to
// guess legal requirements (m4). Every fact beyond those, and all wording not translated from the
// source, is a DRAFT: to be confirmed. Every name in it is fictional.
// In a material body, '\n' is a line break and lines with '|' are rows of a small table (first row: header).
export const CASE: CaseContent = {
  id: 'urgent-onboarding',
  // The source's task, translated (not a draft).
  background:
    'An important customer wants to start using the service tomorrow, but the application form, the company documents and the website information are inconsistent.',
  brief:
    'An important customer wants to start using the service tomorrow, but the application form, the company documents and the website information are inconsistent. Propose the next investigation steps and a handover recommendation.',
  // m1–m4 open at the start; m5–m7 unlock by request (r1 → m5, r2 → m6, r3 → m7). Titles are the
  // source's material names, as in library.ts. Facts agree across materials: Tallowood Holdings owns
  // 100% of the applicant; Jordan Moreau holds 60% of Holdings and Casey Lin 40% (from February);
  // the online shop opened in August; the About page is two years old. Days: applied Monday, website
  // checked Tuesday, today is Wednesday, the customer wants Thursday, their invoice is due Friday.
  // Every body, source, date and scope is a DRAFT: to be confirmed.
  materials: [
    {
      id: 'm1',
      title: 'Application summary',
      visibility: 'start',
      body: "Applicant: Tallowood Trading Pty Ltd.\nDirector: Jordan Moreau.\nOwners of 25% or more: Jordan Moreau, 100%.\nSales channels ticked: wholesale. Not ticked: online retail.\nExpected payments: about A$2.4 million a month, to suppliers in Vietnam.\nRequested start: Thursday this week.\nAccount manager's note, Tuesday: \"A great customer. The differences are just paperwork. Can we get them live by Thursday?\"",
      source: 'Application form, submitted by Jordan Moreau',
      date: 'Monday; note added Tuesday',
      scope: 'What the customer told us; nothing in it has been checked yet',
    },
    {
      id: 'm2',
      title: 'Business description',
      visibility: 'start',
      body: "From the application: \"We import kitchenware from manufacturers in Vietnam and sell it wholesale to retailers in Australia.\"\nFrom the customer's website, checked on Tuesday:\n- An online shop selling kitchenware to the public, under the name Tallowood Kitchen.\n- About page: \"Proud to work with our partners in Vietnam and Thailand.\"\nThe application does not mention the online shop, the name Tallowood Kitchen or Thailand.",
      source: "Application form, and the customer's website as checked by the onboarding team",
      date: 'Tuesday',
      scope: 'What the customer says it does; not its sales figures',
    },
    {
      id: 'm3',
      title: 'Company relationship chart',
      visibility: 'start',
      body: 'Company | Owned by | Directors\nTallowood Trading Pty Ltd (the applicant) | Tallowood Holdings Pty Ltd, 100% | Jordan Moreau, Casey Lin\nTallowood Holdings Pty Ltd | Jordan Moreau 60%, Casey Lin 40% | Jordan Moreau\nCasey Lin is not named anywhere on the application.',
      source: 'Drawn by the onboarding team from the company extract and share register the customer uploaded',
      date: 'Tuesday',
      scope: 'Who owns and runs each company on paper; not why',
    },
    // The source: the rules a learner needs are given as material. Fictional, for this case only.
    {
      id: 'm4',
      title: 'Simplified review process for this case',
      visibility: 'start',
      body: "These rules are simplified for this training case. They are not a real policy.\n1. Compare the application with the company documents and the website. Record each difference and where you found it.\n2. Everyone who owns 25% or more of the applicant, directly or through another company, must be named on the application and show proof of identity.\n3. You may ask the customer for documents or explanations. Requests to the customer go through the account manager.\n4. You may approve once every difference is explained and the application is corrected. The customer may explain a difference in business activity or countries in writing. Ownership on the application must match the company documents.\n5. If no document shows who owns or controls 25% or more, or who they hold it for, hand the application to Compliance. Compliance decides, usually within one business day.\n6. The account manager looks after the customer, but cannot approve an application or promise a start date.\n7. Write the reason for each step in the case notes, with the document it rests on.",
      source: 'Onboarding team, for this case',
      date: 'Current',
      scope: 'This case only',
    },
    {
      id: 'm5',
      title: 'Document update dates',
      visibility: 'request',
      body: 'Document | Date | What it shows\nApplication form | This Monday | Jordan Moreau as the only owner\nCompany extract | Two weeks ago | Tallowood Holdings owns the applicant\nShare register | Updated in February | Casey Lin holds 40% of Tallowood Holdings from February\nWebsite shop pages | Added in August | The online shop, trading as Tallowood Kitchen\nWebsite About page | Last changed two years ago | Partners in Vietnam and Thailand',
      source: 'Document details and website history, checked by the onboarding team',
      date: 'Wednesday, 10:00',
      scope: 'When each document was made or changed; not whether what it says is true',
    },
    {
      id: 'm6',
      title: "The customer's explanation",
      visibility: 'request',
      body: "1. Ownership: \"I run the business day to day, so I put myself down as the owner. Casey came in as my partner through Tallowood Holdings in February.\"\n2. Online sales: \"We opened our online shop, Tallowood Kitchen, in August. It is about 15% of our sales. Wholesale to retailers is still the rest.\"\n3. Thailand: \"We stopped buying from Thailand last year. The About page on our website is out of date.\"\n4. \"Can you please open the account tomorrow? Our supplier invoice of A$310,000 is due on Friday.\"",
      source: 'Email from Jordan Moreau, passed on by the account manager',
      date: 'Wednesday, 09:30',
      scope: "The customer's own account; no documents attached",
    },
    // The one question no document answers yet: who stands behind Casey Lin's 40% (m4, rule 5).
    {
      id: 'm7',
      title: 'How the related entities are connected',
      visibility: 'request',
      body: "From the customer's accountant:\n- Tallowood Holdings Pty Ltd owns 100% of Tallowood Trading Pty Ltd.\n- Jordan Moreau holds 60% of Tallowood Holdings in his own name.\n- Casey Lin holds 40% of Tallowood Holdings as trustee of the Lin Family Trust. The trust deed has not been supplied.\nOnboarding team's note: no document supplied so far shows who benefits from the Lin Family Trust.",
      source: "Customer's accountant, by email; note by the onboarding team",
      date: 'Wednesday, 11:00',
      scope: 'How the companies and owners connect; not who benefits from the trust',
    },
  ],
  framePrompt: 'The documents disagree. Does that make the customer a problem?', // DRAFT: to be confirmed (from the source's core conflict)
  constraints: [
    { label: 'Start wanted tomorrow', known: true }, // DRAFT: to be confirmed
    { label: 'Owners?', known: false }, // DRAFT: to be confirmed
    { label: 'Why they differ?', known: false }, // DRAFT: to be confirmed
  ],
  // Every card comes from a start material (m1–m3); each is a DRAFT: to be confirmed.
  cards: [
    { id: 'c1', text: 'Jordan Moreau owns 100%', source: 'Application form' },
    { id: 'c2', text: 'Moreau 60%, Lin 40%, via a holding company', source: 'Company documents' },
    { id: 'c3', text: 'Sells wholesale only', source: 'Application form, sales channels' },
    { id: 'c4', text: 'Online shop trading as Tallowood Kitchen', source: 'Customer website' },
    { id: 'c5', text: 'Partners in Vietnam and Thailand', source: 'Website, About page' },
    { id: 'c6', text: 'The differences are just paperwork', source: 'Account manager' },
  ],
  // The source's three requestable materials. Hours and why lines are DRAFT: to be confirmed.
  // Together they take 3.5 h against a 2.5 h budget, so the learner has to choose.
  requests: [
    {
      id: 'r1',
      title: 'Document update dates',
      hours: 1,
      why: 'an old document can explain a difference',
      finding: {
        label: 'Update dates',
        text: 'The ownership changed in February and the online shop opened in August. The About page is two years old.',
      },
      materialId: 'm5',
    },
    {
      id: 'r2',
      title: "The customer's explanation",
      hours: 1.5,
      why: 'only the customer can say why their own forms differ',
      finding: {
        label: "Customer's explanation",
        text: 'Casey Lin joined in February. Online sales began in August, about 15% of sales. Thailand stopped last year.',
      },
      materialId: 'm6',
    },
    {
      id: 'r3',
      title: 'How the related entities are connected',
      hours: 1,
      why: 'the 40% may be held for someone else',
      finding: {
        label: 'Related entities',
        text: 'Casey Lin holds the 40% as trustee of a family trust. No document shows who benefits from it.',
      },
      materialId: 'm7',
    },
  ],
  timeBudgetHours: 2.5, // DRAFT: to be confirmed
  // A approve on the customer's date, B ask for what is missing and send on only what documents
  // can't show, C hand everything to Compliance. DRAFT: to be confirmed
  options: [
    {
      id: 'A',
      label: 'Open tomorrow, collect documents after',
      tradeoff: 'Meets the date; opens before every owner is identified',
    },
    {
      id: 'B',
      label: 'Ask for missing documents; refer the rest to Compliance',
      tradeoff: 'Asks the customer for less; the start depends on their reply',
    },
    {
      id: 'C',
      label: 'Hand the whole application to Compliance',
      tradeoff: 'Compliance sees everything; a day’s wait, even for explained differences',
    },
  ],
  // DRAFT: to be confirmed (titles follow the Japan case; questions and prompt are drafted)
  decisionPoints: [
    {
      id: 'dp1',
      step: 'define',
      title: 'Define the task',
      question: 'What are you being asked to decide, and what may you decide alone?',
      status: 'confirmed',
    },
    {
      id: 'dp2',
      step: 'examine',
      title: 'Sort the evidence',
      question: 'Which differences are facts, and which are claims or guesses?',
      status: 'review',
      reviewPrompt: 'The application is the customer’s own account. Treat its 100% owner line as needing checks?',
    },
    {
      id: 'dp3',
      step: 'investigate',
      title: 'Close the gaps',
      question: 'What would explain each difference, and who stands behind the company?',
      status: 'confirmed',
      chips: ['Document update dates', "The customer's explanation", 'How the related entities are connected'],
    },
    {
      id: 'dp4',
      step: 'decide',
      title: 'Make the call',
      question: 'Approve, ask for documents, or hand it to Compliance? Who decides?',
      status: 'confirmed',
    },
  ],
  skillIds: ['evidence', 'escalation', 'collaboration'], // matches library.ts
  // Tom's reference answers: a reference, not an answer key. Everything in senior is a
  // DRAFT: to be confirmed. It follows the source's three Team Lead observations.
  senior: {
    decision: 'B',
    why: 'Two differences have plain reasons; the 40% held for a trust does not. Ask for what is missing, and send only the trust to Compliance.',
    byPoint: {
      dp1: {
        answer:
          'Work out why the application, the company documents and the website differ, get what is needed to decide, and hand on what I may not decide. The customer’s date is a constraint, not a reason to approve.',
        reason:
          'The review process sets what an analyst may approve. Urgency changes how fast I work, not what the account needs before it opens.',
      },
      dp2: {
        answer:
          'Verified: the company documents (Moreau 60%, Lin 40%, through a holding company) and the online shop, which anyone can see. Needs checking: the application’s 100% owner and wholesale-only lines, and the About page. Assumption: that the differences are just paperwork.',
        reason:
          'The application and the website are the customer’s own claims; the company documents are the record. A difference is a question to ask, not a verdict on the customer.',
      },
      dp3: {
        answer:
          'The customer’s explanation and how the related entities are connected: 2.5 of the 2.5 hours. Skip the update dates.',
        reason:
          'The rules let the customer explain the business activity and the countries in writing, so the explanation settles those. The entity links show who stands behind the 40%. The dates would only confirm timing the explanation already gives.',
      },
      dp4: {
        answer:
          'B: ask, through the account manager, for a corrected application naming Casey Lin and the online shop, and for Casey Lin’s proof of identity. Hand the Lin Family Trust to Compliance today, since no document shows who benefits from it. Tell Jordan what is needed and why, with no start date promised.',
        reason:
          'The trust is the one thing the rules keep from me; everything else I can settle. C costs the customer a day for differences already explained. A opens an account before every owner is identified.',
      },
    },
    goal: 'Open the account only on evidence, and send on what documents can’t show',
    success: ['Every difference explained, with its document on file', 'Compliance has the trust question the same day'],
    sort: {
      c1: 'needs-checking',
      c2: 'verified',
      c3: 'needs-checking',
      c4: 'verified',
      c5: 'needs-checking',
      c6: 'assumption',
    },
    requestIds: ['r2', 'r3'], // 1.5 + 1 = 2.5 of the 2.5 hours
  },
  // DRAFT: to be confirmed
  outcome:
    'The customer sent the corrected application and Casey Lin’s ID that afternoon. Compliance asked for the trust deed, which came on Thursday, and approved on Friday morning. The supplier invoice was paid that day.',
  // The example: Alex first wants to send everything to Compliance, reading every difference as a
  // warning sign. The dates and the customer's explanation settle the activity and the countries, so
  // they move to B. They skip the entity links, so they never learn about the trust and plan to approve
  // it themselves: the gap the review picks up. Everything in it is a DRAFT: to be confirmed.
  example: {
    juniorId: 'alex',
    initialPosition: {
      recommendation: 'C: hand the whole application to Compliance',
      reason: 'The application, the company documents and the website all say different things, so something may be wrong.',
      confidence: 'medium',
      question: 'Why does the application leave out Casey Lin?',
    },
    goal: 'Decide whether this customer can start tomorrow',
    success: ['A decision before tomorrow', 'Every difference written down'],
    people: ['Jordan Moreau', 'Casey Lin', 'Account manager', 'Compliance'],
    sort: {
      c1: 'needs-checking',
      c2: 'verified',
      c3: 'needs-checking',
      c4: 'verified',
      c5: 'verified',
      c6: 'assumption',
    },
    sortReasons: {
      c1: 'The share register says something different.',
      c2: 'From the company extract and share register.',
      c3: 'The website shows an online shop.',
      c4: 'I can see the shop on their website.',
      c5: 'It is on their own website.',
      c6: "The account manager's view; nobody has checked.",
    },
    missing: ['Why Casey Lin is not on the application', 'When each document was last updated'],
    requestedIds: ['r1', 'r2'], // 1 + 1.5 = 2.5 of the 2.5 hours
    requestIntents: {
      r1: 'Whether some differences are just old documents',
      r2: 'Why the customer’s own forms say different things',
    },
    decision: 'B',
    basedOn: ['Casey Lin came in February', 'Online shop since August', 'About page two years old'],
    why: 'The dates and the customer’s explanation account for all three differences. Casey Lin came in through Tallowood Holdings in February, the online shop opened in August, and the About page is two years old. Casey Lin’s 40% is in the share register, so she needs to be named and identified before I approve.',
    mainRisk: 'The customer may not send Casey Lin’s ID in time for Friday’s invoice',
    changeMind: 'If Casey Lin’s ID did not match the share register, I would hold the application',
    confidence: 'medium',
    submission: {
      conflicts:
        'Ownership: the application says Jordan Moreau owns 100%; the share register shows Moreau 60% and Casey Lin 40% through Tallowood Holdings. Activity: wholesale only on the application, an online shop on the website. Countries: Vietnam on the application, Vietnam and Thailand on the website.',
      'documents-needed': 'A corrected application naming Casey Lin and the online shop, and proof of identity for Casey Lin.',
      'why-needed':
        'Casey Lin owns 40%, so she must be named and identified. The corrected application brings the form in line with the share register and the website.',
      'hand-to': 'I can approve once the documents arrive. The account manager passes the request to the customer.',
      'customer-explanation':
        'The account manager tells Jordan today that we need two things before we can open the account, and that we will open it as soon as they arrive.',
    },
    whyChanged:
      'I started out wanting to send everything to Compliance, because every document said something different. The dates showed the About page was two years old and the ownership changed in February, and the customer’s explanation covered the online shop. Once each difference had a reason, sending it all on seemed too much.',
    // Stored without quote marks; the page adds them.
    note: 'I first read every difference as a warning sign. Most of them were an old web page and a new shop.',
  },
  // Sam's review of the example. Everything in it is a DRAFT: to be confirmed. The senior column
  // matches senior.goal, senior.sort, senior.requestIds and senior.decision.
  review: {
    managerId: 'sam',
    submittedWhen: 'today',
    minutes: 17,
    // In a row's text, ' → ' shows as the arrow icon (read as 'then').
    rows: [
      { label: 'Goal', junior: 'Decide on a start tomorrow', senior: 'Open only on evidence', match: 'differs' },
      { label: 'Evidence', junior: 'About page taken as current', senior: 'Website claims need checking', match: 'differs' },
      { label: 'Investigation', junior: 'Dates → explanation', senior: 'Explanation → entity links', match: 'differs' },
      { label: 'Decision', junior: 'B · Ask for missing documents', senior: 'B · Ask for missing documents', match: 'aligned' },
    ],
    blindSpots: ['Did not ask who stands behind Casey Lin’s 40%', 'Planned to approve without checking what goes to Compliance'],
    confirmQuestions: ['Should Alex have asked about the entity links before the dates?', 'Would you let Alex approve this once the ID arrives?'],
    feedbackDraft:
      'Good work finding a reason for each difference before judging the customer. Next time, ask who stands behind every owner before you decide the case is yours to approve.',
    nextFocus: ['escalation', 'evidence', 'collaboration'],
    nextFocusDefault: 'escalation',
    dimensions: [
      {
        id: 'goal',
        level: 'prompted',
        note: 'Alex framed the task around tomorrow’s start, but the final note keeps the date apart from the approval.',
        evidence: 'Goal: "Decide whether this customer can start tomorrow." Customer explanation: "…we need two things before we can open the account…"',
      },
      {
        id: 'evidence',
        level: 'prompted',
        note: 'Alex checked the application against the share register, but sorted the About page as verified until the dates showed it was two years old.',
        evidence: 'Sort reason: "It is on their own website." Why: "…the About page is two years old."',
      },
      {
        id: 'information',
        level: 'practice',
        note: 'The dates and the explanation were useful asks, but Alex never asked how the owners connect, so the trust behind the 40% stayed hidden.',
        evidence: 'Requests: update dates → customer’s explanation. Who handles it: "I can approve once the documents arrive."',
      },
      {
        id: 'tradeoffs',
        level: 'prompted',
        note: 'Weighed sending everything on against differences already explained, but the risk named is only about timing.',
        evidence: 'Main risk: "The customer may not send Casey Lin’s ID in time for Friday’s invoice."',
      },
      {
        id: 'updating',
        level: 'independent',
        note: 'Moved from sending everything to Compliance to asking for two documents, and said which facts moved them.',
        evidence: 'Why changed: "I started out wanting to send everything to Compliance, because every document said something different…"',
      },
    ],
    feedback: {
      strength: 'You found a reason for each difference before judging the customer, and asked only for the documents that close them.',
      improvement:
        'Ask who stands behind every owner before you decide an application is yours to approve. Casey Lin holds her 40% for a family trust, and no document shows who benefits.',
      followUp: 'If Casey Lin holds the shares for someone else, who decides, and what would you tell Jordan?',
    },
  },

  // Everything below is a DRAFT: to be confirmed, except where a comment says it comes from the source.
  goal: 'Work out why the application, the company documents and the website differ, ask for what is needed to decide, and hand on what you may not decide, with a traceable reason for each step.',
  limits: {
    deadline: 'The customer wants to start tomorrow, Thursday',
    unacceptable: 'Opening the account before every owner of 25% or more is identified, or promising the customer a start date',
    authority:
      'You may ask the customer for documents and approve once every difference is explained. Ownership or control that no document shows goes to Compliance.',
  },
  // The name and the five fields are the source's; the hints are drafted.
  submission: {
    name: 'Review & Escalation Note',
    fields: [
      { id: 'conflicts', label: 'Where the conflicts are', hint: 'Each difference, and where you found it' },
      { id: 'documents-needed', label: 'Documents needed', hint: 'What you will ask the customer for' },
      { id: 'why-needed', label: 'Why they are needed', hint: 'Which difference each document settles' },
      { id: 'hand-to', label: 'Who handles it', hint: 'Who decides what, under the review process' },
      { id: 'customer-explanation', label: 'How to explain it to the customer', hint: 'What the customer hears, and from whom' },
    ],
  },
  // From the source's three Team Lead observations: specific and necessary questions, a traceable
  // reason, escalation by the case's own authority rules; and its core conflict (urgency is no
  // substitute for evidence; a difference is not proof of a problem).
  // ifMentions matches at the start of a word, ignoring case.
  assessment: {
    criteria: [
      {
        id: 'date-not-evidence',
        label: 'Keeps the start date apart from the evidence',
        lookFor: 'Did they treat the customer’s date as something to manage and explain, not a reason to approve?',
        dimensionId: 'goal',
        // DRAFT: to be confirmed. Bare 'tomorrow', 'thursday', 'friday' and 'deadline' were dropped: they
        // also make a review date ("review on Friday"). Each phrase now speaks of the customer's start,
        // its urgency or the invoice behind it.
        ifMentions: [
          'start date',
          'start tomorrow',
          'starting tomorrow',
          'open tomorrow',
          'open the account tomorrow',
          'live tomorrow',
          'live by thursday',
          'start on thursday',
          'start thursday',
          'requested start',
          "customer's date",
          "customer's deadline",
          'go live',
          'go-live',
          'urgency',
          'invoice',
          'promise',
        ],
        // DRAFT: to be confirmed. Not the review time, nor the initial position, where the date is often the reason to approve.
        mentionsIn: [
          'why',
          'ownPlan',
          'conflicts',
          'documents-needed',
          'why-needed',
          'hand-to',
          'customer-explanation',
          'mainRisk',
          'owner',
          'changeMind',
        ],
        fields: ['customer-explanation'],
        met: 'You kept the customer’s date in view without letting it stand in for evidence.',
        notYet: 'The customer’s date is real. What does it change about what you need before the account opens, and what you tell them?',
      },
      {
        id: 'claims-vs-record',
        label: 'Checks the application against the company record',
        lookFor: 'Did they treat the application and the website as claims, and set them against the company documents?',
        dimensionId: 'evidence',
        // DRAFT: to be confirmed. The Examine sort reasons count by default ('The share register says something
        // different'); 'company record', 'self-declared' and 'self-reported' were added for them. The conflicts
        // field is still required.
        ifMentions: [
          'share register',
          'company documents',
          'company extract',
          'holding company',
          'holdings',
          'casey',
          '40%',
          'company record',
          'self-declared',
          'self-reported',
        ],
        fields: ['conflicts'],
        met: 'You set the customer’s own forms against the company record, and named each difference.',
        notYet: 'The application is the customer’s own account. What do the company documents show, and where do they differ?',
      },
      {
        id: 'traceable-reasons',
        label: 'Leaves a reason another analyst can trace',
        lookFor: 'Does each document asked for name the difference it settles, and the rule or record behind it?',
        dimensionId: 'evidence',
        ifMentions: ['rule', 'review process', 'share register', 'company documents', 'about page', 'website'],
        // DRAFT: to be confirmed. Only where documents are asked for and explained. In the conflicts, 'website' or 'share register' names
        // where a difference is (claims-vs-record), not why a document is needed.
        mentionsIn: ['why', 'ownPlan', 'documents-needed', 'why-needed', 'hand-to', 'customer-explanation'],
        fields: ['documents-needed', 'why-needed'],
        met: 'Each document you asked for is tied to the difference it settles.',
        notYet: 'Could someone else follow your note? Tie each document you ask for to the difference and the rule behind it.',
      },
      {
        id: 'who-stands-behind',
        label: 'Asks who stands behind each owner',
        lookFor: 'Did they ask how the owners connect, and find the 40% held for a trust nobody has documented?',
        dimensionId: 'information',
        requestIds: ['r3'],
        ifMentions: ['trust', 'beneficiar', 'who benefits', 'hold it for', 'holds it for', 'on behalf'],
        met: 'You asked who stands behind the 40%, the question that decides who may approve this.',
        notYet: 'Each owner on paper may hold their share for someone. Which question could change who decides this application?',
      },
      {
        id: 'sends-on-what-it-must',
        label: 'Keeps what it may decide, and sends on the rest',
        lookFor: 'Did they weigh a day’s wait at Compliance against what stays unproven, sending on only what the rules keep from them?',
        dimensionId: 'tradeoffs',
        // DRAFT: to be confirmed. r3 is required: only the entity links show what no document explains,
        // so without them a mention of Compliance can only be the first position or a guess.
        requestIds: ['r3'],
        ifMentions: ['compliance'],
        // DRAFT: to be confirmed. Not the initial position: 'send it all to Compliance' at the start is not weighing what must go on.
        mentionsIn: [
          'why',
          'ownPlan',
          'conflicts',
          'documents-needed',
          'why-needed',
          'hand-to',
          'customer-explanation',
          'mainRisk',
          'owner',
          'reviewBy',
          'changeMind',
        ],
        fields: ['hand-to'],
        met: 'Knowing who stands behind the company, you said what goes to Compliance and what stays with you.',
        notYet: 'Read the review process again: which parts may you settle, which must go on, and what does each cost the customer?',
      },
      {
        id: 'updates-on-new-facts',
        label: 'Updates the view on what the requests showed',
        lookFor: 'Faced with the dates, the explanation or the entity links, did they change or hold their first position for a stated reason?',
        dimensionId: 'updating',
        // Facts only a request reveals: the February change, the August shop and the two-year-old
        // About page (r1), the 15% and Thailand stopping (r2), the trust (r3). None is in m1–m4.
        // DRAFT: to be confirmed. Bare 'february' and 'august' became the phrases below, so a month in a
        // review date doesn't count.
        ifMentions: [
          'in february',
          'since february',
          'from february',
          'in august',
          'since august',
          'two years',
          '15%',
          'stopped buying',
          'out of date',
          'trustee',
          'family trust',
          'trust deed',
          'beneficiar',
          'who benefits',
        ],
        // DRAFT: to be confirmed. The final answer shows the update, not the initial position (written before the requests), the owner or
        // the review time.
        mentionsIn: [
          'why',
          'ownPlan',
          'conflicts',
          'documents-needed',
          'why-needed',
          'hand-to',
          'customer-explanation',
          'mainRisk',
          'changeMind',
        ],
        met: 'Your final answer uses what the requests showed, not only the first documents.',
        notYet: 'Compare your final answer with your first position: which new facts changed it, or why did none?',
      },
    ],
    commonMisses: [
      'Approves on the customer’s date because the customer is valuable.',
      'Reads every difference as proof the customer is hiding something.',
      'Takes the customer’s explanation of the ownership as enough, without the company documents.',
      'Never asks who stands behind an owner on paper.',
      'Promises the customer a start date.',
    ],
    acceptableAlternatives: [
      'C, handing the whole application to Compliance, if the analyst cannot get the customer’s explanation today, with a note of which differences are already explained.',
      'Asking for the trust deed at once alongside the corrected application, and handing it to Compliance with the deed attached.',
      'Escalating to a senior first, if the analyst is unsure which rule applies, with the differences and documents so far.',
    ],
    mustEscalate: [
      'Any owner of 25% or more whom no document identifies, or who holds a share for someone else: Compliance decides.',
      'Any request from Commercial to open the account before the review is complete.',
    ],
  },
  // The source's follow-up: after the customer submits a new document, which doubts disappear and
  // which remain? The document and its contents are drafted.
  variant: {
    title: 'The customer sends a corrected application',
    changedFact:
      'The customer sends a corrected application. It names Casey Lin as a 40% owner through Tallowood Holdings, ticks online retail, adds the name Tallowood Kitchen, and lists Vietnam as the only country paid. Nothing else is attached.',
    lookFor:
      'Whether the learner sees which doubts the new form settles (the owner list, the online shop, the trading name, the countries) and which remain: Casey Lin still has to show proof of identity, and no document yet shows who benefits from the Lin Family Trust, so that question stays with Compliance. The source’s question: which doubts disappear, and which remain?',
  },
}
