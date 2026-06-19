import type { User } from '@/modules/portfolio/types/user';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const USER: User = {
  firstName: 'Harshal',
  lastName: 'Khobragade',
  displayName: 'Harshal',
  username: 'harshalvk',
  gender: 'male',
  pronouns: 'he/him',
  bio: `Hey I'm Harshal, a Engineer. I love to learn and build products.`,
  additionalInfo: `- Currently learning: System Design, Go`,
  address: 'Maharashtra, India',
  phoneNumberB64: 'OTUyOTIwNDUxNg==', // utf-8
  emailB64: 'aGFyc2hhbHZraG9icmFnYWRlQGdtYWlsLmNvbQ==',
  website: 'https://harshalvk.com',
  jobTitle: 'Full-Stack Developer',
  flipSentences: ['Full-Stack Developer', 'Backend Developer'],
  jobs: [
    {
      title: 'Full-Stack Developer',
      company: 'Wisnolect',
      website: 'https://www.wisnolect.com/',
      experienceId: 'wisnolect',
    },
  ],
  about: `
- I've been coding for the past 3 years, mainly focusing on web development and building scalable backend systems.
- In this time, I've worked with various technologies to create fast, responsive applications, from backend architecture to frontend development and deployment.
- I enjoy solving real-world problems with code and constantly aim to improve while staying current with tech trends.
`,
  avatar: `${baseUrl}/profile.png`,
  ogImage: `${baseUrl}/opengraph-image.png`,
  timeZone: 'Asia/Kolkata',
  keywords: [
    'harshalvk',
    'harshalvk engineer',
    'Harshalvk Engineer',
    'harshal',
    'harshalvk.com',
    'harshal khobragade',
    'harshal vasant khobragade',
    'Harshal Vasant Khobragade',
    'Harshal Khobragade',
    'Harshal V Khobragade',
    'harshal portfolio',
    'harshalvk portfolio',
    'full-stack developer',
    'software engineer',
    'web developer',
    'developer',
    'next.js',
    'nextjs',
    'typescript',
  ],
  dateCreated: '2026-06-01',
};
