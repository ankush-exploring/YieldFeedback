import nodemailer from 'nodemailer';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';
import { render } from '@react-email/components';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // Always log OTP to server console immediately
  console.log(`\n======================================================`);
  console.log(`[YieldFeedback] ✉️  VERIFICATION CODE for ${username} (${email}): ${verifyCode}`);
  console.log(`======================================================\n`);

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.warn(
      `[YieldFeedback] Gmail SMTP not configured (GMAIL_USER or GMAIL_APP_PASSWORD missing in env). Use verification code "${verifyCode}" printed above.`
    );
    return {
      success: true,
      message: 'Account created! (Verification code logged in server logs).',
    };
  }

  const sendEmailTask = async (): Promise<ApiResponse> => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
        connectionTimeout: 8000,
        greetingTimeout: 5000,
        socketTimeout: 8000,
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

      console.log(`[YieldFeedback] Verification email delivered to ${email} via Gmail SMTP.`);
      return { success: true, message: 'Verification email sent successfully.' };
    } catch (err: unknown) {
      console.error('[YieldFeedback] Gmail SMTP send error:', err);
      // Fallback gracefully so sign-up continues and user can verify via the logged OTP
      return {
        success: true,
        message: 'Account created! (Verification code logged in server logs).',
      };
    }
  };

  // Hard 6-second timeout race so sign-up button NEVER hangs indefinitely
  const timeoutPromise = new Promise<ApiResponse>((resolve) =>
    setTimeout(
      () =>
        resolve({
          success: true,
          message: 'Account created! Check server logs for verification code.',
        }),
      6000
    )
  );

  return Promise.race([sendEmailTask(), timeoutPromise]);
}
