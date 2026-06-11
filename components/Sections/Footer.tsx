import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <section className="py-4 font-mono">
      <div className="flex w-full items-center justify-between">
        <p className="text-muted-foreground font-mono text-sm">
          Copyright &#169; 2021 - 2026 Harshal Khobragade
        </p>
      </div>
      <div className="mt-4 flex w-full justify-between">
        <div className="flex flex-col">
          <h2 className="text-[18px]">Important Links</h2>
          <Link className="text-muted-foreground underline-offset-4 hover:underline" href="/">
            Home
          </Link>
          <a className="text-muted-foreground underline-offset-4 hover:underline" href="/work">
            Work
          </a>
          <a className="text-muted-foreground underline-offset-4 hover:underline" href="/blogs">
            Blog
          </a>
        </div>
        <div className="flex flex-col">
          <h2 className="text-[18px]">Social</h2>
          <a
            className="text-muted-foreground underline-offset-4 hover:underline"
            href="https://github.com/Harshalvk/"
            target="_blank"
          >
            GitHub
          </a>
          <a
            className="text-muted-foreground underline-offset-4 hover:underline"
            href="https://x.com/Harshalvk_"
            target="_blank"
          >
            Twitter / X
          </a>
          <a
            className="text-muted-foreground underline-offset-4 hover:underline"
            href="https://discord.com/users/harsshal."
            target="_blank"
          >
            Discord
          </a>
          <a
            className="text-muted-foreground underline-offset-4 hover:underline"
            href="https://www.linkedin.com/in/harshalvk/"
            target="_blank"
          >
            LinkedIn
          </a>
        </div>
        <div className="flex flex-col">
          <h2 className="text-[18px]">Other</h2>
          <a className="text-muted-foreground underline-offset-4 hover:underline">Contact</a>
        </div>
      </div>
    </section>
  );
};

export default Footer;
