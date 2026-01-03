#!/usr/bin/env node

/**
 * Blog Converter Script
 *
 * Converts markdown files from /public/blogs to MDX format in /content/blog
 *
 * Usage: npm run convert-blogs
 *
 * Supports two formats:
 * 1. Files with metadata headers (Meta-Title, Meta-Description, Slug, Excerpt)
 * 2. Plain markdown files (uses filename and first paragraph for metadata)
 */

const fs = require('fs');
const path = require('path');

const BLOGS_INPUT_DIR = path.join(process.cwd(), 'public', 'blogs');
const BLOGS_OUTPUT_DIR = path.join(process.cwd(), 'content', 'blog');

// Ensure output directory exists
if (!fs.existsSync(BLOGS_OUTPUT_DIR)) {
  fs.mkdirSync(BLOGS_OUTPUT_DIR, { recursive: true });
}

/**
 * Convert a title to a URL-friendly slug
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Remove duplicate hyphens
    .trim();
}

/**
 * Extract metadata from markdown content
 */
function extractMetadata(content, filename) {
  const lines = content.split('\n');
  let title = '';
  let excerpt = '';
  let slug = '';
  let tags = [];
  let contentStartIndex = 0;

  // Try to extract title from first H1
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    title = h1Match[1].trim();
  }

  // Look for metadata in the format **Key:** value
  const metaPatterns = {
    title: /\*\*Meta-Title:\*\*\s*(.+)/i,
    excerpt: /\*\*Excerpt:\*\*\s*(.+)/i,
    slug: /\*\*Slug:\*\*\s*`?([^`]+)`?/i,
    description: /\*\*Meta-Description:\*\*\s*(.+)/i,
  };

  for (const line of lines) {
    if (metaPatterns.title.test(line)) {
      title = line.match(metaPatterns.title)[1].trim();
    }
    if (metaPatterns.excerpt.test(line)) {
      excerpt = line.match(metaPatterns.excerpt)[1].trim();
    }
    if (metaPatterns.slug.test(line)) {
      slug = line.match(metaPatterns.slug)[1].trim();
    }
    if (metaPatterns.description.test(line) && !excerpt) {
      excerpt = line.match(metaPatterns.description)[1].trim();
    }
  }

  // Find where the actual content starts (after metadata and first ---)
  let foundFirstDivider = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip metadata lines
    if (Object.values(metaPatterns).some(p => p.test(lines[i]))) {
      contentStartIndex = i + 1;
      continue;
    }

    // Skip the first H1 if it matches the title
    if (line.startsWith('# ') && line.slice(2).trim() === title) {
      contentStartIndex = i + 1;
      continue;
    }

    // Skip dividers at the start
    if (line === '---' && !foundFirstDivider) {
      foundFirstDivider = true;
      contentStartIndex = i + 1;
      continue;
    }

    // Found actual content
    if (line && !line.startsWith('**Meta') && !line.startsWith('**Slug') && !line.startsWith('**Excerpt')) {
      break;
    }

    contentStartIndex = i + 1;
  }

  // If no excerpt found, use first paragraph of content
  if (!excerpt) {
    const contentLines = lines.slice(contentStartIndex);
    for (const line of contentLines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
        excerpt = trimmed.slice(0, 200);
        if (trimmed.length > 200) excerpt += '...';
        break;
      }
    }
  }

  // If no slug, generate from title or filename
  if (!slug) {
    slug = slugify(title || path.basename(filename, '.md'));
  }

  // If no title, use filename
  if (!title) {
    title = path.basename(filename, '.md')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  // Try to infer tags from content
  const tagKeywords = {
    'DHCP': ['Networking', 'DHCP', 'Infrastructure'],
    'DNS': ['Networking', 'DNS', 'Infrastructure'],
    'API': ['API', 'Backend', 'Development'],
    'React': ['React', 'Frontend', 'JavaScript'],
    'Next.js': ['Next.js', 'React', 'Frontend'],
    'Python': ['Python', 'Programming'],
    'JavaScript': ['JavaScript', 'Programming'],
    'TypeScript': ['TypeScript', 'Programming'],
    'CSS': ['CSS', 'Frontend', 'Design'],
    'Docker': ['Docker', 'DevOps', 'Infrastructure'],
    'Kubernetes': ['Kubernetes', 'DevOps', 'Infrastructure'],
    'AWS': ['AWS', 'Cloud', 'Infrastructure'],
    'database': ['Database', 'Backend'],
    'SQL': ['SQL', 'Database', 'Backend'],
  };

  const contentLower = content.toLowerCase();
  for (const [keyword, keywordTags] of Object.entries(tagKeywords)) {
    if (contentLower.includes(keyword.toLowerCase())) {
      tags = [...new Set([...tags, ...keywordTags])];
    }
  }

  // Default tags if none found
  if (tags.length === 0) {
    tags = ['Article'];
  }

  // Limit to 3 tags
  tags = tags.slice(0, 3);

  // Get the actual content (remove metadata section)
  const actualContent = lines.slice(contentStartIndex).join('\n').trim();

  return {
    title,
    excerpt,
    slug,
    tags,
    content: actualContent,
  };
}

/**
 * Convert a single markdown file to MDX
 */
function convertFile(inputPath) {
  const filename = path.basename(inputPath);
  console.log(`\n📄 Processing: ${filename}`);

  // Read the file
  const rawContent = fs.readFileSync(inputPath, 'utf-8');

  // Extract metadata and content
  const { title, excerpt, slug, tags, content } = extractMetadata(rawContent, filename);

  // Generate date (use file modification time or today)
  const stats = fs.statSync(inputPath);
  const date = stats.mtime.toISOString().split('T')[0];

  // Build the MDX content
  const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
tags: ${JSON.stringify(tags)}
---

${content}
`;

  // Output filename based on slug
  const outputFilename = `${slug}.mdx`;
  const outputPath = path.join(BLOGS_OUTPUT_DIR, outputFilename);

  // Check if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`   ⚠️  File already exists: ${outputFilename}`);
    console.log(`   Skipping to avoid overwriting. Delete the existing file first if you want to reconvert.`);
    return { success: false, reason: 'exists' };
  }

  // Write the MDX file
  fs.writeFileSync(outputPath, mdxContent);
  console.log(`   ✅ Created: content/blog/${outputFilename}`);
  console.log(`   📝 Title: ${title}`);
  console.log(`   🏷️  Tags: ${tags.join(', ')}`);

  // Delete the original file
  fs.unlinkSync(inputPath);
  console.log(`   🗑️  Deleted: public/blogs/${filename}`);

  return { success: true, slug, title };
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Blog Converter');
  console.log('==================');
  console.log(`Input:  ${BLOGS_INPUT_DIR}`);
  console.log(`Output: ${BLOGS_OUTPUT_DIR}`);

  // Check if input directory exists
  if (!fs.existsSync(BLOGS_INPUT_DIR)) {
    console.log('\n📁 Creating public/blogs directory...');
    fs.mkdirSync(BLOGS_INPUT_DIR, { recursive: true });
    console.log('   Done! Add your .md files there and run this script again.');
    return;
  }

  // Get all markdown files
  const files = fs.readdirSync(BLOGS_INPUT_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('\n📭 No markdown files found in public/blogs/');
    console.log('   Add your .md files and run this script again.');
    return;
  }

  console.log(`\n📚 Found ${files.length} markdown file(s)`);

  const results = {
    converted: [],
    skipped: [],
    errors: [],
  };

  // Process each file
  for (const file of files) {
    try {
      const result = convertFile(path.join(BLOGS_INPUT_DIR, file));
      if (result.success) {
        results.converted.push(result);
      } else {
        results.skipped.push({ file, reason: result.reason });
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      results.errors.push({ file, error: error.message });
    }
  }

  // Summary
  console.log('\n==================');
  console.log('📊 Summary');
  console.log(`   ✅ Converted: ${results.converted.length}`);
  console.log(`   ⏭️  Skipped: ${results.skipped.length}`);
  console.log(`   ❌ Errors: ${results.errors.length}`);

  if (results.converted.length > 0) {
    console.log('\n🎉 New blog posts available at:');
    results.converted.forEach(r => {
      console.log(`   /blog/${r.slug}`);
    });
  }
}

main();
