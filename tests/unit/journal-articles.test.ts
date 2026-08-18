import { describe, expect, it } from 'vitest';
import {
  getAllJournalArticles,
  getFeaturedJournalArticle,
  getJournalArticleBySlug,
} from '@/lib/content/journal';

describe('Journal Content Layer (lib/content/journal.ts)', () => {
  it('reads all seeded markdown articles from content/journal/', async () => {
    const articles = await getAllJournalArticles();
    expect(articles.length).toBeGreaterThanOrEqual(6);

    const slugs = articles.map((a) => a.slug);
    expect(slugs).toContain('vastu-tech-spatial-guide');
    expect(slugs).toContain('bwp-plywood-vs-commercial-ply');
    expect(slugs).toContain('chennai-interior-cost-breakdown');
    expect(slugs).toContain('nri-remote-home-supervision');
    expect(slugs).toContain('45-day-handover-factory-prefabrication');
    expect(slugs).toContain('coastal-humidity-interior-finishes');
  });

  it('fetches the featured spotlight article', async () => {
    const featured = await getFeaturedJournalArticle();
    expect(featured).not.toBeNull();
    expect(featured?.title).toBeTruthy();
    expect(featured?.category).toBeTruthy();
  });

  it('retrieves single article by slug with formatted fields and author bio', async () => {
    const article = await getJournalArticleBySlug('vastu-tech-spatial-guide');
    expect(article).not.toBeNull();
    expect(article?.slug).toBe('vastu-tech-spatial-guide');
    expect(article?.category).toBe('Vastu Engineering');
    expect(article?.author.name).toBeTruthy();
    expect(article?.content).toContain('Vastu-Tech');
  });

  it('returns null for non-existent slug', async () => {
    const missing = await getJournalArticleBySlug('non-existent-random-slug');
    expect(missing).toBeNull();
  });
});
