import nodemailer from 'nodemailer';

const esc = input => String(input ?? '').replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function reportEmailConfigured() {
  return Boolean(process.env.STUDY_EMAIL && (
    (process.env.RESEND_API_KEY && process.env.REPORT_FROM_EMAIL) ||
    (process.env.EMAIL_USER && process.env.EMAIL_PASS)
  ));
}

export function rankCardEmailHtml(report) {
  const videoRows = report.lessons.map(lesson => `<li style="padding:8px 0;border-bottom:1px solid #e9ecf5">✅ ${esc(lesson.title)} <span style="color:#5655ae">· quiz ${lesson.quizScore}%</span></li>`).join('');
  return `<div style="background:#f1f4ff;padding:28px 12px;font-family:Arial,sans-serif;color:#14213d">
    <div style="max-width:580px;margin:auto;border-radius:22px;background:#fff;overflow:hidden;border:1px solid #e5e7f1">
      <div style="padding:28px;background:linear-gradient(135deg,#111c49,#5845cf);color:#fff">
        <p style="font-size:12px;letter-spacing:2px;margin:0">AI SKILLFORGE · DAILY RANK CARD</p>
        <h1 style="font-size:36px;margin:18px 0 4px">DAY ${report.day} · ${esc(report.rank)} RANK</h1>
        <p style="margin:0;color:#c9cbff;font-size:16px">${esc(report.topic)}</p>
        <p style="font-size:22px;margin:20px 0 0">⚡ +${report.xp} XP earned</p>
      </div>
      <div style="padding:28px">
        <table role="presentation" style="width:100%;text-align:center;table-layout:fixed"><tr>
          <td><strong style="font-size:22px">${report.studyMinutes}/240</strong><br><small>Focus minutes</small></td>
          <td><strong style="font-size:22px">${report.watched}/${report.totalVideos}</strong><br><small>Videos watched</small></td>
          <td><strong style="font-size:22px">${report.quizzesPassed}/${report.totalQuizzes}</strong><br><small>Quizzes passed</small></td>
        </tr></table>
        <p style="background:#f5f3ff;border-radius:12px;padding:14px;font-size:14px">🔥 ${report.streak}-day streak &nbsp; · &nbsp; Quiz mastery: ${report.quizAccuracy === null ? 'N/A' : `${report.quizAccuracy}%`}</p>
        ${report.module ? `<p style="font-size:14px"><b>Module checkpoint:</b> ${esc(report.module.title)} · Test: ${report.module.testScore ?? '—'}% · Project: ${report.module.projectSubmitted ? 'Submitted' : 'Not submitted'}</p>` : ''}
        <h2 style="font-size:17px;margin-top:25px">Today's completed lectures</h2>
        <ul style="list-style:none;margin:0;padding:0;font-size:13px">${videoRows || '<li>Capstone and hands-on study day</li>'}</ul>
        <p style="margin-top:25px;color:#504a99;font-weight:600">${esc(report.motivation)}</p>
        <p style="font-size:11px;color:#737b92">Scores are based on your SkillForge-recorded self-marked viewing, quiz results and focus timer. Not an accredited qualification.</p>
        <p style="font-size:12px"><a style="color:#514bc5" href="https://aitraning.netlify.app/#/path">Open your SkillForge and download/share the PNG rank card</a></p>
      </div>
    </div>
  </div>`;
}

// Called exactly once by the successful day-completion flow; no open mail relay.
export async function emailRankCard(report) {
  if (!reportEmailConfigured()) return 'not_configured';
  const subject = `🏆 Day ${report.day} unlocked — ${report.rank} Rank · +${report.xp} XP | AI SkillForge`;
  const text = `AI SkillForge · Day ${report.day} complete!\nRank: ${report.rank}\nXP: +${report.xp}\nFocus: ${report.studyMinutes}/240 minutes\nVideos: ${report.watched}/${report.totalVideos}\nQuizzes: ${report.quizzesPassed}/${report.totalQuizzes}\nStreak: ${report.streak} days\n\n${report.motivation}\n\nOpen https://aitraning.netlify.app/#/path to download the image card.`;

  // Render Free blocks SMTP outbound ports. Prefer HTTPS delivery on the free plan.
  if (process.env.RESEND_API_KEY && process.env.REPORT_FROM_EMAIL) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: process.env.REPORT_FROM_EMAIL,
        to: [process.env.STUDY_EMAIL],
        subject,
        html: rankCardEmailHtml(report),
        text
      }),
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(`Email API rejected request (${response.status}): ${body.message || 'check verified sender and recipient'}`);
    }
    return 'sent';
  }

  // Retained for users on hosting plans that permit Gmail SMTP connections.
  const tx = nodemailer.createTransport({
    service: 'gmail',
    connectionTimeout: 10000,
    socketTimeout: 12000,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await tx.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.STUDY_EMAIL,
    subject,
    html: rankCardEmailHtml(report),
    text
  });
  return 'sent';
}
