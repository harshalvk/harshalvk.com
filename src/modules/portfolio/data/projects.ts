import type { Project } from '@/modules/portfolio/types/projects';

export const PROJECTS: Project[] = [
  {
    id: 'meetlume',
    title: 'MeetLume',
    period: {
      start: '09.2025',
    },
    oneLiner:
      'An AI-powered meeting assistant that records, transcribes, and summarizes your conversations in real time.',
    link: '',
    skills: [
      'NextJS',
      'TypeScript',
      'Better-Auth',
      'Polar.sh',
      'Automation',
      'Docker',
      'Cloudflare Workers',
    ],
    description: `MeetLume is an AI-powered meeting assistant that records, transcribes, summarizes, and helps you search through your conversations.
  - Live Transcription: get real-time, accurate transcripts of your Google Meet.
  - AI-Powered Summaries: automatically generate concise summaries, action items, and key takeaways after every meeting.
  - Smart Search: find any conversation, topic, or decision instantly by searching through your entire meeting history.
  - Organized Workspace: create channels and folders to organize meetings by project, team, or client.
  - Seamless Integration: works with your favorite calendar and team apps. (Calendars, trello, etc.)
  - Collaboration: share meeting notes and highlights with teammates, even if they couldn't attend.`,
    logo: '',
    isExpanded: true,
  },
  {
    id: 'webextract',
    title: 'WebExtract',
    period: {
      start: '01.2025',
      end: '05.2025',
    },
    oneLiner:
      'A no-code workflow automation platform for visually designing and executing web data extraction pipelines.',
    link: 'https://webextract.vercel.app',
    skills: ['Open Source', 'React', 'NextJS', 'TypeScript', 'Next-Auth', 'Prisma', 'Docker'],
    description: `Built a no-code workflow automation platform that enables users to visually design, schedule, and execute web data extraction pipelines through a drag-and-drop editor
  - Built a visual drag-and-drop workflow builder for web automation
  - Automated web scraping and data extraction from websites
  - Added AI-powered data processing and content extraction
  - Enabled scheduled workflows and webhook-based integrations
  - Provided real-time execution tracking, analytics, and secure credential management`,
    logo: '',
    isExpanded: false,
  },
  {
    id: 'quala',
    title: 'Quala',
    period: {
      start: '06.2025',
      end: '08.2025',
    },
    oneLiner:
      'A drop-in webhook analytics platform that logs requests to a real-time dashboard and pushes alerts to your team channels.',
    link: 'https://quala-theta.vercel.app',
    skills: ['NextJs', 'Better-Auth', 'Prisma', 'PostgresSQL', 'Docker'],
    description: `A lightweight, drop-in webhook analytics platform. Embed a single tracking link into any project — every request is instantly logged to a real-time dashboard and pushed to your team's messaging channels (Discord, Slack, and more). Zero SDK, zero config, just insights.
  - Generate a unique URL, embed it anywhere, and capture every request instantly
  - View structured logs in real time and route notifications to Discord, Slack, or any webhook
  - No instrumentation needed; just a link and immediate visibility into your traffic`,
    logo: '',
    isExpanded: false,
  },
  {
    id: 'isonomy',
    title: 'Isonomy',
    period: {
      start: '07.2026',
    },
    oneLiner:
      'A high-throughput distributed ledger and wallet system built from scratch in TypeScript.',
    link: 'https://github.com/harshalvk/isonomy',
    skills: ['TypeScript', 'Distributed Systems', 'Crypto', 'Ledger', 'Wallet'],
    description: `A high-throughput distributed ledger & wallet system, built from scratch in TypeScript.
  - Implements a custom distributed ledger with cryptographic transaction validation
  - Built-in wallet system for secure balance management and transfer execution
  - Designed for high-throughput with consensus and fault-tolerance considerations
  - End-to-end TypeScript architecture for type safety across the entire stack`,
    logo: '',
    isExpanded: false,
  },
  {
    id: 'kairos',
    title: 'Kairos',
    period: {
      start: '07.2026',
    },
    oneLiner:
      'A distributed job queue built from scratch in Go for reliable background task processing at scale.',
    link: 'https://github.com/harshalvk/kairos',
    skills: ['Go', 'Distributed Systems', 'Job Queue', 'Redis'],
    description: `A distributed job queue built from scratch in Go — a mini Sidekiq/Celery built without off-the-shelf frameworks.
  - Custom worker pool and task scheduler with reliable background job processing
  - Distributed architecture supporting multiple producers and consumers
  - Built in pure Go for systems-level performance and low memory overhead
  - Handles retries, dead-letter queues, and concurrency control`,
    logo: '',
    isExpanded: false,
  },
  {
    id: 'cage',
    title: 'Cage',
    period: {
      start: '07.2026',
    },
    oneLiner:
      'A REST API that programmatically creates isolated sandbox environments, runs commands, and tears them down securely.',
    link: 'https://github.com/harshalvk/cage/',
    skills: ['Go', 'Docker', 'REST API', 'Systems Programming', 'Sandbox'],
    description: `Programmatically create isolated environments (sandboxes), run commands inside them, and tear them down — all through a simple REST API.
  - Spins up isolated Docker containers on demand via REST endpoints
  - Executes arbitrary commands securely inside sandboxes and captures output
  - Handles automatic cleanup and resource teardown after execution
  - Built with Go and Docker for systems-level performance and security`,
    logo: '',
    isExpanded: false,
  },
];
