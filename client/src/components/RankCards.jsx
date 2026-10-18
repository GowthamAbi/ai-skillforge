import { useEffect, useState } from 'react';
import { Award, CheckCircle2, Download, Flame, ImageDown, Mail, Share2, Sparkles, Trophy } from 'lucide-react';
import { api } from '../api/api';

const formatDate = date => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });

function rounded(context, x, y, width, height, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}

function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (context.measureText(`${line} ${word}`.trim()).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  for (const [index, value] of lines.slice(0, maxLines).entries()) {
    let valueToDraw = value;
    if (index === maxLines - 1 && lines.length > maxLines) {
      while (context.measureText(`${valueToDraw}…`).width > maxWidth && valueToDraw.length) valueToDraw = valueToDraw.slice(0, -1);
      valueToDraw += '…';
    }
    context.fillText(valueToDraw, x, y + index * lineHeight);
  }
  return Math.min(lines.length, maxLines);
}

function drawPngCard(report) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1320;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Image export is not supported in this browser');

  const background = context.createLinearGradient(0, 0, 1080, 1320);
  background.addColorStop(0, '#0b1431');
  background.addColorStop(.65, '#20195a');
  background.addColorStop(1, '#101633');
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1320);
  for (let i = 0; i < 35; i++) {
    const x = (i * 191 + 107) % 1080;
    const y = (i * 307 + 93) % 1320;
    context.globalAlpha = .22 + (i % 3) * .1;
    context.fillStyle = i % 2 ? '#86efac' : '#a5b4fc';
    context.fillRect(x, y, 5 + i % 4, 5 + i % 4);
  }
  context.globalAlpha = 1;
  rounded(context, 52, 56, 976, 1208, 40, '#151d43');
  const header = context.createLinearGradient(52, 56, 1028, 480);
  header.addColorStop(0, '#6254e8');
  header.addColorStop(1, '#352788');
  rounded(context, 52, 56, 976, 445, 40, header);

  context.textAlign = 'left';
  context.fillStyle = '#c8d6ff';
  context.font = 'bold 25px Arial, sans-serif';
  context.fillText('✦  AI SKILLFORGE  /  DAILY QUEST', 110, 135);
  context.font = 'bold 52px Arial, sans-serif';
  context.fillStyle = '#fff';
  context.fillText(`DAY ${String(report.day).padStart(2, '0')} COMPLETE`, 110, 236);
  context.font = 'bold 90px Arial, sans-serif';
  context.fillStyle = '#fef08a';
  context.fillText(`${report.rank} RANK`, 110, 345);
  context.font = 'bold 30px Arial, sans-serif';
  context.fillStyle = '#c7ffd9';
  context.fillText(`+${report.xp} XP EARNED     •     ${report.streak}-DAY STREAK`, 110, 417);

  const cards = [
    [`${report.studyMinutes}/240`, 'FOCUS MIN'],
    [`${report.watched}/${report.totalVideos}`, 'VIDEOS'],
    [`${report.quizzesPassed}/${report.totalQuizzes}`, 'QUIZZES']
  ];
  cards.forEach(([value, label], index) => {
    const x = 93 + index * 305;
    rounded(context, x, 535, 285, 146, 23, '#252f59');
    context.fillStyle = '#fff';
    context.font = 'bold 46px Arial, sans-serif';
    context.fillText(value, x + 23, 593);
    context.fillStyle = '#adbbdb';
    context.font = 'bold 21px Arial, sans-serif';
    context.fillText(label, x + 23, 641);
  });

  context.fillStyle = '#c4c7ff';
  context.font = 'bold 23px Arial, sans-serif';
  context.fillText(`${formatDate(report.completedAt)}   •   MASTERY ${report.quizAccuracy === null ? 'N/A' : `${report.quizAccuracy}%`}`, 105, 746);
  context.fillStyle = '#fff';
  context.font = 'bold 35px Arial, sans-serif';
  wrapText(context, report.topic, 105, 813, 862, 46, 2);

  context.fillStyle = '#aab8de';
  context.font = 'bold 22px Arial, sans-serif';
  context.fillText('TODAY’S COMPLETED LEARNING', 105, 914);
  const entries = report.lessons.slice(0, 3);
  context.font = '24px Arial, sans-serif';
  context.fillStyle = '#e2e9ff';
  if (!entries.length) context.fillText('✓  Capstone / hands-on practice day', 110, 971);
  entries.forEach((item, index) => {
    const title = `${index + 1}. ${item.title}`;
    let fitted = title;
    while (context.measureText(fitted).width > 850 && fitted.length) fitted = fitted.slice(0, -1);
    context.fillText(`${fitted}${fitted.length < title.length ? '…' : ''}`, 110, 964 + index * 42);
  });
  if (report.lessons.length > 3) {
    context.fillStyle = '#a5b4fc';
    context.fillText(`+ ${report.lessons.length - 3} more completed videos`, 110, 1099);
  }
  context.fillStyle = '#86efac';
  context.font = 'bold 23px Arial, sans-serif';
  wrapText(context, report.motivation, 105, 1165, 855, 29, 2);
  context.fillStyle = '#8192c4';
  context.font = '20px Arial, sans-serif';
  context.fillText('Tracked in SkillForge · Self-marked Udemy viewing · skillforge', 105, 1233);
  return canvas;
}

