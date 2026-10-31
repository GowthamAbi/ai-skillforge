import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {
    'language.tamil':'Tamil', 'language.english':'English', 'language.label':'Language',
    'home.space':'PERSONAL LEARNING SPACE', 'home.choose':'CHOOSE YOUR JOURNEY',
    'home.headline':'One place.', 'home.headline2':'Five ways to grow.',
    'home.intro':'Continue your original roadmap, follow the AI Engineer path, study the complete AI syllabus, practise English speaking, or run your own AI research experiments.',
    'home.old.eyebrow':'01 · ORIGINAL EXPERIENCE', 'home.old.title':'Old SkillForge',
    'home.old.description':'Your existing 50-day roadmap, timetable, projects, progress and familiar sidebar — unchanged.',
    'home.old.action':'Open classic dashboard',
    'home.path.eyebrow':'02 · GUIDED AI LEARNING', 'home.path.title':'AI Engineer Path',
    'home.path.description':'Course lessons, learning links, quizzes, focus sessions, GitHub projects and career milestones.',
    'home.path.action':'Start learning',
    'home.english.eyebrow':'03 · SPEAK WITH CONFIDENCE', 'home.english.title':'English Speaking',
    'home.english.description':'Speaking practice, Tamil ↔ English, vocabulary, daily tests and weekly/monthly progress.',
    'home.english.action':'Open speaking coach',
    'home.roadmap.eyebrow':'04 · COMPLETE AI SYLLABUS', 'home.roadmap.title':'AI Roadmap',
    'home.roadmap.description':'All 7 syllabus phases, nested topics, Tamil-guided lessons and topic-by-topic progress tracking.',
    'home.roadmap.action':'Open full roadmap',
    'home.research.eyebrow':'05 · EXPERIMENT AND DISCOVER', 'home.research.title':'AI Research Lab',
    'home.research.description':'Plan AI experiments, record hypotheses, compare approaches, and document your findings.',
    'home.research.action':'Open research lab',
    'home.footer':'Built for your AI Engineer journey · 5 learning spaces',
    'switch.mode':'Switch dashboard'
  },
  ta: {
    'language.tamil':'தமிழ்', 'language.english':'ஆங்கிலம்', 'language.label':'மொழி',
    'home.space':'உங்கள் தனிப்பட்ட கற்றல் தளம்', 'home.choose':'உங்கள் கற்றல் பயணத்தைத் தேர்ந்தெடுக்கவும்',
    'home.headline':'ஒரே தளம்.', 'home.headline2':'வளர்ச்சிக்கான ஐந்து வழிகள்.',
    'home.intro':'உங்கள் பழைய Roadmap-ஐத் தொடருங்கள், AI Engineer Path-ஐக் கற்றுக்கொள்ளுங்கள், முழு AI பாடத்திட்டத்தைப் படியுங்கள், ஆங்கிலப் பேச்சுப் பயிற்சி செய்யுங்கள் அல்லது AI Research செய்யுங்கள்.',
    'home.old.eyebrow':'01 · பழைய கற்றல் முறை', 'home.old.title':'பழைய SkillForge',
    'home.old.description':'உங்களுடைய 50 நாள் Roadmap, கால அட்டவணை, Projects, முன்னேற்றம் மற்றும் பழக்கமான Sidebar ஆகியவை மாற்றமின்றி இருக்கும்.',
    'home.old.action':'பழைய Dashboard திறக்கவும்',
    'home.path.eyebrow':'02 · வழிகாட்டப்பட்ட AI கற்றல்', 'home.path.title':'AI Engineer பாதை',
    'home.path.description':'பாடங்கள், கற்றல் இணைப்புகள், Quiz, கவனக் கற்றல் அமர்வுகள், GitHub Projects மற்றும் தொழில் இலக்குகள்.',
    'home.path.action':'கற்றலைத் தொடங்கவும்',
    'home.english.eyebrow':'03 · நம்பிக்கையுடன் பேசுங்கள்', 'home.english.title':'ஆங்கிலப் பேச்சுப் பயிற்சி',
    'home.english.description':'பேச்சுப் பயிற்சி, தமிழ் ↔ ஆங்கிலம், சொற்களஞ்சியம், தினசரி தேர்வுகள் மற்றும் வார / மாத முன்னேற்றம்.',
    'home.english.action':'பேச்சுப் பயிற்சியைத் திறக்கவும்',
    'home.roadmap.eyebrow':'04 · முழுமையான AI பாடத்திட்டம்', 'home.roadmap.title':'AI Roadmap',
    'home.roadmap.description':'7 பாடத்திட்ட நிலைகள், துணைத் தலைப்புகள், தமிழ் வழிகாட்டுதலுடன் பாடங்கள் மற்றும் ஒவ்வொரு தலைப்பின் முன்னேற்றம்.',
    'home.roadmap.action':'முழு Roadmap திறக்கவும்',
    'home.research.eyebrow':'05 · ஆராய்ந்து கண்டறியுங்கள்', 'home.research.title':'AI Research Lab',
    'home.research.description':'AI பரிசோதனைகளைத் திட்டமிட்டு, hypotheses மற்றும் முடிவுகளைப் பதிவு செய்யுங்கள்.',
    'home.research.action':'Research Lab திறக்கவும்',
    'home.footer':'உங்கள் AI Engineer பயணத்திற்கான 5 கற்றல் பிரிவுகள்',
    'switch.mode':'Dashboard மாற்றவும்'
  }
};


