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

  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoSender = process.env.BREVO_SENDER_EMAIL;

  if (!brevoApiKey || !brevoSender) {
    console.warn(
      `[YieldFeedback] Brevo not configured yet (BREVO_API_KEY or BREVO_SENDER_EMAIL missing). Use code "${verifyCode}" printed above to verify.`
    );
    return {
      success: true,
      message: 'Account created! (Verification code logged in server logs).',
    };
  }

  // Send via Brevo REST API (HTTP Port 443 — works smoothly on Render with zero custom domains)
  const sendEmailTask = async (): Promise<ApiResponse> => {
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
        console.log(`[YieldFeedback] Verification email delivered to ${email} via Brevo.`);
        return { success: true, message: 'Verification email sent successfully.' };
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('[YieldFeedback] Brevo API error response:', errorData);
        return {
          success: true,
          message: 'Account created! Check your email or server logs for verification code.',
        };
      }
    } catch (err) {
      console.error('[YieldFeedback] Error calling Brevo API:', err);
      return {
        success: true,
        message: 'Account created! Check server logs for verification code.',
      };
    }
  };

  // Hard 5-second timeout so sign-up request never hangs
  const timeoutPromise = new Promise<ApiResponse>((resolve) =>
    setTimeout(
      () =>
        resolve({
          success: true,
          message: 'Account created! Check server logs for verification code.',
        }),
      5000
    )
  );

  return Promise.race([sendEmailTask(), timeoutPromise]);
}