const imageFilename = report => `SkillForge-Day-${String(report.day).padStart(2, '0')}-Rank-${report.rank.replace(/[^a-z0-9+]/gi, '-')}.png`;

async function pngFile(report) {
  const canvas = drawPngCard(report);
  const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Could not create image')), 'image/png'));
  return new File([blob], imageFilename(report), { type: 'image/png' });
}

function RankCard({ report, onDownload, onShare, busy }) {
  return <div className="min-w-0 space-y-4">
    <div className="relative isolate min-w-0 overflow-hidden rounded-[24px] border border-indigo-300/20 bg-[#11183a] p-4 text-white shadow-[0_20px_65px_rgba(42,38,116,.2)] sm:rounded-[30px] sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-violet-500/45 blur-[90px]"/>
      <div className="pointer-events-none absolute -bottom-36 -left-20 -z-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[90px]"/>
      <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs font-extrabold tracking-[.23em] text-indigo-200"><Sparkles size={15} className="mr-2 inline"/>AI SKILLFORGE · DAILY QUEST</span><span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">{formatDate(report.completedAt)}</span></div>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-3 sm:mt-9"><div className="min-w-0"><p className="text-sm font-black uppercase tracking-[.12em] text-indigo-200 sm:text-lg sm:tracking-[.16em]">Day {String(report.day).padStart(2,'0')} complete</p><p className="mt-2 bg-gradient-to-r from-yellow-200 to-amber-400 bg-clip-text text-5xl font-black text-transparent sm:text-7xl">{report.rank}<span className="ml-2 text-xl tracking-wider sm:ml-3 sm:text-2xl">RANK</span></p></div><div className="rounded-2xl border border-amber-200/25 bg-amber-300/10 px-4 py-3 text-right sm:px-5"><Trophy className="ml-auto text-yellow-300" size={29}/><p className="mt-2 text-xl font-black text-yellow-200 sm:text-2xl">+{report.xp} XP</p></div></div>
      <p className="mt-7 text-sm font-semibold leading-6 text-indigo-100">{report.topic}</p>
      <div className="mt-7 grid grid-cols-1 gap-2 min-[375px]:grid-cols-3 sm:gap-3">{[[`${report.studyMinutes}/240`,'Focus min'],[`${report.watched}/${report.totalVideos}`,'Videos'],[`${report.quizzesPassed}/${report.totalQuizzes}`,'Quizzes']].map(([value,label])=><div key={label} className="min-w-0 rounded-2xl border border-white/10 bg-white/10 p-2 text-center sm:p-4"><p className="text-lg font-black sm:text-2xl">{value}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-200 sm:text-xs">{label}</p></div>)}</div>
      <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-orange-500/20 px-3 py-1.5 text-xs font-bold text-orange-200"><Flame size={13} className="mr-1 inline"/>{report.streak}-day streak</span>{report.quizAccuracy !== null && <span className="rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-200">{report.quizAccuracy}% mastery</span>}{report.badges.map(badge=><span key={badge.label} className="rounded-full bg-indigo-300/20 px-3 py-1.5 text-xs font-bold text-indigo-100">{badge.icon} {badge.label}</span>)}</div>
      <div className="mt-7 border-t border-white/10 pt-5"><p className="text-xs font-extrabold uppercase tracking-[.17em] text-indigo-300">Completed lectures</p><div className="mt-3 space-y-2">{report.lessons.length ? report.lessons.slice(0,4).map((item,index)=><p key={index} className="flex items-start gap-2 text-xs leading-5 text-slate-200"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400"/><span className="min-w-0 flex-1">{item.title}</span><span className="shrink-0 font-bold text-indigo-200">{item.quizScore}%</span></p>) : <p className="text-sm text-slate-200">Capstone and hands-on practice day</p>}{report.lessons.length>4 && <p className="text-xs text-indigo-300">+{report.lessons.length-4} more videos</p>}</div></div>
      {report.module && <p className="mt-4 rounded-xl bg-white/5 p-3 text-xs text-indigo-100">Module: {report.module.title} · Test {report.module.testScore ?? '—'}% · Project {report.module.projectSubmitted?'submitted':'pending'}</p>}
      <p className="mt-5 font-bold text-emerald-200">{report.motivation}</p>
      <p className="mt-5 text-[10px] text-indigo-300">Based on recorded SkillForge activity and self-marked video watching. Not an accredited score.</p>
    </div>
    <div className="flex flex-wrap gap-3"><button disabled={busy} onClick={()=>onDownload(report)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50 sm:w-auto"><ImageDown size={17}/>Download PNG</button><button disabled={busy} onClick={()=>onShare(report)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50 sm:w-auto"><Share2 size={17}/>Share card</button></div>
  </div>;
}

export default function RankCards({ latestEmailStatus }) {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState(null);
  const [configured, setConfigured] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    api('/path/rank-cards').then(result => {
      if (!active) return;
      setCards(result.cards); setConfigured(result.emailConfigured);
      setSelected(previous => result.cards.some(card => card.day === previous) ? previous : result.cards[0]?.day || null);
    }).catch(error => active && setError(error.message));
    return () => { active = false; };
  }, []);
  const card = cards.find(item => item.day === selected);
  const download = async report => {
    setBusy(true);setNotice('');
    try {
      const file = await pngFile(report);
      const url = URL.createObjectURL(file);
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = file.name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setNotice('PNG downloaded. Share it on WhatsApp, Instagram or wherever you like!');
    } catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  };
  const share = async report => {
    setBusy(true);setNotice('');
    try {
      const file = await pngFile(report);
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: `SkillForge Day ${report.day} Rank Card` });
      } else {
        await download(report);
        setNotice('Brave does not support file sharing here. Your PNG was downloaded instead.');
      }
    } catch (error) { if (error.name !== 'AbortError') setNotice(error.message); }
    finally { setBusy(false); }
  };
  return <div className="space-y-5">
    <div className="rounded-3xl bg-gradient-to-r from-[#31257b] via-[#5b43cf] to-[#2678b9] p-6 text-white sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-extrabold tracking-[.2em] text-indigo-200">REWARD VAULT</p><h3 className="mt-2 text-3xl font-black">Your Daily Rank Cards 🏆</h3><p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">Finish your 4-hour mission, earn XP and collect a shareable card after every study day.</p></div><Award size={67} className="text-amber-200"/></div></div>
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-xs text-indigo-800"><Mail size={19}/><span>{!configured?'Automatic rank-card email is not yet configured on Render. PNG download works now.':latestEmailStatus==='sent'?'Your latest completed day card was emailed!':latestEmailStatus==='failed'?'The last email failed; check Render mail settings. Your card is still saved.':'Emails send automatically when you finish a study day.'}</span></div>
    {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
    {!cards.length && !error ? <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center"><Trophy className="mx-auto text-indigo-400" size={56}/><h4 className="mt-4 text-xl font-extrabold">Your first rank card is waiting!</h4><p className="mt-2 text-sm text-slate-500">Complete Day 1: study 240 minutes, watch the lessons and pass your quizzes. Your card will appear here.</p></div> : <div className="grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)]"><div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4"><p className="mb-3 text-sm font-extrabold">Your collection ({cards.length})</p>{cards.map(item=><button key={item.day} onClick={()=>setSelected(item.day)} className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-3 text-left text-sm ${item.day===selected?'bg-indigo-100 font-extrabold text-indigo-800':'text-slate-600 hover:bg-slate-50'}`}><span>Day {item.day} · {item.rank} Rank</span><span className="text-xs">+{item.xp} XP</span></button>)}</div>{card && <RankCard report={card} onDownload={download} onShare={share} busy={busy}/>}</div>}
    {notice && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800"><Download size={15} className="mr-1 inline"/>{notice}</p>}
  </div>;
}
