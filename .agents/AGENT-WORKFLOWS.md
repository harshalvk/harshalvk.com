# Agent Workflows for harshalvk.com Portfolio

This document outlines standard procedures for common development tasks using the available agents and skills in this repository. These workflows are designed to make the project more AI-agent friendly by providing clear, repeatable processes.

## Available Agents & Skills Reference

### Agents

- **blog-researcher**: Finds statistics, verifies sources, discovers images, competitive analysis
- **blog-writer**: Writes optimized blog articles with proper structure
- **blog-reviewer**: Runs 100-point scoring system, identifies issues by severity
- **blog-seo**: Validates on-page SEO elements post-writing
- **blog-translator**: Produces native-quality translations with format preservation
- **blog-multilingual**: Orchestration for multi-language blog content
- **dataviz**: Creates charts, graphs, and visualizations
- **general-purpose**: Complex research, search, and execution tasks
- **Plan**: Designs implementation strategies for complex tasks
- **Explore**: Broad file/directory searches for conclusions only
- **registry-icon-generator**: Generates Lucide-style SVG icons for components

### Skills

- **registry-icon-generator**: Located at `.agents/skills/harshalvk-registry-icon-generator/SKILL.md`
  - Generates hand-drawn, Lucide-style outline SVG icons for components
  - Based on component's `.mdx` documentation under `/src/app/modules/doc/content/**`
  - Adds icons to shared file at `/src/components/icons/icons.tsx`

## Standard Workflows

### 1. Adding New Components

When adding a new component to the registry:

#### Step 1: Research & Planning (Use Plan agent)

- Prompt: "Plan the implementation of a [component-type] component for the harshalvk.com portfolio registry"
- Output: Step-by-step plan, identifies critical files, considers architectural trade-offs

#### Step 2: Create Component Files

- Create component in `src/registry/components/[component-name]/[component-name].tsx`
- Add proper TypeScript interfaces, props, and implementation
- Follow existing patterns from similar components

#### Step 3: Add Documentation (Optional but recommended)

- Create MDX file in `src/modules/doc/content/[component-name].mdx`
- Include frontmatter: title, description, image, category, createdAt/updatedAt
- Add ComponentPreview, Features, Installation, Usage, API Reference, Notes sections

#### Step 4: Generate Icon (Use registry-icon-generator skill)

- Prompt: "Generate an icon for the [component-name] component"
- The skill will:
  1. Read the MDX documentation from `src/modules/doc/content/[component-name].mdx`
  2. Extract visual concept from title, description, and features
  3. Draw a Lucide-style SVG icon (2-8 primitive elements)
  4. Add it to `src/components/icons/icons.tsx` in camelCase format

#### Step 5: Register Component

- Add entry to `src/registry/components/_registry.ts`
- Include name, type, title, description, files, categories, docs link

#### Step 6: Add Example (Optional)

- Create demo in `src/registry/examples/[component-name]-demo.tsx`
- Add to `src/registry/examples/_registry.ts`

### 2. Adding Blog Posts

When adding new blog content:

#### Step 1: Research (Use blog-researcher agent)

- Prompt: "Research current statistics and sources for [blog topic] as of 2025-2026"
- The agent will find tier 1-3 sources, verify facts, discover relevant images

#### Step 2: Write Content (Use blog-writer agent)

- Prompt: "Write an optimized blog article about [topic] with answer-first formatting, proper heading hierarchy, and sourced statistics"
- Output follows the 6 pillars of dual optimization (human + LLM friendly)

#### Step 3: Review Quality (Use blog-reviewer agent)

- Prompt: "Run the 100-point scoring system on the blog draft and identify issues by severity"
- Checks for AI editorial style, source quality, unsupported claims

#### Step 4: SEO Optimization (Use blog-seo agent)

- Prompt: "Validate on-page SEO elements for the blog post and provide specific fixes"
- Validates title tag, meta description, heading hierarchy, internal/external links, etc.

#### Step 5: Add to Repository

- Create MDX file in `src/app/(app)/(pages)/blog/[slug].mdx`
- Follow existing frontmatter format (title, date, description, tags)
- Ensure proper metadata for SEO/LLM consumption

#### Step 6: Translation (Optional)

- Use blog-translator for native-quality translations
- Use blog-multilingual for orchestration of multiple languages

### 3. Adding Theia Visualizations

When adding new algorithm visualizations:

#### Step 1: Research Algorithm (Use general-purpose or dataviz agent)

