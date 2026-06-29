import AboutMe from '@/modules/portfolio/components/Sections/AboutMe';
import Hero from '@/modules/portfolio/components/Sections/Hero';
import Projects from '@/modules/portfolio/components/Sections/Projects';
import ContactMe from '@/modules/portfolio/components/Sections/ContactMe';
import GitHubContri from '@/modules/portfolio/components/Sections/GitHubContri';
import MyTechnologies from '@/modules/portfolio/components/Sections/MyTechnologies';
import SectionBorders from '@/components/shared/SectionBorders';

import { inter } from '@/lib/fonts';
import Experiences from '@/modules/portfolio/components/Sections/Experiences';

export default function Home() {
  return (
    <section className="container mx-auto max-w-5xl px-4 lg:px-0">
      <div
        className="border-border relative flex h-[9rem] w-full items-center justify-center border border-t-0 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_1px,transparent_1px)] sm:h-[12rem] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)]"
        style={{
          backgroundSize: '15px 15px',
        }}
      >
        <SectionBorders />
        <h1 className={`text-foreground text-lg sm:text-2xl ${inter.className}`}>
          Build | Ship | Execute
        </h1>
      </div>
      <Hero />
      <AboutMe />
      <Experiences />
      <Projects />
      <GitHubContri />
      <MyTechnologies />
      <ContactMe />
    </section>
  );
}
