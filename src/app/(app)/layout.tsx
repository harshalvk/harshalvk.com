import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import AppProvider from '@/components/Providers/AppProvider';
import '@/styles/globals.css';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/modules/portfolio/components/Sections/Footer';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'harshal.',
  description: 'Harshal Khobragade Protfolio website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} flex min-h-svh w-screen flex-col font-sans antialiased`}
      >
        <AppProvider>
          <Navbar />
          <div className="bg-background h-19" />
          <main className="flex flex-1 flex-col">
            <TooltipProvider>{children}</TooltipProvider>
          </main>
        </AppProvider>
        <Footer />
      </body>
    </html>
  );
}
