'use client';

import {
  ArrowUpDown,
  Book,
  BriefcaseBusiness,
  CornerDownLeftIcon,
  FileTextIcon,
  Home,
  Kanban,
  LucideIcon,
  MonitorIcon,
  MoonStarIcon,
  RssIcon,
  Search,
  SunMedium,
  Hexagon,
  ZapIcon,
  SignatureIcon,
  UserSearchIcon,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { SOCIAL_LINKS } from '@/modules/portfolio/data/social-links';
import { DocPreview } from '@/modules/doc/types/document';
import { useTheme } from 'next-themes';
import { copyToClipboardWithEvent } from '@/utils/copy';
import { toast } from 'sonner';
import {
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
  CommandInput,
  CommandEmpty,
} from '@/components/ui/command';
import { Button } from './ui/button';
import { Kbd, KbdGroup } from './ui/kbd';
import { useMutationObserver } from '@/hooks/useMutationObserver';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from '@bprogress/next/app';
import { Icons } from './icons/icons';

type CommandKind = 'command' | 'page' | 'link' | 'component' | 'block';

type CommandLinkItem = {
  title: string;
  href: string;
  kind: CommandKind;
  icon?: React.ReactElement | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconImage?: string;
  shortcut?: string;
  keywords?: string[];
  openInNewTab?: boolean;
};

const MENU_LINKS: CommandLinkItem[] = [
  {
    title: 'Home',
    href: '/',
    kind: 'page',
    icon: <Home />,
    shortcut: 'GH',
  },
  {
    title: 'Components',
    href: '/components',
    kind: 'page',
    icon: Icons.react,
    shortcut: 'GC',
  },
  {
    title: 'Blogs',
    href: '/blog',
    kind: 'page',
    icon: <Book />,
    shortcut: 'GB',
  },
  {
    title: 'Theia',
    href: '/theia',
    kind: 'page',
    icon: <Hexagon />,
    shortcut: 'GT',
  },
];

const PORTFOLIO_LINKS: CommandLinkItem[] = [
  {
    title: 'About Me.',
    href: '/#about',
    kind: 'page',
    icon: <SignatureIcon />,
  },
  {
    title: 'Experience.',
    href: '/#experiences',
    kind: 'page',
    icon: <BriefcaseBusiness />,
  },
  {
    title: 'Projects.',
    href: '/#projects',
    kind: 'page',
    icon: <Kanban />,
  },
  {
    title: 'Technologies I Use.',
    href: '/#technologies',
    kind: 'page',
    icon: <ZapIcon />,
  },
  {
    title: 'Contact Me.',
    href: '/#contactme',
    kind: 'page',
    icon: <UserSearchIcon />,
  },
];

const SOCIAL_LINK_ITEMS: CommandLinkItem[] = SOCIAL_LINKS.map((item) => ({
  title: item.title,
  href: item.href,
  kind: 'link',
  icon: item.icon,
  openInNewTab: true,
}));

const OTHER_LINK_ITEMS: CommandLinkItem[] = [
  {
    title: 'llms.txt',
    href: '/llms.txt',
    kind: 'link',
    icon: <FileTextIcon />,
    openInNewTab: true,
  },
  {
    title: 'RSS Feed',
    href: '/rss',
    kind: 'link',
    icon: <RssIcon />,
    openInNewTab: true,
  },
];

const CommandMenu = ({
  docs,
  enableHotKeys = true,
}: {
  docs: DocPreview[];
  enableHotKeys?: boolean;
}) => {
  const router = useRouter();
  const { setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [selectedCommandKind, setSelectedCommandKind] = useState<CommandKind | null>(null);

  const handleOpenLink = useCallback(
    (href: string, openInNewTab = false) => {
      setOpen(false);

      if (openInNewTab) {
        window.open(href, '_blank', 'noopener');
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const handleCopyText = useCallback((text: string, message: string) => {
    setOpen(false);
    copyToClipboardWithEvent(text, {
      name: 'command_menu_action',
      properties: {
        action: 'copy',
        text: text,
      },
    });
    toast.success(message);
  }, []);

  const createThemeHandler = useCallback(
    (theme: 'light' | 'dark' | 'system') => () => {
      setOpen(false);
      setTheme(theme);
    },
    [setTheme]
  );

  const components = useMemo(
    () =>
      docs
        .filter((doc) => doc.category === 'components')
        .sort((a, b) =>
          a.title.localeCompare(b.title, 'en', {
            sensitivity: 'base',
          })
        ),
    [docs]
  );

  const handleCommandHighlight = useCallback(() => {
    setSelectedCommandKind('command');
  }, []);

  const componentsGroup = useMemo(() => {
    if (!components || components.length === 0) return null;

    return (
      <CommandGroup heading="Components">
        {components.map((component) => (
          <CommandMenuItem
            key={component.slug}
            keywords={['component']}
            onHighlight={handleCommandHighlight}
            onSelect={() => handleOpenLink(`/components/${component.slug}`)}
          >
            <Icons.react />
            <p className="line-clamp-1">{component.title}</p>
          </CommandMenuItem>
        ))}
      </CommandGroup>
    );
  }, [components, handleOpenLink, handleCommandHighlight]);

  const blogLinks = useMemo(
    () =>
      docs
        .filter((doc) => doc.category !== 'components')
        .map<CommandLinkItem>((doc) => ({
          title: doc.title,
          href: `/blog/${doc.slug}`,
          kind: 'page',
          keywords: ['blog'],
        })),
    [docs]
  );

  const handleLinkHighlight = useCallback((link: CommandLinkItem) => {
    setSelectedCommandKind(link.kind);
  }, []);

  useHotkeys(
    'mod+k, slash',
    (e) => {
      e.preventDefault();
      setOpen((open) => !open);
    },
    { enabled: enableHotKeys },
    { enableOnContentEditable: false }
  );

  React.useEffect(() => {
    if (!open) return;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <CommandMenuTrigger
        onClick={() => {
          setOpen(true);
        }}
      />

      <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={false} className="border">
        <div className="">
          <CommandMenuInput />
        </div>
        <div className="">
          <div className="ring-border overflow-hidden border-y dark:bg-zinc-900">
            <CommandList className="supports-timeline-scroll:scroll-fade-effect-y scrollbar-hide min-h-80 dark:bg-zinc-900">
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandLinkGroup
                heading="Menu"
                links={MENU_LINKS}
                onLinkHighlight={handleLinkHighlight}
                onLinkSelect={handleOpenLink}
              />
              <CommandLinkGroup
                heading="Portfolio"
                links={PORTFOLIO_LINKS}
                onLinkHighlight={handleLinkHighlight}
                onLinkSelect={handleOpenLink}
              />

              {componentsGroup}

              {/* <CommandLinkGroup
                heading="Blog"
                links={blogLinks}
                fallbackIcon={<Newspaper />}
                onLinkHighlight={handleLinkHighlight}
                onLinkSelect={handleOpenLink}
              /> */}

              <CommandLinkGroup
                heading="Social Links"
                links={SOCIAL_LINK_ITEMS}
                onLinkHighlight={handleLinkHighlight}
                onLinkSelect={handleOpenLink}
              />

              <CommandGroup heading="Theme">
                <CommandMenuItem
                  keywords={['theme']}
                  onHighlight={handleCommandHighlight}
                  onSelect={createThemeHandler('light')}
                >
                  <SunMedium />
                  Light
                </CommandMenuItem>
                <CommandMenuItem
                  keywords={['theme']}
                  onHighlight={handleCommandHighlight}
                  onSelect={createThemeHandler('dark')}
                >
                  <MoonStarIcon />
                  Dark
                </CommandMenuItem>
                <CommandMenuItem
                  keywords={['theme']}
                  onHighlight={handleCommandHighlight}
                  onSelect={createThemeHandler('system')}
                >
                  <MonitorIcon />
                  System
                </CommandMenuItem>
              </CommandGroup>

              <CommandLinkGroup
                heading="Other"
                links={OTHER_LINK_ITEMS}
                onLinkHighlight={handleLinkHighlight}
                onLinkSelect={handleOpenLink}
              />
            </CommandList>
          </div>
        </div>
        <CommandMenuFooter selectedCommandKind={selectedCommandKind} />
      </CommandDialog>
    </>
  );
};

export default CommandMenu;

function CommandMenuTrigger({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="command-menu-trigger"
      className="text-muted-foreground hover:bg-background hover:text-muted-foreground dark:hover:bg-input/30 gap-1.5 rounded-sm pl-2 shadow-none select-none"
      variant="outline"
      size="sm"
      {...props}
    >
      <Search />

      <span className="font-sans text-sm/4 font-medium sm:hidden">Search…</span>

      <KbdGroup className="hidden sm:in-[.os-macos_&]:flex">
        <Kbd className="w-5 min-w-5">⌘</Kbd>
        <Kbd className="w-5 min-w-5">K</Kbd>
      </KbdGroup>

      <KbdGroup className="hidden sm:not-[.os-macos_&]:flex">
        <Kbd>Ctrl</Kbd>
        <Kbd className="w-5 min-w-5">K</Kbd>
      </KbdGroup>
    </Button>
  );
}

function CommandMenuInput() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <CommandInput
      placeholder="Type a command or search…"
      value={searchValue}
      onValueChange={setSearchValue}
    />
  );
}

function CommandMenuItem({
  children,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void;
  'data-selected'?: string;
  'aria-selected'?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-selected' &&
        ref.current?.getAttribute('aria-selected') === 'true'
      ) {
        onHighlight?.();
      }
    });
  });

  return (
    <CommandItem ref={ref} {...props}>
      {children}
    </CommandItem>
  );
}

