# AGENTS.md - harshalvk.com Portfolio

## Project Identity

**harshalvk.com** is a personal developer portfolio featuring:

- Interactive component registry (shadcn/ui)
- Technical blog with LLM-friendly content
- Theia - interactive algorithm visualization platform
- Modern Next.js 16, React 19, TypeScript stack

Live site: https://harshalvk.com
Core philosophy: Experimental portfolio showcasing technical depth and content creation.

---

## Quick Navigation

| Document                  | When to Read                                                  |
| ------------------------- | ------------------------------------------------------------- |
| **AGENTS.md** (this file) | Always - entry point for agents and contributors              |
| **CLAUDE.md**             | Technical standards, coding conventions, development commands |
| **README.md**             | Project setup, architecture overview, feature list            |

---

## Technical Context

### Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **UI:** React 19, Tailwind CSS, shadcn/ui primitives
- **State:** Jotai (global), React Query (server state), React Hook Form (forms)

### Architecture

- Feature modules in `src/modules/` instead of route-based organization
- Component registry for reusable UI primitives
- MDX-based blog content system
- LLM-friendly content endpoints (`/llms.txt`, `/r/{name}.json`)

---

## Key Directories

```
src/
├── app/                    # Next.js routes
│   ├── (app)/              # Main app routes
│   │   ├── (pages)/        # Blog, portfolio pages
│   │   └── layout.tsx      # App layout
│   ├── (llms)/             # LLM-friendly content
│   └── (rss)/              # RSS feeds
├── components/             # Shared UI components
│   └── ui/                 # shadcn/ui primitives
├── modules/                # Feature modules
│   ├── portfolio/          # Portfolio pages
│   ├── blog/               # Blog content system
│   ├── doc/                # Documentation
│   └── theia/              # Algorithm visualizations
├── registry/               # Component registry definitions
├── lib/                    # Utilities and helpers
├── hooks/                  # Custom React hooks
├── actions/                # Server actions
└── styles/                 # CSS and global styles
```

---

## Common Task Workflows

### Adding New Components

1. Create component in `src/components/` or appropriate module
2. Add to `components.json` for registry exposure
3. Add documentation in `src/components/[name]/` if needed
4. Export from `src/components/index.ts` if shared
5. Run `pnpm registry:build` to regenerate registry

### Adding Blog Posts

1. Create MDX file in `src/app/(app)/(pages)/blog/`
2. Follow existing frontmatter format (title, date, description, tags)
3. Add to content collections if needed
4. Ensure proper metadata for SEO/LLM consumption

### Adding Theia Visualizations

1. Create visualization in `src/modules/theia/`
2. Add route in `src/app/(app)/(pages)/theia/`
3. Follow existing visualization patterns
4. Add documentation and controls as needed

### Working with Component Registry

```bash
pnpm registry:build       # Rebuild component registry
pnpm registry:validate    # Validate registry integrity
```

---

## Available Agents

| Agent               | Role                          | When to Use                                                                     |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `blog-researcher`   | Research specialist           | Finding statistics, verifying sources, discovering images, competitive analysis |
| `blog-writer`       | Content generation specialist | Writing optimized blog articles with proper structure                           |
| `blog-reviewer`     | Quality assessment            | Running 100-point scoring, identifying issues by severity                       |
| `blog-seo`          | SEO optimization              | Validating on-page SEO elements post-writing                                    |
| `blog-translator`   | Translation specialist        | Native-quality translations with format preservation                            |
| `blog-multilingual` | Orchestration                 | Multi-language blog content workflow                                            |
| `dataviz`           | Data visualization            | Creating charts, graphs, and visualizations                                     |
| `general-purpose`   | Multi-step tasks              | Complex research, search, and execution                                         |
| `Plan`              | Implementation planning       | Designing strategies for complex tasks                                          |
| `Explore`           | Read-only search              | Broad file/directory searches for conclusions only                              |

---

## Content Guidelines

- **Style:** lowercase everywhere, no fluff, short sentences
- **Voice:** casual-technical, share opinions sparingly, explain jargon simply
- **Platform rules:** Different guidelines for Twitter/X threads, blog posts, teaching posts
- **Topics:** distributed systems, backend/databases, AI agents/LLMs, Go, system design, web3/Solana

**Key writing rules:**

- First person narrative
- Minimal em dashes (use commas or parentheses instead)
- Answer-first formatting for technical content
- Natural readability over formal tone

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Run tests
pnpm test

# Component registry operations
pnpm registry:build
pnpm registry:validate
```

---

## LLM-Friendly Content

The project provides LLM-accessible content through:

- `/llms.txt` - Structured portfolio information
- `/<section>/<slug>.mdx` - Markdown documents
- `/r/{name}.json` - Component registry entries

When modifying content, ensure these endpoints remain functional and up-to-date.

---

## Common Pitfalls

- **Don't mix feature module code with route components** - Keep modules self-contained
- **Ensure blog MDX follows existing frontmatter pattern** - Check existing posts for format
- **Component registry requires rebuild after changes** - Run `pnpm registry:build`
- **Avoid duplicating information from CLAUDE.md** - Cross-reference instead
- **Don't skip source verification for statistics** - Tier 1-3 sources only

---

## Related Documentation

- **CLAUDE.md** - Comprehensive development guidelines, coding standards, git practices
- **README.md** - Project overview, features, and setup instructions
- **.claude/settings.local.json** - Permission settings for this session

---

_This file is automatically loaded by Claude Code at the start of each session._
