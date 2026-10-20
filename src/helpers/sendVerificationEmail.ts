import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';

async function executeEmailSend(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoSender = process.env.BREVO_SENDER_EMAIL || process.env.GMAIL_USER;

  // Option 1: Brevo REST API (HTTP Port 443 — NEVER blocked by Render free tier firewall, sends to any email freely)
  if (brevoApiKey && brevoSender) {
    try {
      const emailHtml = await render(
        VerificationEmail({ username, otp: verifyCode })
      );

      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'YieldFeedback', email: brevoSender },
          to: [{ email }],
          subject: 'YieldFeedback — Verify your account',
          htmlContent: emailHtml,
        }),
      });

      if (res.ok) {
        console.log(`[YieldFeedback] Email delivered to ${email} via Brevo HTTP API.`);
        return { success: true, message: 'Verification email sent successfully.' };
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error('[YieldFeedback] Brevo API error:', errData);
      }
    } catch (brevoErr) {
      console.error('[YieldFeedback] Brevo fetch error:', brevoErr);
    }
  }

  // Option 2: Gmail SMTP (Nodemailer) with strict connection timeouts so Render port blackhole doesn't hang
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
        connectionTimeout: 4000, // 4s timeout (Render free tier blocks ports 465/587)
        greetingTimeout: 3000,
        socketTimeout: 4000,
      });

      const emailHtml = await render(
        VerificationEmail({ username, otp: verifyCode })
      );

      await transporter.sendMail({
        from: `YieldFeedback <${gmailUser}>`,
        to: email,
        subject: 'YieldFeedback — Verify your account',
        html: emailHtml,
      });

      console.log(`[YieldFeedback] Email delivered to ${email} via Gmail SMTP.`);
      return { success: true, message: 'Verification email sent successfully.' };
    } catch (smtpError: unknown) {
      console.error('[YieldFeedback] Gmail SMTP error (Note: Render free tier blocks outbound SMTP ports 465/587):', smtpError);
    }
  }

  // Option 3: Resend API (HTTP Port 443 — works seamlessly on Render)
  try {
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || 'YieldFeedback <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'YieldFeedback — Verify your account',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) {
      console.error('[YieldFeedback] Resend error:', error.message);
    } else {
      console.log(`[YieldFeedback] Email delivered to ${email} via Resend (ID: ${data?.id})`);
      return { success: true, message: 'Verification email sent successfully.' };
    }
  } catch (resendError) {
    console.error('[YieldFeedback] Resend exception:', resendError);
  }

  return {
    success: false,
    message: 'Could not deliver email. Please check server logs for your verification code.',
  };
}

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // Always log OTP to server console immediately
  console.log(`\n======================================================`);
  console.log(`[YieldFeedback] ✉️  VERIFICATION CODE for ${username} (${email}): ${verifyCode}`);
  console.log(`======================================================\n`);

  // Hard timeout of 5 seconds so the user request NEVER hangs
  const timeoutPromise = new Promise<ApiResponse>((resolve) =>
    setTimeout(
      () =>
        resolve({
          success: false,
          message: 'Email request timed out.',
        }),
      5000
    )
  );

  try {
    const result = await Promise.race([
      executeEmailSend(email, username, verifyCode),
      timeoutPromise,
    ]);

    // If email sent successfully, return success
    if (result.success) {
      return result;
    }

    // If email sending failed or timed out (e.g. Render blocking SMTP ports or test domain limit),
    // still allow user to proceed to the verify screen using the code logged above!
    console.warn(
      `[YieldFeedback] Notice: Email delivery did not complete. Continuing sign-up with OTP: ${verifyCode}`
    );
    return {
      success: true,
      message: 'Account created! (Verification code logged in server logs).',
    };
  } catch (err) {
    console.error('[YieldFeedback] Unexpected error in sendVerificationEmail:', err);
    return {
      success: true,
      message: 'Account created! Check server logs for verification code.',
    };
  }
}