- Prompt: "Research the [algorithm name] algorithm, its time/space complexity, and key visualization points"
- For complex algorithms, consider using dataviz agent for charting assistance

#### Step 2: Create Visualization

- Create visualization in `src/modules/theia/[visualization-name]/`
- Add route in `src/app/(app)/(pages)/theia/[visualization-name]/`
- Follow existing visualization patterns using React, motion, or canvas as appropriate
- Add documentation and controls as needed

#### Step 3: Add to Registry (if applicable)

- Follow component workflow if the visualization should be in the component registry

### 4. Filling Missing Icons Across Registry

When asked to backfill icons:

#### Step 1: Identify Missing Icons

- Prompt: "List all components in the registry that are missing icons"
- Compare `src/registry/components/_registry.ts` entries with keys in `src/components/icons/icons.tsx`

#### Step 2: Generate Icons Individually (Use registry-icon-generator skill)

- For each missing component, run: "Generate an icon for the [component-name] component"
- Preview all icons together before writing any to `icons.tsx`
- Get user approval on the batch before committing

### 5. Adding New Skills

When creating new project-specific skills:

#### Step 1: Identify Need

- Determine repetitive task that would benefit from automation
- Ensure it's specific to this project (not general purpose)

#### Step 2: Create Skill Directory

- Create directory: `.agents/skills/[skill-name]/`
- Add `SKILL.md` file with proper frontmatter and instructions

#### Step 3: Document Usage

- Clearly state when to use the skill
- Provide step-by-step instructions
- Include examples where helpful

#### Step 4: Test Skill

- Verify the skill works as expected
- Update documentation based on testing feedback

## Best Practices for AI-Agent Friendliness

### 1. Clear Documentation

- Keep AGENTS.md, CLAUDE.md, and README.md updated
- Document non-obvious conventions and gotchas
- Cross-reference instead of duplicating information

### 2. Consistent Patterns

- Follow established file structures and naming conventions
- Use consistent frontmatter formats for MDX files
- Maintain uniform component API patterns

### 3. Modular Design

- Keep feature modules self-contained in `src/modules/`
- Avoid mixing feature module code with route components
- Make components reusable and well-documented

### 4. LLM-Friendly Content

- Ensure `/llms.txt` and `/r/{name}.json` endpoints remain functional
- Keep MDX documentation up-to-date for icon generation
- Use clear, concise descriptions that convey visual concepts

### 5. Skill Development

- Create skills for repetitive, well-defined tasks
- Follow the template established by registry-icon-generator
- Document prerequisites, steps, and expected outputs

### 6. Type Safety

- Maintain strict TypeScript usage throughout
- Use proper interfaces and types for component APIs
- Leverage React props validation where appropriate

### 7. Testing & Validation

- Add components to registry with proper validation
- Use `pnpm registry:build` and `pnpm registry:validate` commands
- Verify LLM-friendly endpoints work correctly

## Troubleshooting Common Issues

### Icon Generation Problems

- If mdx description is too vague, skill will fall back to reading actual component code
- Ensure title/description/features in MDX provide clear visual concept
- Follow the "one idea, not a diagram" principle for icon metaphors

### Component Registration Issues

- Verify component name matches file structure exactly
- Check that categories array contains valid strings
- Confirm docs URL follows pattern: `https://harshalvk.com/components/[name]`

### Build Failures

- Run `pnpm lint` to catch TypeScript errors early
- Verify all imports use correct paths (`@/` alias vs relative)
- Check for missing dependencies in component implementations

## Future Skill Suggestions

Consider creating these additional skills for the project:

1. **blog-workflow-agent**: Orchestrates the full blog creation process (research → write → review → SEO → publish)
2. **theia-visualizer-agent**: Assists in creating algorithm visualizations with proper step-by-step breakdowns
3. **component-doc-generator**: Automatically generates MDX documentation from component TSX files
4. **registry-validator-agent**: Validates registry integrity and suggests fixes
5. **seo-auditor-agent**: Runs comprehensive SEO audit on pages and provides fix recommendations
6. **accessibility-checker-agent**: Audits components for WCAG compliance and suggests improvements
7. **performance-optimizer-agent**: Identifies performance bottlenecks and suggests optimizations
8. **dependency-updater-agent**: Safely updates project dependencies with changelog review

These workflows and suggestions make the portfolio project more accessible to AI agents by providing clear, repeatable processes that leverage the existing agent infrastructure and skills system.
