import AboutMe from '@/components/Sections/AboutMe';
import Hero from '@/components/Sections/Hero';
import Projects from '@/components/Sections/Projects';
import ContactMe from '@/components/Sections/ContactMe';
import GitHubContri from '@/components/Sections/GitHubContri';
import Footer from '@/components/Sections/Footer';
import MyTechnologies from '@/components/Sections/MyTechnologies';
import { inter } from '@/lib/fonts';
import Navbar from '@/components/shared/Navbar';
import SectionBorders from '@/components/shared/SectionBorders';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function Home() {
  return (
    <section className="container mx-auto max-w-5xl px-4 lg:px-0">
      <Navbar />
      <div className="bg-background h-19" />
      <div
        className="border-border relative flex h-[12rem] w-full items-center justify-center border border-t-0 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)]"
        style={{
          backgroundSize: '15px 15px',
        }}
      >
        <SectionBorders />
        <h1 className={`text-foreground text-2xl ${inter.className}`}>Build | Ship | Execute</h1>
      </div>
      <Hero />
      <AboutMe />
      <Projects />
      <TooltipProvider>
        <GitHubContri />
      </TooltipProvider>
      <MyTechnologies />
      <ContactMe />
      <Footer />
    </section>
  );
}
