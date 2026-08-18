import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface JournalAuthor {
  name: string;
  role: string;
}

export interface JournalArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  featured: boolean;
  author: JournalAuthor;
  content: string;
}

const JOURNAL_DIR = path.join(process.cwd(), 'content', 'journal');

/**
 * Reads and parses all Markdown articles from content/journal/.
 */
export async function getAllJournalArticles(): Promise<JournalArticle[]> {
  try {
    if (!fs.existsSync(JOURNAL_DIR)) {
      return [];
    }

    const fileNames = fs.readdirSync(JOURNAL_DIR);
    const articles: JournalArticle[] = [];

    for (const fileName of fileNames) {
      if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) continue;

      const fullPath = path.join(JOURNAL_DIR, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const slug = data.slug || fileName.replace(/\.(md|mdx)$/, '');

      articles.push({
        slug,
        title: data.title || 'Untitled Article',
        category: data.category || 'Spatial Design',
        date: data.date ? new Date(data.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent',
        readTime: data.readTime || '5 min read',
        excerpt: data.excerpt || '',
        image: data.image || '/posters/intel-hero-vastu-tech.png',
        featured: Boolean(data.featured),
        author: {
          name: data.author?.name || 'Luxe Axis Editorial Team',
          role: data.author?.role || 'Senior Interior Architect',
        },
        content,
      });
    }

    // Sort by date descending
    return articles.sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0));
  } catch (err) {
    console.error('[journal] Error reading journal articles:', err);
    return [];
  }
}

/**
 * Returns the featured article, or the first article if none is marked featured.
 */
export async function getFeaturedJournalArticle(): Promise<JournalArticle | null> {
  const articles = await getAllJournalArticles();
  return articles.find((a) => a.featured) || articles[0] || null;
}

/**
 * Fetches a single article by slug.
 */
export async function getJournalArticleBySlug(slug: string): Promise<JournalArticle | null> {
  const articles = await getAllJournalArticles();
  return articles.find((a) => a.slug === slug) || null;
}