const uiPairs = [
  ['Dashboard','டாஷ்போர்டு'], ['Overview','மேலோட்டம்'], ['Home','முகப்பு'],
  ['Roadmap','கற்றல் திட்டம்'], ['50-Day Roadmap','50 நாள் கற்றல் திட்டம்'],
  ["Today's Timetable",'இன்றைய கால அட்டவணை'], ['Tasks','பணிகள்'],
  ['Analytics','பகுப்பாய்வு'], ['Progress','முன்னேற்றம்'], ['Settings','அமைப்புகள்'],
  ['Profile','சுயவிவரம்'], ['Logout','வெளியேறு'], ['Log out','வெளியேறு'],
  ['Save','சேமி'], ['Cancel','ரத்து செய்'], ['Close','மூடு'], ['Back','பின்னால்'],
  ['Next','அடுத்து'], ['Previous','முந்தையது'], ['Continue','தொடரவும்'],
  ['Start','தொடங்கு'], ['Start learning','கற்றலைத் தொடங்கு'], ['Start Learning','கற்றலைத் தொடங்கு'],
  ['Complete','நிறைவு செய்'], ['Completed','முடிக்கப்பட்டது'], ['Mark complete','முடிந்ததாகக் குறி'],
  ['Search','தேடு'], ['Search courses','பாடங்களைத் தேடு'], ['Filter','வடிகட்டு'],
  ['All','அனைத்தும்'], ['Today','இன்று'], ['Daily','தினசரி'], ['Weekly','வாரந்தோறும்'],
  ['Monthly','மாதந்தோறும்'], ['Day','நாள்'], ['Week','வாரம்'], ['Month','மாதம்'],
  ['Learning','கற்றல்'], ['Lessons','பாடங்கள்'], ['Lesson','பாடம்'], ['Practice','பயிற்சி'],
  ['Quiz','வினாடி வினா'], ['Take quiz','வினாடி வினாவைத் தொடங்கு'], ['Projects','திட்டப்பணிகள்'],
  ['Project','திட்டப்பணி'], ['Skills','திறன்கள்'], ['Skill progress','திறன் முன்னேற்றம்'],
  ['Your progress','உங்கள் முன்னேற்றம்'], ['Study time','படிப்பு நேரம்'], ['Study plan','படிப்புத் திட்டம்'],
  ['Daily tasks','தினசரி பணிகள்'], ['Daily goal','தினசரி இலக்கு'], ['Achievements','சாதனைகள்'],
  ['Certificates','சான்றிதழ்கள்'], ['Notifications','அறிவிப்புகள்'], ['Help','உதவி'],
  ['English Speaking','ஆங்கிலப் பேச்சுப் பயிற்சி'], ['AI Engineer Path','AI Engineer கற்றல் பாதை'],
  ['AI Roadmap','AI கற்றல் திட்டம்'], ['Old SkillForge','பழைய SkillForge'],
  ['Open full roadmap','முழு கற்றல் திட்டத்தைத் திற'], ['Switch dashboard','டாஷ்போர்டை மாற்று'],
  ['Welcome back','மீண்டும் வரவேற்கிறோம்'], ['Your learning journey','உங்கள் கற்றல் பயணம்'],
  ['Choose your journey','உங்கள் கற்றல் பயணத்தைத் தேர்ந்தெடுக்கவும்'],
  ['Start speaking','பேசத் தொடங்குங்கள்'], ['Speaking practice','பேச்சுப் பயிற்சி'],
  ['Vocabulary','சொற்களஞ்சியம்'], ['Grammar','இலக்கணம்'], ['Listening','கேட்டல் பயிற்சி'],
  ['Speaking','பேச்சுப் பயிற்சி'], ['Revision','மீள்பார்வை'], ['Feedback','கருத்து'],
  ['Loading...','ஏற்றப்படுகிறது...'], ['Loading','ஏற்றப்படுகிறது'], ['Try again','மீண்டும் முயற்சி செய்'],
  ['No data available','தரவு எதுவும் இல்லை'], ['View details','விவரங்களைக் காண்க'],
  ['Learn more','மேலும் அறிக'], ['Open','திற'], ['Edit','திருத்து'], ['Delete','நீக்கு'],
  ['Add','சேர்'], ['Create','உருவாக்கு'], ['Submit','சமர்ப்பி'], ['Refresh','புதுப்பி'],
  ['Tamil','தமிழ்'], ['English','ஆங்கிலம்'], ['Language','மொழி']
];
uiPairs.push(

  // Phrases used by the AI Roadmap lessons (the roadmap content is authored in Tamil).
  ['நிமிடங்கள்','minutes'], ['தமிழில்','in Tamil'], ['முதலில்','First'], ['பின்னர்','then'],
  ['உதாரணம்','Example'], ['இந்த topic-ஐ','this topic'], ['இந்த topic-ல்','in this topic'],
  ['சிறிய','small'], ['புரிந்துகொள்ளுங்கள்','understand'], ['புரிந்துகொண்டு','understand and'],
  ['முயற்சி செய்து','try'], ['மாற்றிப் பாருங்கள்','try changing it'], ['கற்றுக்கொள்ளுங்கள்','learn'],
  ['கணக்கிடுங்கள்','calculate'], ['கணக்கிடுதல்','calculation'], ['பாருங்கள்','see'], ['செய்யுங்கள்','do'],
  ['உங்கள்','your'], ['மற்றும்','and'], ['என்ன','what'], ['எப்படி','how'], ['எந்த','which'],
  ['எண்ண','number'], ['எண்ணிக்கை','quantity'], ['நேரம்','time'], ['முன்னேற்றம்','progress'],
  ['முடிக்கப்பட்டது','completed'], ['முடிக்கவும்','complete'], ['முடிக்க','to complete'],
  ['தலைப்புகள்','topics'], ['தலைப்பு','topic'], ['பாடம்','lesson'], ['பாடங்கள்','lessons'],
  ['கற்றல் நிலைகள்','learning stages'], ['நிலைகள் முடிந்தன','stages completed'],
  ['மொத்தம்','overall'], ['முடிந்தது','completed'], ['இன்னும்','still'],
  ['இன்றைய','today’s'], ['தினசரி','daily'], ['வார','weekly'], ['மாத','monthly'],
  ['சரிபார்க்கவும்','check'], ['மீண்டும் முயற்சிக்கவும்','try again'], ['வெளியீடு','output'],
  ['புரிந்துகொண்டு','understand'], ['எடுத்துக்கொண்டு','using'], ['எடுத்துக்காட்டுடன்','with an example'],
  ['எளிய','easy'], ['நடைமுறை','practical'], ['சிக்கலைத் தீர்க்கும்','problem-solving'],
  ['குறியீடு','code'], ['கற்றல்','learning'], ['பயிற்சி','practice'], ['மீள்பார்வை','revision'],
  ['வினாடி வினா','quiz'], ['மதிப்பீடு','assessment'], ['கருத்து','feedback'],
  ['இணைப்புகள்','links'], ['அடிப்படை','basics'], ['முக்கிய','important'],
  ['தொடங்கவும்','start'], ['தொடரவும்','continue'], ['திறக்கவும்','open'],
  ['சரியாக','correctly'], ['தவறுகள்','mistakes'], ['தவறு','mistake'],
  ['கேள்விகள்','questions'], ['பதில்கள்','answers'], ['பதில்','answer'],
  ['முயற்சி','attempt'], ['மாற்றம்','change'], ['மாதிரி','example'], ['விளக்குங்கள்','explain'],
  ['உள்ளீடு','input'], ['வெளியீடு','output'], ['நிரல்','program'], ['முடிவுகள்','results'],
  ['இந்த topic-ஐ முதலில் சிறிய input/output உதாரணத்துடன் புரிந்துகொண்டு, பின்னர் code-ஐ மாற்றிப் பாருங்கள்.','First understand this topic with a small input/output example, then try modifying the code.'],
  ['இந்த topic-ஐ உண்மையாகப் புரிந்துகொள்ள சிறந்த வழி எது?','What is the best way to truly understand this topic?'],
  ['இந்த topic-ல் சிறிய input/output உதாரணத்துடன் புரிந்துகொண்டு, பின்னர் code-ஐ மாற்றிப் பாருங்கள்.','Understand this topic with a small input/output example, then try modifying the code.'],

);
uiPairs.sort((a, b) => b[0].length - a[0].length);
const enToTa = new Map(uiPairs);
const taToEn = new Map(uiPairs.map(([en, ta]) => [ta, en]));
const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();