function CommandLinkGroup({
  heading,
  links,
  fallbackIcon,
  onLinkHighlight,
  onLinkSelect,
}: {
  heading: string;
  links: CommandLinkItem[];
  fallbackIcon?: React.ReactElement;
  onLinkHighlight: (link: CommandLinkItem) => void;
  onLinkSelect: (href: string, openInNewTab?: boolean) => void;
}) {
  return (
    <CommandGroup heading={heading}>
      {links.map((link) => {
        const icon = link?.icon ?? fallbackIcon;

        const renderedIcon = !icon
          ? null
          : typeof icon === 'function'
            ? // ComponentType — render it
              React.createElement(icon as React.ComponentType<React.SVGProps<SVGElement>>)
            : // ReactElement — use as-is
              icon;

        return (
          <CommandMenuItem
            key={link.href}
            keywords={link.keywords}
            onHighlight={() => onLinkHighlight(link)}
            onSelect={() => onLinkSelect(link.href, link.openInNewTab)}
          >
            {renderedIcon}
            <p className="line-clamp-1">{link.title}</p>
            {link.shortcut && (
              <CommandShortcut className="font-mono tracking-[0.2em] max-sm:hidden">
                {link.shortcut}
              </CommandShortcut>
            )}
          </CommandMenuItem>
        );
      })}
    </CommandGroup>
  );
}

