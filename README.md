<!-- # [harshalvk.com](https://harshalvk.com) -->

<p>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/header/dots.svg?title=harshalvk.com&subtitle=My+personal+developer+portfolio+and+a+place+where+I+experiment+with+interactive+web+experiences.&logo=https%3A%2F%2Fres.cloudinary.com%2Fdev-work%2Fimage%2Fupload%2Fv1788246815%2Fdf6b767f-a8cb-4288-ab5a-4fe76c0c748a.png&size=wide&mode=dark&theme=zinc&brand=harshalvk" /><img alt="header" src="https://shieldcn.dev/header/dots.svg?title=harshalvk.com&subtitle=My+personal+developer+portfolio+and+a+place+where+I+experiment+with+interactive+web+experiences.&logo=https%3A%2F%2Fres.cloudinary.com%2Fdev-work%2Fimage%2Fupload%2Fv1788246815%2Fdf6b767f-a8cb-4288-ab5a-4fe76c0c748a.png&size=wide&mode=dark&theme=zinc&brand=harshalvk" /></picture>
</p>

<p>
<a href="https://github.com/harshalvk/harshalvk.com"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/harshalvk/harshalvk.com/license.svg?variant=secondary&amp;mode=dark"><img alt="badge" src="https://shieldcn.dev/github/harshalvk/harshalvk.com/license.svg?variant=secondary&amp;mode=light"></picture></a>
 <a href="https://github.com/harshalvk/harshalvk.com"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/views/repo/harshalvk/harshalvk.com.svg?variant=secondary&amp;mode=dark"><img alt="badge" src="https://shieldcn.dev/views/repo/harshalvk/harshalvk.com.svg?variant=secondary&amp;mode=light"></picture></a>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/badge/Agent--friendly-AGENTS.md.svg?variant=secondary&amp;mode=dark"><img alt="badge" src="https://shieldcn.dev/badge/Agent--friendly-AGENTS.md.svg?variant=secondary&amp;mode=light"></picture>
</p>

# harshalvk.com

Personal portfolio, interactive component registry, technical blog, and algorithm visualization platform built with Next.js.

