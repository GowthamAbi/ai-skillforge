import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {
    'language.tamil':'Tamil', 'language.english':'English', 'language.label':'Language',
    'home.space':'PERSONAL LEARNING SPACE', 'home.choose':'CHOOSE YOUR JOURNEY',
    'home.headline':'One place.', 'home.headline2':'Four ways to grow.',
    'home.intro':'Continue your existing roadmap, explore the AI Engineer path, learn the full AI syllabus topic-by-topic, or practise English speaking.',
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
    'home.footer':'Built for your AI Engineer journey · 4 hours a day',
    'switch.mode':'Switch dashboard'
  },
  ta: {
    'language.tamil':'தமிழ்', 'language.english':'ஆங்கிலம்', 'language.label':'மொழி',
    'home.space':'உங்கள் தனிப்பட்ட கற்றல் தளம்', 'home.choose':'உங்கள் கற்றல் பயணத்தைத் தேர்ந்தெடுக்கவும்',
    'home.headline':'ஒரே தளம்.', 'home.headline2':'வளர்ச்சிக்கான நான்கு வழிகள்.',
    'home.intro':'உங்கள் தற்போதைய Roadmap-ஐத் தொடருங்கள், AI Engineer Path-ஐக் கற்றுக்கொள்ளுங்கள், முழு AI பாடத்திட்டத்தைப் படியுங்கள் அல்லது ஆங்கிலப் பேச்சுப் பயிற்சி செய்யுங்கள்.',
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
    'home.footer':'உங்கள் AI Engineer பயணத்திற்காக உருவாக்கப்பட்டது · தினமும் 4 மணி நேரம்',
    'switch.mode':'Dashboard மாற்றவும்'
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('ai-skillforge-language') === 'en' ? 'en' : 'ta'; }
    catch { return 'ta'; }
  });

  useEffect(() => {
    try { localStorage.setItem('ai-skillforge-language', language); } catch {}
    document.documentElement.lang = language === 'ta' ? 'ta' : 'en';
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
