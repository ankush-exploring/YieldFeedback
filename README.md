# YieldFeedback

**Honest feedback. Zero names.**

YieldFeedback is a modern, production-ready anonymous feedback platform built with Next.js 14 App Router. Users can create a personal feedback link, share it anywhere, and receive honest, candid feedback from friends, colleagues, or followers without revealing sender identity.

---

## Features

- 🔒 **Completely Anonymous**: Senders require no account or authentication — honest feedback with zero names attached.
- ⚡ **Accept Messages Toggle**: Instant real-time control to turn incoming messages on or off.
- 🤖 **AI-Powered Suggestions**: Powered by Groq LLM (`llama-3.3-70b-versatile`) to generate inspirational feedback prompts.
- 📬 **Email Verification**: User sign-ups secured with 6-digit OTP verification powered by Brevo.
- 🛡️ **Robust Authentication**: Credentials-based auth using NextAuth with JWT sessions.
- 🗑️ **Message Management**: Securely view and delete received messages directly from your dashboard.
- 🎨 **Polished Modern UI**: Built with Tailwind CSS, shadcn/ui components, and an indigo/emerald theme.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js (Credentials Provider + JWT sessions)
- **Styling**: Tailwind CSS & shadcn/ui
- **Validation**: Zod & React Hook Form
- **Email**: Brevo HTTP API (Port 443) with React Email
- **AI / LLM**: Groq via `@ai-sdk/groq` & Vercel AI SDK

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set the following environment variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (`mongodb://...` or `mongodb+srv://...`) |
| `NEXTAUTH_SECRET` | Secret key for signing NextAuth JWT tokens |
| `NEXTAUTH_URL` | Application base URL (e.g. `http://localhost:3000` locally) |
| `BREVO_API_KEY` | API key from Brevo for verification emails (free, 0 domains needed) |
| `BREVO_SENDER_EMAIL` | Your verified sender email (e.g. `your_email@gmail.com`) |
| `GROQ_API_KEY` | API key from Groq Console for LLM suggestions |
| `GROQ_MODEL` | Groq model identifier (default: `llama-3.3-70b-versatile`) |

---

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Set up your `.env` file with your credentials as described above.

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

5. **Build and test production**:
   ```bash
   npm run lint
   npm run build
   npm start
   ```

---

## Deployment (Render)

This repository includes a `render.yaml` blueprint for one-click deployment as a Node Web Service on [Render](https://render.com):

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node 20

Configure your secrets (`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `GROQ_API_KEY`) in the Render Dashboard environment settings.

---

## License

MIT