function translateDom(root, language) {
  if (!root) return;
  const dictionary = language === 'ta' ? enToTa : taToEn;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || parent.closest('script,style,noscript,textarea,code,pre,input,option')) continue;
    const original = originalTextNodes.has(node) ? originalTextNodes.get(node) : node.nodeValue;
    originalTextNodes.set(node, original);
    const trimmed = original.trim();
    if (!trimmed) continue;
    let next = original;
    if (language === 'ta') {
      const exact = enToTa.get(trimmed);
      if (exact) next = original.replace(trimmed, exact);
    } else {
      const exact = taToEn.get(trimmed);
      if (exact) next = original.replace(trimmed, exact);
      else {
        // Translate known Tamil phrases inside mixed Tamil/English text nodes too.
        for (const [tamil, english] of uiPairs) {
          if (/[\\u0B80-\\u0BFF]/.test(tamil) && next.includes(tamil)) next = next.split(tamil).join(english);
        }
      }
    }
    if (node.nodeValue !== next) node.nodeValue = next;
  }
  root.querySelectorAll('[placeholder],[aria-label],[title]').forEach((el) => {
    ['placeholder','aria-label','title'].forEach((attr) => {
      if (!el.hasAttribute(attr)) return;
      let values = originalAttributes.get(el);
      if (!values) { values = {}; originalAttributes.set(el, values); }
      if (!(attr in values)) values[attr] = el.getAttribute(attr);
      const original = values[attr];
      const translated = (dictionary.get(original) || original).replace(/[\u0B80-\u0BFF]/g, '').trim();
      if (el.getAttribute(attr) !== translated) el.setAttribute(attr, translated);
    });
  });
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return 'en';
  });

  const setLanguage = () => setLanguageState('en');

  useEffect(() => {
    try { localStorage.setItem('ai-skillforge-language', 'en'); } catch {}
    document.documentElement.lang = 'en';
    let queued = false;
    const run = () => {
      queued = false;
      translateDom(document.body, 'en');
    };
    run();
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      queueMicrotask(run);
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key) => translations[language][key] ?? key
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider');
  return value;
}
