# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev              # Start development server at localhost:3000
npm run build            # Build production bundle
npm start                # Run production build locally
npm run lint             # Run ESLint
npm run analyze          # Build with bundle analyzer (opens visualization in browser)
npm run convert-blogs    # Convert .md files from public/blogs to MDX in content/blog
```

### Blog Content Workflow
1. Add new `.md` files to `public/blogs/`
2. Run `npm run convert-blogs` to process them into MDX format
3. Script automatically:
   - Extracts metadata (title, excerpt, tags) from markdown
   - Generates frontmatter with date based on file modification time
   - Moves converted `.mdx` files to `content/blog/`
   - Deletes original `.md` files from `public/blogs/`
   - Auto-infers tags from content keywords (React, Next.js, TypeScript, etc.)

## Architecture

### Project Structure
- **`app/`** - Next.js App Router pages (home, about, projects, blog, reads)
- **`components/`** - Organized by purpose:
  - `layout/` - Header (desktop pills sidebar + mobile menu), Footer
  - `ui/` - Reusable UI (ThemeSwitcher, RotatingCursor, MobileShapes, AdaptiveFavicon)
  - `animations/` - LoadingScreen with animations
  - `three/` - Three.js/R3F particle effects (ParticleWrapper)
  - `home/`, `blog/` - Page-specific components
  - `providers/` - ThemeProvider (next-themes wrapper)
- **`lib/`** - Data sources and utilities:
  - `mdx.ts` - Blog post parsing, metadata extraction, TOC generation
  - `projects.ts` - Projects data array with helper functions
  - `reads.ts` - Weekly reads data array with helper functions
- **`content/`** - Content files:
  - `blog/` - MDX blog posts with frontmatter (title, date, excerpt, tags)
  - `projects/` - Project-related assets (currently unused)
- **`scripts/`** - Utility scripts (blog conversion)
- **`public/`** - Static assets (favicons, site.webmanifest)

### Key Technologies
- **Framework**: Next.js 16.1 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **Content**: MDX via next-mdx-remote, gray-matter, Shiki syntax highlighting
- **Animation**: Framer Motion (page transitions, micro-interactions)
- **3D Graphics**: Three.js + @react-three/fiber (particle backgrounds)
- **Theming**: next-themes (dark mode default, class-based switching)

### Content Management Pattern

**Projects & Reads**: Edit TypeScript data files directly:
- Projects: Modify `lib/projects.ts` array
- Weekly Reads: Modify `lib/reads.ts` array
- Both use structured interfaces with helper functions for filtering/sorting

**Blog Posts**: Markdown → MDX pipeline:
- Write in Markdown (supports metadata headers or plain format)
- Script auto-extracts/generates frontmatter
- Rendered with next-mdx-remote on `/blog/[slug]` pages
- Table of contents auto-generated from H2/H3 headings

### Theme System

Dark mode is the default theme. The theme system uses:
- `next-themes` with `defaultTheme="dark"` in ThemeProvider
- CSS custom properties defined in `app/globals.css`
- Theme switcher component in header
- `AdaptiveFavicon` component swaps favicon based on theme
- Class-based (`.dark`) theme switching with `suppressHydrationWarning` on `<html>`

### Layout & Navigation

**Desktop**: Pills-style sidebar navigation with:
- Circular icon buttons for each route
- Hover-reveal labels that expand inline
- Framer Motion animations (scale, layout transitions)

**Mobile**: Sheet-style menu with:
- Hamburger trigger in header
- Full-screen overlay navigation

**Global Layout** (`app/layout.tsx`):
- Three custom Google Fonts (Fredoka display, Quicksand body, Victor Mono code)
- ParticleWrapper (Three.js background)
- RotatingCursor (custom cursor on desktop)
- MobileShapes (animated shapes on mobile)
- LoadingScreen (initial page load)
- ScrollIndicator (reading progress in footer)

### Font Configuration
Uses Next.js font optimization with three Google Fonts:
- `--font-display` (Fredoka): Headings and display text
- `--font-body` (Quicksand): Body text
- `--font-mono` (Victor Mono): Code blocks

Weights are optimized (400, 500, 600 only) with `display: "swap"` for performance.

### Path Aliases
TypeScript configured with `@/*` aliasing to project root:
```typescript
import Header from "@/components/layout/Header";
import { getAllProjects } from "@/lib/projects";
```

### Bundle Analysis
Bundle analyzer is configured but disabled by default. Enable with:
```bash
npm run analyze
```
Opens interactive treemap visualization of bundle composition.

## Development Notes

### Adding New Projects
Edit `lib/projects.ts`:
```typescript
{
  id: 4, // Increment ID
  title: "Project Name",
  description: "Brief description",
  tags: ["Next.js", "TypeScript"],
  image: "/projects/image.png", // Optional
  demo: "https://demo.com",      // Optional
  link: "https://github.com/...",
  year: "2026",
  status: "Live" | "In Progress" | "Archived"
}
```

### Adding Weekly Reads
Edit `lib/reads.ts`, add to `weeklyReads` array (newest first):
```typescript
{
  week: "Week X, YYYY",
  dateRange: "MMM D - MMM D",
  reads: [
    {
      id: 1, // Unique within week
      title: "Article Title",
      source: "domain.com",
      url: "https://...",
      category: "Category Name",
      note: "Optional insight/summary"
    }
  ]
}
```

### Blog Post Metadata Formats

**Option 1**: Metadata headers in markdown
```markdown
**Meta-Title:** Post Title
**Excerpt:** Brief description
**Slug:** `url-friendly-slug`

# Post Title

Content...
```

**Option 2**: Plain markdown (auto-inferred)
```markdown
# Post Title

Content... (first paragraph becomes excerpt)
```

The conversion script handles both formats and auto-generates:
- Date from file modification time
- Tags from content keywords
- Slug from title if not provided

### Performance Considerations
- Bundle analyzer available for size monitoring
- Font weights minimized to essential variants
- Three.js particle system is performance-optimized
- Images should be placed in `/public` and use Next.js Image component where possible

### Navigation Behavior Notes
- Desktop sidebar uses layout animations - keep animation durations short (150ms) to prevent click interaction issues
- Mobile menu uses Framer Motion `AnimatePresence` for smooth sheet transitions
- All navigation links use Next.js `Link` component for client-side routing

### Weekly Reads Page Accordion
- First week opens by default on load
- Clicking active week does NOT close it (always keeps one open)
- Category filter auto-opens first filtered week
- Archive collapse maintains open accordion intelligently
