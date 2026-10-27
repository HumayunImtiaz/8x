# 8x AI Creative Studio

**Live deployment:** _Add the live deployment URL here._

8x AI Creative Studio is a cinematic creative-studio interface branded in the app as **Neon Cinema**. It brings together image and video creation briefs, a curated inspiration gallery, a local sample-creation library, workspace preferences, and optional Supabase authentication.

> **Demo status:** The image and video generation providers are not connected. The generators let you prepare prompts and settings, but submitting a brief does not generate an image or video. Gallery media and items saved to Creations are curated sample assets, not AI-generated results.

## Features

- **Image Studio** — compose a prompt and negative prompt, choose a visual style, aspect ratio, output count, quality, and seed, and preview curated reference artwork.
- **Video Studio** — prepare a motion brief with a motion preset, aspect ratio, and duration; preview curated sample videos and stills.
- **Explore** — browse the included sample collection of images and video.
- **My Creations** — save sample media to a browser-local library, then search, filter, sort, favorite, preview, download, or remove saved items.
- **Settings** — save profile details and creative defaults, adjust reduced-motion and reminder preferences, and clear the local Creations library.
- **Optional account access** — sign up, log in, reset a password, and log out using Supabase Auth when configured.
- **Responsive, motion-aware interface** — animated interactions respect the studio's reduced-motion preference.

Creations and settings are stored in the current browser profile using `localStorage`; they are not synced to an account or cloud. Supabase is used for authentication, not for generated media or the local library.

## Tech stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4 and custom global styles
- Framer Motion
- Supabase Auth with `@supabase/ssr`
- Lucide icons
- ESLint

## Getting started

### Requirements

- Node.js 20.9 or later
- npm

### Install and run

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` file in the project root to enable Supabase account features. The app reads these variable names:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Provide the corresponding values in your local environment; do not put credentials or secret values in this README or commit them to source control. Both variables are needed for Supabase authentication. Without them, the studio's demo pages remain available, but account operations are not configured. Restart the development server after changing environment variables.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |

## Main routes

| Route | Description |
| --- | --- |
| `/` | Landing page and featured sample artwork. |
| `/generate/image` | Image Studio brief builder. |
| `/generate/video` | Video Studio brief builder. |
| `/explore` | Curated sample gallery. |
| `/creations` | Browser-local saved sample library. |
| `/settings` | Browser-local workspace preferences. |
| `/login` | Supabase login. |
| `/signup` | Supabase account registration. |
| `/reset-password` | Supabase password reset. |

The generator pages are also available at `/create/image` and `/create/video`.

## Project structure

```text
src/
  app/          App Router pages and the authentication callback
  components/   Studio, gallery, account, settings, and shared UI
  lib/          Browser-local data and Supabase client helpers
public/assets/  Curated sample artwork, posters, and video
```
