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
      <Navbar />
      <div className="bg-background h-19" />
      <main className="flex flex-2 flex-col">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default AppLayout;
