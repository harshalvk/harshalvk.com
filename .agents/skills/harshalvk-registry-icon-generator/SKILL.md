---
name: registry-icon-generator
description: Generates a hand-drawn, Lucide-style outline SVG icon for a component in this project's shadcn-style registry, based on that component's .mdx documentation (under /src/app/modules/doc/content/**), and adds it to the shared icon file at /src/components/icons/icons.tsx. Use this whenever the user asks for an icon for a specific component (by name, e.g. "make an icon for key-screen" or "give the marquee component an icon"), asks to fill in missing icons across the registry, or mentions adding to icons.tsx / the doc content mdx files in this context. Falls back to reading the component's actual code under /src/app/registry/components/** only when the mdx description is too vague to draw from.
---

# Registry Icon Generator

Draws a single small outline icon that visually represents what a registry component _does_, in the same visual language as this project's other icons, and appends it to the shared `Icons` map so it's immediately usable everywhere else in the app.

The hard part of this task isn't the SVG syntax — it's translating a component's purpose ("floating overlay that displays keypresses") into one clear, simple visual metaphor (a keycap, or an overlay corner + a key). Spend your thinking there, not on making the shape ornate.

## Step 1: Find and read the component's mdx

Component names are usually given as a slug (`key-screen`) or a human title ("Key Screen") — normalize to kebab-case and look under:

```
/src/app/modules/doc/content/**/<slug>.mdx
```

If you can't find an exact match, search the directory for a close filename match before asking the user.

Every mdx file in this project follows the same shape — pull your icon concept from these fields, in priority order:

1. **`title`** and **`description`** in the frontmatter — this is the one-line pitch, usually enough on its own.
2. **`## Features`** bullet list — this is where the concrete, visual behavior lives (e.g. "renders the active key combo as styled keycaps", "five anchor positions"). This is often more useful for icon ideas than the description, since it's concrete rather than marketing copy.
3. **`## Notes`** — occasionally has a detail worth drawing (e.g. a shape, a direction, a state).

Ignore installation/usage/API-reference sections — they're implementation detail, not visual concept.

## Step 2: Decide if you need the code (fallback only)

Most of the time, title + description + features is enough to picture the component. Only read the actual component code at:

```
/src/app/registry/components/**/<slug>.tsx
```

when the mdx leaves the _visual_ concept genuinely ambiguous — e.g. the description is abstract ("a flexible layout primitive"), or several very different components could share the same description. Don't read the code out of habit; it costs time and rarely changes the icon concept once the mdx has a Features list.

## Step 3: Pick one visual metaphor

Before writing any SVG, state in a sentence what the icon depicts. Rules of thumb:

- **One idea, not a diagram.** Pick the single most identifying detail from Step 1 rather than trying to represent every feature. `key-screen` → a keycap (a rounded square with a small mark inside), not a keycap _plus_ a cursor _plus_ corner-anchor arrows.
- **Prefer concrete nouns over abstractions.** If the component wraps or displays something concrete (a key, a card, a toast, a cursor, a badge), draw that thing. If it's a pure behavior (e.g. "auto-scrolling"), draw the object it acts on plus a motion cue (a short arrow, a couple of motion lines) rather than an abstract swirl.
- **Reuse the existing icon set's vocabulary where relevant.** Skim a few entries already in `icons.tsx` for shapes/motifs already established (e.g. if there's already a "cursor" or "card" icon elsewhere in the file, reuse that same construction for consistency rather than inventing a new way to draw a cursor).

## Step 4: Draw it in the project's outline style

Match Lucide/Heroicons outline conventions exactly, since that's what this registry uses:

