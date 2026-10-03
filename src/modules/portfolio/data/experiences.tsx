import { Experience } from '@/modules/portfolio/types/experiences';
import { CodeXml } from 'lucide-react';

export const EXPERIENCES: Experience[] = [
  {
    id: 'wisnolect',
    companyName: 'Wisnolect',
    companyLogo: '',
    companyWebsite: 'https://www.wisnolect.com',
    positions: [
      {
        id: '1',
        title: 'Full-Stack Developer',
        employmentPeriod: {
          start: '01.06.2024',
          end: '30.06.2024',
        },
        employmentType: 'Intern',
        description: `Built scalable backend infrastructure for an Uber-style platform with real-time matching, location tracking, dynamic pricing, and payment processing.`,
        skills: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Figma'],
        isExpanded: true,
        icon: <CodeXml />,
      },
    ],
  },
];
