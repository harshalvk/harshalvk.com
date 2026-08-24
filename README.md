# harshalvk.com

Personal portfolio, interactive component registry, technical blog, and algorithm visualization platform built with Next.js.

**Live:** https://harshalvk.com

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

> Step-by-step visualizations of algorithms — DSA, ML, and cryptographic — explained one move at a time.

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

### Portfolio

The main portfolio contains:

- Hero section
- About
- Experience
- Projects
- GitHub contribution information
- Technology stack
- Contact form

### Interactive Components

Reusable components are documented and presented through the component registry.

Each component can have:

- Documentation
- Live examples
- Interactive demos
- Source implementation
- Categorization

### GitHub Integration

Project pages can retrieve recent GitHub commits directly from the GitHub API.

The project pages display:

- Recent commits
- Commit messages
- Commit authors
- Commit hashes
- Commit dates
- Links to the repository history

### MDX Content

Blog and component documentation use Markdown/MDX content.

The project also exposes markdown versions of documents for LLM-friendly consumption.

For example:

```text
/components/<slug>.mdx
```

and the corresponding LLM route:

```text
/doc.mdx/<slug>
```

### LLM-friendly Content

The site exposes an `llms.txt` endpoint containing structured information about the portfolio, projects, technologies, blog posts, components, and other sections.

This makes the site easier for AI assistants and other LLM-based tools to understand.

---

## Tech Stack

### Framework

- Next.js 16
- React 19
- TypeScript

### Styling

- Tailwind CSS
- shadcn/ui
- Radix UI
- Tailwind Typography
- `prettier-plugin-tailwindcss`

### Content

- MDX
- `next-mdx-remote`
- `remark-gfm`
- `remark-mdx`
- `gray-matter`
- Shiki

### UI & Interaction

- Motion
- Lucide React
- React Hotkeys Hook
- Sonner
- Jotai
- React Hook Form

### Data & Validation

- Zod
- TanStack Query
- PapaParse

### Web3

- Solana Wallet Adapter
- Phantom
- Solflare

### Infrastructure

- Vercel
- Vercel Analytics
- Resend

---

## Project Structure

The application is organized around feature modules rather than putting all application logic directly inside the Next.js routes.

```text
.
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

<p align="center">
  Built and maintained by <strong>Harshal V Khobragade</strong>.
</p>
