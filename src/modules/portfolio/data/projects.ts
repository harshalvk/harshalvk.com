import type { Project } from '@/modules/portfolio/types/projects';

export const PROJECTS: Project[] = [
  {
    id: 'meetlume',
    title: 'MeetLume',
    period: {
      start: '09.2025',
    },
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
    link: 'https://quala-theta.vercel.app',
    skills: ['NextJs', 'Better-Auth', 'Prisma', 'PostgresSQL', 'Docker'],
    description: `A lightweight, drop-in webhook analytics platform. Embed a single tracking link into any project — every request is instantly logged to a real-time dashboard and pushed to your team's messaging channels (Discord, Slack, and more). Zero SDK, zero config, just insights
  - Generate a unique URL, embed it anywhere, and capture every request instantly
  - View structured logs in real time and route notifications to Discord, Slack, or any webhook
  - No instrumentation needed; just a link and immediate visibility into your traffic`,
    logo: '',
    isExpanded: false,
  },
];
