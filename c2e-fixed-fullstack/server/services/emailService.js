const nodemailer = require('nodemailer');
const {
  smtpHost,
  smtpPort,
  smtpSecure,
  smtpUser,
  smtpPass,
  emailFrom,
  notifyEmail,
  gmailUser,
  gmailAppPass,
  trainerNotifyEmail,
} = require('../config/env');

function stripSpaces(str) {
  return String(str || '').replace(/\s/g, '');
}

function createTransporter(config) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: stripSpaces(config.pass),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
}

function getSmtpTransporter() {
  if (!smtpHost || !smtpUser || !smtpPass) return null;
  return createTransporter({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    user: smtpUser,
    pass: smtpPass,
  });
}

function getGmailTransporter() {
  if (!gmailUser || !gmailAppPass) return null;
  return createTransporter({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user: gmailUser,
    pass: gmailAppPass,
  });
}

function escapeHtml(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderRows(fields) {
  return fields
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;font-weight:600;color:#334151;border-bottom:1px solid #e2e8f0;white-space:nowrap;min-width:140px;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');
}

function wrapNotificationEmail(heading, intro, fields, footer) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;">
      <div style="background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
        <h2 style="color:#1d4ed8;margin:0 0 8px 0;font-size:22px;">${escapeHtml(heading)}</h2>
        <p style="color:#475569;margin:0 0 16px 0;font-size:15px;">${escapeHtml(intro)}</p>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          ${renderRows(fields)}
        </table>
        ${footer ? `<p style="color:#64748b;margin-top:16px;font-size:13px;">${escapeHtml(footer)}</p>` : ''}
      </div>
    </div>`;
}

function wrapAcknowledgementEmail(heading, body, contactInfo) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;">
      <div style="background:#ffffff;border-radius:12px;padding:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
        <h2 style="color:#1d4ed8;margin:0 0 16px 0;font-size:22px;">${escapeHtml(heading)}</h2>
        <p style="color:#334159;margin:0 0 12px 0;font-size:15px;line-height:1.6;">${escapeHtml(body).replace(/\\n/g, '<br/>')}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
        <p style="color:#475569;margin:0;font-size:13px;">${escapeHtml(contactInfo).replace(/\\n/g, '<br/>')}</p>
      </div>
    </div>`;
}

let smtpTransporter = null;
let gmailTransporter = null;

function getSmtp() {
  if (!smtpTransporter) {
    smtpTransporter = getSmtpTransporter();
  }
  return smtpTransporter;
}

function getGmail() {
  if (!gmailTransporter) {
    gmailTransporter = getGmailTransporter();
  }
  return gmailTransporter;
}

function isSmtpConfigured() {
  return !!(smtpHost && smtpUser && smtpPass);
}

function isGmailConfigured() {
  return !!(gmailUser && gmailAppPass);
}

function getNotificationEmail() {
  return notifyEmail || smtpUser || '';
}

function getTrainerNotifyEmail() {
  return trainerNotifyEmail || gmailUser || smtpUser || '';
}

function getFromEmail() {
  return emailFrom || smtpUser || gmailUser || '';
}

async function sendMail(transporter, mailOptions) {
  if (!transporter) {
    console.warn('[emailService] No transporter available — email skipped.');
    return { sent: false, skipped: true };
  }
  try {
    await transporter.sendMail(mailOptions);
    console.log('[emailService] Email sent:', mailOptions.subject);
    return { sent: true };
  } catch (err) {
    const msg = err.message || '';
    if (/auth|535|invalid credentials/i.test(msg)) {
      console.error('[emailService] Authentication failed — verify credentials.');
    } else if (/connect|econn|etimedout|enotfound|timeout/i.test(msg)) {
      console.error('[emailService] SMTP/Gmail connection failed:', msg);
    } else {
      console.error('[emailService] Failed to send email:', msg);
    }
    return { sent: false, error: msg };
  }
}

async function sendContactNotification(contact) {
  const t = getSmtp() || getGmail();
  if (!t) {
    console.warn('[emailService] SMTP/Gmail not configured — skipping contact notification.');
    return { sent: false, skipped: true };
  }
  const recipient = getNotificationEmail() || getTrainerNotifyEmail();
  if (!recipient) {
    console.warn('[emailService] No notification email configured — skipping.');
    return { sent: false, skipped: true };
  }
  return sendMail(t, {
    from: getFromEmail(),
    to: recipient,
    subject: `Connect2EdTech — New Contact Request: ${contact.name}`,
    html: wrapNotificationEmail(
      'New Contact Request',
      'A new message has been received via the Connect2EdTech website contact form.',
      [
        ['Name', contact.name],
        ['Email', contact.email],
        ['Phone', contact.phone],
        ['Interested Course', contact.interestedCourse],
        ['Message', contact.message],
        ['Submitted', contact.createdDate ? new Date(contact.createdDate).toLocaleString() : new Date().toLocaleString()],
      ]
    ),
  });
}

