import Navbar from '@/components/shared/Navbar';
import Footer from '@/modules/portfolio/components/Sections/Footer';
import dynamic from 'next/dynamic';
import React from 'react';

const ScrollToTop = dynamic(() =>
  import('@/components/scroll-to-top').then((mod) => mod.ScrollToTop)
);

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <a
        href="#main-content"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      <header role="banner">
        <Navbar />
      </header>
      <div className="bg-background h-19" />
      <main id="main-content" className="flex flex-1 flex-col" role="main">
        {children}
      </main>
      <footer role="contentinfo">
        <Footer />
      </footer>
      <ScrollToTop />
    </>
  );
};

export default AppLayout;
