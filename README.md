# Program Builder Web Application

This repository contains a comprehensive web application for creating and managing educational programs with built-in gamification features.

## Features

- **Program Management**: Create and organize educational programs with courses, lessons, and assessments
- **Course Creation**: Build structured courses with sequenced lessons
- **Assessment Tools**: Create quizzes and assignments to test knowledge
- **Enhancement Materials**: Add supplementary resources to programs
- **Gamification**: Motivate learners with badges and points
- **Progress Tracking**: Monitor learning progress with visual indicators

## Gamification System

The application includes a gamification system with:

- **Badges**: 5 milestone badges to recognize achievements
  - First Course Completed
  - Program Master
  - Perfect Score
  - Consistent Learner
  - Top Project Submission
- **Points System**: Earn points for completing courses, lessons, and assessments
  - 10 points per course completed
  - 2 points per lesson completed
  - 5 points per assessment completed
  - 5 bonus points for perfect scores
  - 20 points for program completion

## Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Cloudflare Workers with D1 Database
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 20.18.0 or higher
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/program-builder.git
cd program-builder
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Set up the database
```bash
wrangler d1 execute DB --local --file=migrations/0001_initial.sql
```

4. Start the development server
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application is configured for easy deployment to Netlify:

1. Push your code to a GitHub repository
2. Connect the repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

Alternatively, you can deploy from the command line:

```bash
npm run build
netlify deploy --prod
```

## Project Structure

- `src/app/` - Next.js pages
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and API handlers
- `migrations/` - Database migration files
- `public/` - Static assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.
