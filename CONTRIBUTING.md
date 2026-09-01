# Contributing

Thank you for your interest in contributing to this project.

This repository contains a personal portfolio, documentation system, component registry, and Theia — an interactive algorithm and data-structure visualization system.

Contributions, improvements, bug reports, documentation updates, and new ideas are welcome.

## Before You Start

Before making changes:

1. Read `AGENTS.md` if you are using an AI coding agent.
2. Search the existing codebase before creating new abstractions.
3. Check existing components and utilities before adding dependencies.
4. Keep changes focused and avoid unrelated modifications.
5. Run the project's validation commands before opening a pull request.

## Development Setup

### Requirements

- Node.js 20+
- [bun](https://bun.sh/)
- Git

### Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### Install dependencies

```bash
bun install
```

### Start the development server

```bash
bun run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Project Structure

The project is organized into several major areas:

```text
src/
├── app/                 # Next.js routes and pages
├── components/          # Shared UI components
├── modules/
│   ├── doc/             # MDX document system
│   └── theia/           # Algorithm visualization system
├── registry/            # Component registry
├── config/              # Application configuration
└── lib/                 # Shared utilities
```

Refer to the relevant `AGENTS.md` files for more detailed instructions when working inside a specific module.

## Types of Contributions

You can contribute in several ways:

- Bug fixes
- New features
- UI improvements
- Documentation
- Blog posts
- New reusable components
- Theia visualizations
- Accessibility improvements
- Performance improvements
- Developer experience improvements
- Tests
- Refactoring

## Adding Documentation

Documentation and blog content use MDX.

Before adding a document:

1. Check existing documents for the expected structure.
2. Create the MDX file in the appropriate content directory.
3. Add valid frontmatter.
4. Use an appropriate category and slug.
5. Check links and formatting.
6. Run the content validation commands.

Example:

```md
---
title: Example Document
description: A short description of the document.
category: blog
createdAt: 2026-08-30
updatedAt: 2026-08-30
---
```

## Adding a Component

Before creating a new component:

1. Search `src/components`.
2. Search the component registry.
3. Check whether an existing component can be reused.
4. Follow existing naming conventions.
5. Keep the component focused.
6. Add documentation when appropriate.
7. Avoid introducing a dependency for functionality that already exists in the project.

## Adding a Theia Visualization

Theia visualizations should keep algorithmic logic separate from presentation.

When adding a new algorithm or data structure:

1. Check whether it already exists.
2. Add the algorithm implementation.
3. Add the visualization.
4. Add the required metadata.
5. Add corresponding MDX documentation.
6. Register the new visualization where required.
7. Test the visualization with different inputs.
8. Verify edge cases.
9. Run the complete validation workflow.

Follow the existing Theia implementation patterns rather than introducing a new architecture for individual visualizations.

## Code Style

Please follow the existing project conventions.

### TypeScript

Prefer:

```ts
const user = await getUser();
```

over unnecessary mutable state:

```ts
let user;

user = await getUser();
```

Use explicit types when they improve readability or prevent ambiguity.

Avoid:

```ts
any;
```

unless there is a strong reason to use it.

### React

Prefer small, composable components.

Avoid putting large amounts of business logic directly inside JSX.

Reuse existing hooks and utilities where possible.

### Styling

Use the project's existing Tailwind and component conventions.

Avoid introducing custom CSS when the existing design system can solve the problem.

## Commits

Keep commits focused and descriptive.

Recommended format:

```text
feat: add merge sort visualization
fix: correct document slug resolution
docs: add caching article
refactor: simplify document loader
perf: reduce registry build time
chore: update dependencies
```

A commit should ideally represent one logical change.

## Pull Requests

Before opening a pull request:

```bash
bun run type-check
bun run  lint
bun run format:check
bun run build
```

If the repository provides a unified verification command, prefer:

```bash
bun run verify
```

### Pull request description

Explain:

- What changed
- Why it changed
- How it was implemented
- How it was tested
- Any known limitations

For UI changes, include screenshots or recordings when useful.

## Pull Request Checklist

Before submitting:

- [ ] The change is focused and relevant.
- [ ] Existing functionality has not been unnecessarily modified.
- [ ] TypeScript passes.
- [ ] Lint passes.
- [ ] Formatting passes.
- [ ] Production build passes.
- [ ] Documentation was updated when necessary.
- [ ] No secrets or credentials were committed.
- [ ] New dependencies are justified.
- [ ] Accessibility was considered for UI changes.
- [ ] The change was tested locally.

## AI Coding Agents

AI coding agents are welcome in this repository.

When using an AI coding agent:

1. Read `AGENTS.md`.
2. Read the nearest module-specific `AGENTS.md`.
3. Search for existing implementations before creating new ones.
4. Follow existing architecture and conventions.
5. Make the smallest reasonable change.
6. Review generated code before committing.
7. Run the project's validation commands.

AI-generated code is subject to the same review and quality requirements as manually written code.

Do not use AI agents to:

- Add secrets or credentials.
- Circumvent security controls.
- Modify unrelated code.
- Remove tests simply to make CI pass.
- Introduce unnecessary dependencies.
- Copy code with incompatible licensing.

## Reporting Bugs

Please use the GitHub issue tracker for reproducible bugs.

Include:

- What happened
- What you expected
- Steps to reproduce
- Browser/runtime information when relevant
- Screenshots or logs when useful
- A minimal reproduction when possible

Do not include secrets, tokens, passwords, or private information in issues.

## Feature Requests

Feature requests are welcome.

Explain:

- The problem you are trying to solve
- Why the feature would be useful
- Your proposed solution
- Alternative solutions you considered

For larger features, open an issue before implementing them so the approach can be discussed.

## License

By contributing to this repository, you agree that your contributions will be licensed under the same license that covers the project, unless otherwise stated.

Thank you for contributing.
