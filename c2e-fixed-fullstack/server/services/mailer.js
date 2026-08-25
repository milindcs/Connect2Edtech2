const nodemailer = require('nodemailer');
const {
  smtpHost,
  smtpPort,
  smtpSecure,
  smtpUser,
  smtpPass,
  emailFrom,
  notifyEmail,
} = require('../config/env');

let transporter = null;

// Only build a transporter if SMTP has actually been configured. This lets
// the app keep running in environments (like local dev) where no mail
// credentials are set — emails are simply skipped with a console warning
// instead of crashing the server.
function getTransporter() {
  if (!smtpHost || !smtpUser || !smtpPass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // true for 465, false for other ports (STARTTLS)
      auth: { user: smtpUser, pass: smtpPass.replace(/\s/g, '') },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });
  }

  return transporter;
}

// Escapes user-supplied text before it's dropped into an HTML email body.
function escapeHtml(value) {
  return String(value ?? '')
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
          <td style="padding:8px 12px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;white-space:nowrap;">${escapeHtml(
            label
          )}</td>
          <td style="padding:8px 12px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${escapeHtml(
            value
          )}</td>
        </tr>`
    )
    .join('');
}

function wrapEmail(heading, fields) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="color:#1d4ed8;margin-bottom:4px;">${escapeHtml(heading)}</h2>
      <p style="color:#475569;margin-top:0;">Received via the Connect2EdTech website.</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
        ${renderRows(fields)}
      </table>
    </div>`;
}

// Sends a notification email to the site owner (NOTIFY_EMAIL). Failures are
// logged but never thrown — a broken mail server should never block a
// visitor's form submission from being saved.
async function sendNotificationEmail({ subject, heading, fields }) {
  const t = getTransporter();

  if (!t) {
    console.warn(
      '[mailer] SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS) — skipping notification email.'
    );
    return { sent: false };
  }

  if (!notifyEmail) {
    console.warn('[mailer] NOTIFY_EMAIL is not set — skipping notification email.');
    return { sent: false };
  }

  try {
    await t.sendMail({
      from: emailFrom ? `"Connect2EdTech Website" <${emailFrom}>` : undefined,
      to: notifyEmail,
      subject,
      html: wrapEmail(heading, fields),
    });
    console.log(`[mailer] Notification email sent to ${notifyEmail}`);
    return { sent: true };
  } catch (err) {
    const msg = err.message || '';
    if (/auth|535|invalid credentials/i.test(msg)) {
      console.error('[mailer] Gmail authentication failed — verify SMTP_USER and SMTP_PASS (App Password).');
    } else if (/connect|econn|etimedout|enotfound|timeout/i.test(msg)) {
      console.error('[mailer] SMTP connection failed:', msg);
    } else {
      console.error('[mailer] Failed to send notification email:', msg);
    }
    return { sent: false, error: msg };
  }
}

async function sendContactNotification(contact) {
  return sendNotificationEmail({
    subject: `Connect2EdTech — New Contact Request: ${contact.name}`,
    heading: 'New Contact Request',
    fields: [
      ['Name', contact.name],
      ['Email', contact.email],
      ['Phone', contact.phone],
      ['Interested Course', contact.interestedCourse],
      ['Message', contact.message],
      ['Submitted', contact.createdDate ? new Date(contact.createdDate).toLocaleString() : ''],
    ],
  });
}

async function sendEnrollmentNotification(enrollment) {
  return sendNotificationEmail({
    subject: `Connect2EdTech — New Enrollment: ${enrollment.courseTitle} (${enrollment.fullName})`,
    heading: 'New Course Enrollment',
    fields: [
      ['Full Name', enrollment.fullName],
      ['Email', enrollment.email],
      ['Phone', enrollment.phone],
      ['Course', enrollment.courseTitle],
      ['City', enrollment.city],
      ['State', enrollment.state],
      ['Message', enrollment.message],
      ['Submitted', enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleString() : ''],
    ],
  });
}

module.exports = { sendContactNotification, sendEnrollmentNotification };
