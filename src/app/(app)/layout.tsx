import Navbar from '@/components/shared/Navbar';
import Footer from '@/modules/portfolio/components/Sections/Footer';
import React from 'react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="bg-background h-19" />
      <main className="flex flex-2 flex-col">{children}</main>
      <Footer />
    </>
  );
};

export default AppLayout;