const ENTER_ACTION_LABELS: Record<CommandKind, string> = {
  command: 'Run Command',
  page: 'Go to Page',
  link: 'Open Link',
  component: 'Go to Component',
  block: 'Go to Block',
};

function CommandMenuFooter({ selectedCommandKind }: { selectedCommandKind: CommandKind | null }) {
  return (
    <>
      <div className="flex h-10" />

      <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-end gap-2 rounded-b-2xl px-4 text-xs font-medium">
        <div className="flex items-center gap-1 divide-x-1 max-sm:hidden">
          <CommandMenuFooterItem label="Navigate" icon={ArrowUpDown} />
          <CommandMenuFooterItem
            label={ENTER_ACTION_LABELS[selectedCommandKind ?? 'page']}
            icon={CornerDownLeftIcon}
          />
          <CommandMenuFooterItem label="Exit" icon={'Esc'} />
        </div>
      </div>
    </>
  );
}

function CommandMenuFooterItem({
  label,
  icon: Icon,
}: {
  label: string;
  icon: LucideIcon | string;
}) {
  return (
    <div className="flex items-center gap-1 pr-1 max-sm:hidden">
      <span>{label}</span>
      <Kbd>{typeof Icon === 'string' ? Icon : <Icon />}</Kbd>
    </div>
  );
}