async function sendEnrollmentNotification(enrollment) {
  const t = getSmtp() || getGmail();
  if (!t) {
    console.warn('[emailService] SMTP/Gmail not configured — skipping enrollment notification.');
    return { sent: false, skipped: true };
  }
  const recipient = getNotificationEmail() || getTrainerNotifyEmail();
  if (!recipient) {
    console.warn('[emailService] No notification email configured — skipping.');
    return { sent: false, skipped: true };
  }
  return sendMail(t, {
    from: getFromEmail(),
    to: recipient,
    subject: `Connect2EdTech — New Enrollment: ${enrollment.courseTitle} (${enrollment.fullName})`,
    html: wrapNotificationEmail(
      'New Course Enrollment',
      `${enrollment.fullName} has enrolled in a course.`,
      [
        ['Full Name', enrollment.fullName],
        ['Email', enrollment.email],
        ['Phone', enrollment.phone],
        ['Course', enrollment.courseTitle],
        ['City', enrollment.city],
        ['State', enrollment.state],
        ['Message', enrollment.message],
        ['Submitted', enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleString() : new Date().toLocaleString()],
      ]
    ),
  });
}

async function sendTrainerApplicationNotification(application) {
  const t = getGmail();
  if (!t) {
    console.warn('[emailService] Gmail not configured — skipping trainer notification.');
    return { sent: false, skipped: true };
  }
  const recipient = getTrainerNotifyEmail();
  if (!recipient) {
    console.warn('[emailService] No trainer notification email configured — skipping.');
    return { sent: false, skipped: true };
  }

  const expertiseStr = Array.isArray(application.expertise)
    ? application.expertise.join(', ')
    : application.expertise || '';

  return sendMail(t, {
    from: `"Connect2EdTech Website" <${getFromEmail()}>`,
    to: recipient,
    subject: `New Become a Trainer Application - Connect2EdTech`,
    html: wrapNotificationEmail(
      'New Become a Trainer Application',
      `${application.fullName} has submitted a trainer application via the Connect2EdTech website.`,
      [
        ['Full Name', application.fullName],
        ['Email', application.email],
        ['Phone', application.phone],
        ['Skills / Expertise', expertiseStr],
        ['Experience (Years)', application.yearsOfExperience],
        ['Qualification', application.qualification],
        ['About / Message', application.about],
        ['Submitted', application.createdAt ? new Date(application.createdAt).toLocaleString() : new Date().toLocaleString()],
      ]
    ),
  });
}

async function sendTrainerAcknowledgement(application) {
  const t = getGmail();
  if (!t) {
    console.warn('[emailService] Gmail not configured — skipping trainer acknowledgement.');
    return { sent: false, skipped: true };
  }
  if (!application.email) {
    console.warn('[emailService] No applicant email — skipping trainer acknowledgement.');
    return { sent: false, skipped: true };
  }

  const name = application.fullName || 'there';
  const body = `Dear ${name},\n\nThank you for your interest in joining Connect2EdTech as a Trainer. We have received your application and our team will review it shortly.\n\nWhat happens next:\n• Our recruitment team will evaluate your profile.\n• If shortlisted, we will reach out to schedule a brief interview.\n• You will receive an email with the next steps.\n\nWe look forward to potentially having you on board!\n\nBest regards,\nThe Connect2EdTech Team`;

  const contactInfo = `Connect2EdTech\nEmail: ${gmailUser || smtpUser || 'support@connect2edtech.com'}\nPhone: +91 7019436720`;

  return sendMail(t, {
    from: `"Connect2EdTech Team" <${getFromEmail()}>`,
    to: application.email,
    subject: 'Thank you for your trainer application - Connect2EdTech',
    html: wrapAcknowledgementEmail(
      'Thank you for your application!',
      body,
      contactInfo
    ),
  });
}

function validateGmailConfig() {
  const configured = isGmailConfigured();
  if (configured) {
    console.log('Gmail configuration: configured');
  } else {
    console.warn('Gmail configuration: missing required environment variables (GMAIL_USER / GMAIL_APP_PASSWORD)');
  }
  return configured;
}

module.exports = {
  sendMail,
  sendContactNotification,
  sendEnrollmentNotification,
  sendTrainerApplicationNotification,
  sendTrainerAcknowledgement,
  getSmtpTransporter,
  getGmailTransporter,
  isSmtpConfigured,
  isGmailConfigured,
  getNotificationEmail,
  getTrainerNotifyEmail,
  getFromEmail,
  validateGmailConfig,
  escapeHtml,
  wrapNotificationEmail,
  wrapAcknowledgementEmail,
};
