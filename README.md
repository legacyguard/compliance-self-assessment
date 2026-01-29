# Compliance Self-Assessment

Free compliance self-assessment tool for NIS2, DORA, and AI Act regulations. Part of the EU Cyber Resilience Platform ecosystem.

## Features

- **Three Compliance Frameworks**: NIS2, DORA, AI Act
- **Multi-language Support**: English, Slovak, Czech
- **Instant Gap Analysis**: Automatic scoring and recommendations
- **PDF Export**: Generate reports with watermark
- **30-Day Data Retention**: Free tier with time-limited storage

## Tech Stack

- Next.js 15 (App Router)
- TypeScript 5.x
- PostgreSQL (Supabase)
- Drizzle ORM
- Supabase Auth
- shadcn/ui + Tailwind CSS
- next-intl for i18n

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a Supabase project and copy credentials

4. Create `.env.local`:
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   CRON_SECRET=your-cron-secret
   ```

5. Push database schema:
   ```bash
   pnpm db:push
   ```

6. Run development server:
   ```bash
   pnpm dev
   ```

## Database Schema

- `users` - Users with 30-day expiration
- `assessment_templates` - NIS2, DORA, AI Act templates
- `assessment_categories` - Categories within templates
- `assessment_questions` - Questions with weights
- `answer_options` - Answer options with scores
- `assessments` - User assessments
- `assessment_responses` - User answers
- `recommendations` - Generated recommendations

## Deployment

### Vercel

1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy

The cron job for cleanup runs daily at 3 AM UTC.

## License

Proprietary - EU Cyber Resilience Platform

## Related

- [EU Cyber Resilience Platform](https://kyberbezpecnost.cloud) - Full compliance management platform
