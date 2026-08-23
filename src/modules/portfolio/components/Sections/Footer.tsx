import { SectionCorners } from '@/components/shared/Navbar';
import { Route } from 'next';
import Link from 'next/link';

const importantLinks = [
  { name: 'About', href: '/#about' },
  { name: 'Experience', href: '/#experiences' },
  { name: 'Blog', href: '/blog' },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/harshalvk/' },
  { name: 'Twitter / X', href: 'https://x.com/Harshalvk_' },
  { name: 'Discord', href: 'https://discord.com/users/harsshal.' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/harshalvk/' },
];

const FooterLinkGroup = ({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) => (
  <div className="flex flex-col gap-1">
    <h2 className="mb-1 text-sm font-medium">{title}</h2>
    {links.map((link) => (
      <Link
        key={link.name}
        href={link.href as Route}
        target={link.href.startsWith('http') ? '_blank' : undefined}
        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-muted-foreground font-mono text-sm underline-offset-4 hover:underline"
      >
        {link.name}
      </Link>
    ))}
  </div>
);

const Footer = () => {
  return (
    <footer className="flex justify-center">
      <div className="mb-4 w-full max-w-5xl px-4 lg:px-0">
        <div className="screen-line-top screen-line-bottom relative flex w-full flex-col gap-6 border-x px-6 py-6">
          <SectionCorners />

          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-foreground font-mono text-base font-semibold tracking-tight">
                harshalvk
              </span>
              <span className="text-muted-foreground font-mono text-xs">
                Building things for the web.
              </span>
            </div>

            <div className="flex gap-12">
              <FooterLinkGroup title="Links" links={importantLinks} />
              <FooterLinkGroup title="Social" links={socialLinks} />
            </div>
          </div>

          <div className="border-border/50 border-t" />

          <p className="text-muted-foreground font-mono text-xs">
            &copy; 2021 – 2026 Harshal Khobragade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