- `viewBox="0 0 24 24"`, `fill="none"`
- `stroke="currentColor"`, `strokeWidth={1.5}`, `strokeLinecap="round"`, `strokeLinejoin="round"`
- Keep all geometry inside roughly a 2–22 range on both axes (Lucide's standard padding) — don't touch the edges of the 24×24 box.
- Budget 2–8 primitive elements for simple concepts, up to ~12 for detailed ones. Don't artificially limit yourself to 5 if the concept needs more — the goal is clarity, not minimalism for its own sake.
- Fill can be used on sub-elements (circles for toggles, small rects for chips/details) to add visual depth, but the primary shapes stay outlined.

**Modern, polished aesthetic — what "good" looks like:**

- **Avoid flat 1-primitive icons.** A single `rect` or `circle` feels generic. Combine 3–6 shapes that each communicate a distinct part of the concept.
- **Add subtle details that tell the story.** A wallet icon isn't just a rectangle — it has a flap line, a chip, contactless waves. A drag-to-confirm icon isn't just a bar — it has a filled track segment and an arrow inside the thumb.
- **Use `rx`/`ry` for rounded corners on every rect** — even small ones (0.5–1.5). This is what makes icons feel modern vs. dated.
- **Vary sizes intentionally.** Columns of different heights (masonry), overlapping elements (scratch card flap over card), or different-sized circles (thumb vs. track) create visual interest without adding complexity.
- **Fill sub-elements sparingly.** Use `fill="currentColor"` on small accent shapes (chips, toggles, thumbs, filled track portions) to create contrast against outlined shapes. The eye should land on a hierarchy: one filled element as focal point, rest outlined.
- **Directional cues matter.** Arrows, filled-progress segments, and asymmetric layouts communicate _action_ and _state_, not just static objects.
- **Leave breathing room.** Don't push shapes to the edges. 1.5–2px padding around the bounding box of your content is the sweet spot.
- \**Don't copy path data from any existing icon library (Lucide, Heroicons, Feather, etc.) verbatim — construct your own coordinates in the same *style\*. Copying exact path data reproduces someone else's copyrighted work; matching the stroke/geometry conventions does not.

## Step 4.5: Verify coordinate precision

Before previewing, double-check that all coordinates:

- Use decimals only where needed (`.5` for half-pixels, `1.5` for rounded rects, not whole numbers when a half-pixel gives better spacing)
- Leave at least 1px gap between adjacent shapes so they don't visually merge at small sizes
- Are symmetric or intentionally asymmetric — avoid accidental off-by-one errors

## Step 5: Preview before writing anything

Render the icon (e.g. via the visualizer, at a larger scale like 96×96 for visibility) and show it to the user before touching `icons.tsx`. Icon design is subjective and quick to get wrong on the first try — a 10-second look prevents writing a bad shape into a shared file that other code will start depending on. If the user gives feedback, iterate on the preview, not on the file.

## Step 6: Add it to icons.tsx

Once approved, read `/src/components/icons/icons.tsx` and:

1. **Match the key naming already in use.** Convert the slug to camelCase (`key-screen` → `keyScreen`).
2. **Match the entry shape exactly** — same `(props: IconProps) => (...)` signature, `aria-hidden`, and `{...props}` spread as the other entries in the file.
3. **Use `strokeWidth={1.5}`** (not 2) unless the icon is conceptually very bold/heavy.
4. **Insert as a new property in the existing `Icons` object**, right before the closing brace, so it reads as a natural continuation of the list rather than reordering anything that's already there.
5. Use `str_replace` to insert it — don't rewrite the whole file.

**Examples of the target quality level:**

```tsx
// Good: layered, detailed, tells the story
masonryFeed: (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="5.5" height="10" rx="1" />
    <rect x="2" y="14.5" width="5.5" height="7" rx="1" />
    <rect x="8.5" y="3" width="5.5" height="14" rx="1" />
    <rect x="8.5" y="18" width="5.5" height="3.5" rx="1" />
    <rect x="15" y="3" width="5" height="8" rx="1" />
    <rect x="15" y="12" width="5" height="11.5" rx="1" />
  </svg>
),

// Good: filled accent + directional cue
walletAdapter: (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="17" height="14" rx="2" />
    <path d="M2 9 L19 9" />
    <rect x="5" y="12" width="3.5" height="3" rx="0.5" fill="currentColor" />
    <path d="M16 11.5 A2 2 0 0 1 16 15.5" />
    <path d="M17.5 10.5 A4 4 0 0 1 17.5 16.5" />
  </svg>
),

// Good: filled track + interactive thumb with arrow
dragToConfirm: (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="9" width="20" height="6" rx="3" />
    <rect x="2" y="9" width="13" height="6" rx="3" fill="currentColor" />
    <circle cx="15" cy="12" r="4" fill="#0f0f1a" stroke="currentColor" />
    <path d="M13.5 12 L16 12 M15 10.5 L16.5 12 L15 13.5" />
  </svg>
),
```

Bad examples to avoid:

```tsx
// Too simple — single shape, no story
square: (props) => (
  <svg>
    ...
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);

// Wrong stroke width — looks heavy and dated at small sizes
heavy: (props) => <svg>... strokeWidth={3} ...</svg>;
```

Example entry shape to match (yours will differ in content, not structure):

```tsx
keyScreen: (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
    <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 13h.01M12 13h.01M15 13h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
),
```

## Step 7: Confirm

After editing, tell the user the key name you added it under (e.g. `Icons.keyScreen`) so they know how to reference it, and mention the file path you wrote to. Don't dump the whole updated file back into the chat — they can see the diff.

## Doing this for many components at once

If asked to backfill icons for every component missing one: list the mdx files, cross-reference against existing keys in `icons.tsx` to find gaps, then go through Steps 1–5 for each one individually — preview _all_ of them together before writing any of them to `icons.tsx`, so the user can review the whole batch in one pass rather than approving one at a time.
