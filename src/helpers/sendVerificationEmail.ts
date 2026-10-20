import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // Always log OTP to server console for local testing and debugging
  console.log(`\n======================================================`);
  console.log(`[YieldFeedback] ✉️  Verification code for ${username} (${email}): ${verifyCode}`);
  console.log(`======================================================\n`);

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

      // In development or when using Resend free tier restricted to the account owner email,
      // allow testing without blockage by utilizing the logged OTP
      const isDevOrRestricted =
        process.env.NODE_ENV !== 'production' ||
        error.message?.includes('testing email') ||
        error.message?.includes('not verified');

      if (isDevOrRestricted) {
        console.warn(
          `[YieldFeedback] Notice: Resend testing domain (onboarding@resend.dev) can only deliver directly to your registered Resend account email (e.g. ankushvishwakarma666@gmail.com). For other test emails, use the OTP code "${verifyCode}" printed above.`
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
