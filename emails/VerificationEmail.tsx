import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify your YieldFeedback account</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>YieldFeedback — Your verification code: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for signing up for YieldFeedback — where you collect
            honest feedback with zero names attached.
          </Text>
        </Row>
        <Row>
          <Text>Please use the following verification code to confirm your account:</Text>
        </Row>
        <Row>
          <Text
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              letterSpacing: '8px',
              textAlign: 'center',
              padding: '16px',
              background: '#f3f4f6',
              borderRadius: '8px',
              margin: '16px 0',
            }}
          >
            {otp}
          </Text>
        </Row>
        <Row>
          <Text>
            This code is valid for <strong>1 hour</strong>. If you did not
            create an account on YieldFeedback, you can safely ignore this email.
          </Text>
        </Row>
        <Row>
          <Button
            href="https://yieldfeedback.dev/sign-in"
            style={{
              background: '#6366f1',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            Go to YieldFeedback
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
