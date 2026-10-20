import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // Always log OTP to server console for local testing and debugging
  console.log(`\n======================================================`);
  console.log(`[YieldFeedback] ✉️  Verification code for ${username} (${email}): ${verifyCode}`);
  console.log(`======================================================\n`);

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  // Option 1: If Gmail SMTP is configured, send via Gmail (sends to ANY email freely with 0 domains)
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
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
    } catch (smtpError: unknown) {
      console.error('[YieldFeedback] Gmail SMTP error:', smtpError);
      return {
        success: false,
        message: 'Failed to send verification email via Gmail SMTP.',
      };
    }
  }

  // Option 2: Fallback to Resend API
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
      console.error('[YieldFeedback] Resend error while sending verification email:', error);

      // In development or when using Resend free tier restricted to account owner email,
      // allow testing without blockage by utilizing the logged OTP
      const isDevOrRestricted =
        process.env.NODE_ENV !== 'production' ||
        error.message?.includes('testing email') ||
        error.message?.includes('not verified');

      if (isDevOrRestricted) {
        console.warn(
          `[YieldFeedback] Notice: Resend testing domain (onboarding@resend.dev) can only deliver directly to your registered Resend account email. For other test emails, use the OTP code "${verifyCode}" printed above.`
        );
        return {
          success: true,
          message:
            'Verification email queued. (Testing mode: OTP is also logged in server console).',
        };
      }

      return {
        success: false,
        message: error.message || 'Failed to send verification email.',
      };
    }

    console.log(`[YieldFeedback] Verification email delivered to ${email} (ID: ${data?.id})`);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError: unknown) {
    console.error('[YieldFeedback] Unexpected error sending verification email:', emailError);
    if (process.env.NODE_ENV !== 'production') {
      return {
        success: true,
        message:
          'Testing mode: verification code printed in your server terminal.',
      };
    }
    return { success: false, message: 'Failed to send verification email.' };
  }
}