**Live:** [harshalvk.com](https://harshalvk.com)

<img width="1280" height="720" alt="image" src="https://github.com/user-attachments/assets/caa440f2-a724-479e-ae11-104e0b33b7b0" />

## Overview

`harshalvk.com` is my personal developer portfolio and a place where I experiment with interactive web experiences, reusable UI components, technical content, and algorithm visualizations.

The project is built with a focus on:

- Performance
- Type safety
- Interactive UI
- Developer experience
- Accessible components
- Static generation where possible
- Markdown/MDX-powered content
- Reusable component architecture

The site is divided into several sections:

- **Portfolio** — About, experience, projects, technologies, and contact
- **Components** — A collection of reusable React/shadcn components
- **Blog** — Technical writing and notes
- **Theia** — Interactive algorithm and data-structure visualizations

---

## Theia

**Theia** is an interactive algorithm visualization and learning environment built directly into the portfolio.

It is designed around the idea that algorithms are easier to understand when you can see every step of their execution rather than only reading their implementation.

> Interactive algorithm visualizations and computer science concepts.

### What Theia includes

- Sorting algorithm visualizations
- Linked-list simulations
- Machine-learning algorithm visualizations
- DSA problem visualizations
- Step-by-step algorithm execution
- Interactive algorithm playgrounds
- Algorithm-specific explanations and documentation

### Theia routes

| Section              | Description                               |
| -------------------- | ----------------------------------------- |
| `/theia`             | Theia dashboard                           |
| `/theia/sorting`     | Sorting algorithm visualizations          |
| `/theia/linked-list` | Interactive linked-list simulation        |
| `/theia/ml`          | Machine-learning algorithm visualizations |
| `/theia/problems`    | DSA problem visualizations                |

The application generates dedicated pages for individual algorithms and supports both standard algorithms and ML algorithms through the same visualization system.

---

## Component Registry

The project also contains a reusable component registry built around **shadcn/ui**.

Components can be browsed from:

```text
https://harshalvk.com/components
```

The registry currently includes components such as:

- Wallet Adapter
- Key Screen
- Masonry Feed
- Drag To Confirm
- Scratch Card
- Component Playground
- ASCII Dither

The project exposes its shadcn registry through:

```text
https://harshalvk.com/r/{name}.json
```

This makes the components installable and reusable outside the portfolio itself.

---

## Features

<table>
  <tr>
    <td valign="top" align="left">
      <strong>Portfolio</strong><br>
      • Hero section<br>
      • About<br>
      • Experience<br>
      • Projects<br>
      • GitHub contributions<br>
      • Technology stack<br>
      • Contact form
    </td>
    <td valign="top" align="left">
      <strong>Interactive Components</strong><br>
      • Component documentation<br>
      • Live examples<br>
      • Interactive demos<br>
      • Source implementation<br>
      • Categorization
    </td>
    <td valign="top" align="left">
      <strong>GitHub Integration</strong><br>
      • Recent commits<br>
      • Commit messages<br>
      • Commit authors<br>
      • Commit hashes<br>
      • Commit dates<br>
      • Repository history
    </td>
  </tr>
  <tr>
    <td valign="top" align="left">
      <strong>MDX Content</strong><br>
      • Markdown/MDX documentation<br>
      • Blog content<br>
      • Component documentation<br>
      • LLM-friendly markdown routes
    </td>
    <td valign="top" align="left">
      <strong>LLM-friendly Content</strong><br>
      • <code>llms.txt</code> endpoint<br>
      • Structured portfolio information<br>
      • Blog and component metadata<br>
      • LLM-readable documentation
    </td>
    <td valign="top" align="left">
      <strong>Dynamic OG Images</strong><br>
      • Dynamic page OG images<br>
      • Blog and component OG images<br>
      • Theia OG images<br>
      • Custom titles and descriptions<br>
      • Shared OG design
    </td>
  </tr>
</table>

---

## Tech Stack

<table>
  <tr>
    <td valign="top" align="left">
      <strong>Framework</strong><br>
      • Next.js 16<br>
      • React 19<br>
      • TypeScript
    </td>
    <td valign="top" align="left">
      <strong>Styling</strong><br>
      • Tailwind CSS<br>
      • shadcn/ui<br>
      • Radix UI<br>
      • Tailwind Typography<br>
      • Prettier Tailwind plugin
    </td>
    <td valign="top" align="left">
      <strong>MDX</strong><br>
      • next-mdx-remote<br>
      • remark-gfm<br>
      • remark-mdx<br>
      • gray-matter<br>
      • Shiki
    </td>
  </tr>
  <tr>
    <td valign="top" align="left">
      <strong>UI & Interaction</strong><br>
      • Motion<br>
      • Lucide React<br>
      • React Hotkeys Hook<br>
      • Sonner<br>
      • Jotai<br>
      • React Hook Form
    </td>
    <td valign="top" align="left">
      <strong>Data & Validation</strong><br>
      • Zod<br>
      • TanStack Query<br>
      • PapaParse
    </td>
    <td valign="top" align="left">
      <strong>Web3</strong><br>
      • Solana Wallet Adapter<br>
      • Phantom<br>
      • Solflare
    </td>
  </tr>
  <tr>
    <td valign="top" align="left">
      <strong>Infrastructure</strong><br>
      • Vercel<br>
      • Vercel Analytics<br>
      • Resend
    </td>
    <td></td>
    <td></td>
  </tr>
</table>

## Project Structure

The application is organized around feature modules rather than putting all application logic directly inside the Next.js routes.

```text
├── src/
│   ├── actions/
│   │
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── (docs)/
│   │   │   ├── (pages)/
│   │   │   │   ├── blog/
│   │   │   │   ├── components/
│   │   │   │   ├── projects/
│   │   │   │   └── theia/
│   │   │   └── layout.tsx
│   │   │
│   │   └── (llms)/
│   │       ├── doc.mdx/
│   │       └── llms.txt/
│   │
│   ├── components/
│   │   ├── shared/
│   │   └── ui/
│   │
│   ├── config/
│   │
│   ├── lib/
│   │
│   ├── modules/
│   │   ├── doc/
│   │   ├── portfolio/
│   │   └── theia/
│   │
│   ├── registry/
│   │   └── components/
│   │
│   ├── scripts/
│   │
│   └── styles/
│
├── public/
│
├── components.json
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have:

- Node.js
- pnpm
- Git

installed on your machine.

### Clone the repository

```bash
git clone https://github.com/harshalvk/harshalvk.com.git

cd harshalvk.com
```

### Install dependencies

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Component Registry

The project uses the shadcn registry format.

The registry configuration is defined in:

```text
components.json
```

The registry is exposed under:

```text
https://harshalvk.com/r/{name}.json
```

The registry metadata is generated from the project's component definitions.

To rebuild the registry:

```bash
pnpm registry:build
```

To validate it:

```bash
pnpm registry:validate
```

---

## LLM Support

The project exposes content specifically for LLM consumption.

### `llms.txt`

```text
https://harshalvk.com/llms.txt
```

The endpoint contains structured information about:

- Harshal
- Technology stack
- Portfolio sections
- Blog posts
- Components
- Theia

### Markdown documents

Individual documentation pages can also be accessed as markdown.

```text
https://harshalvk.com/<section>/<slug>.mdx
```

The application internally maps these requests to the document system and returns markdown content.

---

## SEO & Metadata

The application includes:

- Dynamic metadata
- Canonical URLs
- Open Graph metadata
- Twitter cards
- JSON-LD structured data
- Dynamic sitemap
- Dynamic OpenGraph image
- `robots.txt`

The sitemap is generated dynamically from:

- Static routes
- Blog documents
- Component documents

---

## Development Philosophy

This project is intentionally built as more than a traditional portfolio.

The goal is to use the portfolio itself as a place to experiment with:

- Interactive interfaces
- Developer tooling
- Algorithm visualization
- Component systems
- Web performance
- Content architecture
- AI/LLM-friendly web content
- Modern React and Next.js patterns

Theia is part of that philosophy: instead of only listing projects and technologies, the site provides interactive demonstrations of concepts that are useful to developers and computer-science students.

---

## Contributing

This is primarily a personal project, but issues, suggestions, and improvements are welcome.

If you find a bug or have an idea for Theia or the component registry, feel free to open an issue or submit a pull request.

---

## AI-Agent Friendliness

This project is designed to be accessible and usable by AI coding agents through:

- **AGENTS.md**: Entry point that defines project identity, tech stack, architecture, and common workflows
- **CLAUDE.md**: Technical standards, coding conventions, and development commands
- **.agents/skills/**: Project-specific skills like the registry-icon-generator for creating Lucide-style SVG icons
- **.agents/AGENT-WORKFLOWS.md**: Detailed procedures for common tasks (adding components, blog posts, Theia visualizations, etc.)
- **LLM-friendly endpoints**: `/llms.txt` for structured portfolio information and `/r/{name}.json` for component registry access

These resources enable AI agents to understand project conventions, perform standard development tasks, and contribute effectively while maintaining consistency with the project's design philosophy.

## License

Unless otherwise specified, the source code and content of this project are maintained by Harshal V Khobragade.

Please check individual files and components for their applicable licensing information.

---

## Author

**Harshal Vasant Khobragade**

Full-Stack Developer

- Website: https://harshalvk.com
- GitHub: https://github.com/Harshalvk
- X: [https://x.com/harshalvk\_](https://x.com/harshalvk_)
- LinkedIn: https://www.linkedin.com/in/harshalvk/

---

<div align="center">
## Stats
  
![Stats](https://repobeats.axiom.co/api/embed/1d52a6e9f1a590c6d87eced843a6efdc9b851a81.svg "Repobeats analytics image")
</div>

<p align="center">
  Built and maintained by <strong>Harshal V Khobragade</strong>.
</p>
