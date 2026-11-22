import fs from "fs";
import path from "path";
import { Article, MainCategory, SubCategory } from "@/types";
import { RSS_FEEDS } from "./constants";
import { parseRssFeed, generateSlug } from "./rss";
import seedArticles from "@/data/seed-articles.json";

const DATA_DIR = path.join(process.cwd(), "data");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(ARTICLES_FILE)) {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(seedArticles, null, 2), "utf-8");
  }
}

export function getAllArticles(): Article[] {
  ensureDataFile();
  try {
    const rawData = fs.readFileSync(ARTICLES_FILE, "utf-8");
    const articles: Article[] = JSON.parse(rawData);
    // Sort descending by publishedAt
    return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (error) {
    console.error("Error reading articles:", error);
    return seedArticles as unknown as Article[];
  }
}

export function saveAllArticles(articles: Article[]) {
  ensureDataFile();
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  const exact = articles.find((a) => a.slug === slug || a.id === slug);
  if (exact) return exact;

  // Fallback: match without hash suffix if URL has an older or slightly different hash
  const prefix = slug.replace(/-[a-z0-9]{6}$/i, "");
  if (prefix && prefix.length > 5) {
    const fuzzy = articles.find((a) => a.slug.startsWith(prefix));
    if (fuzzy) return fuzzy;
  }

  return null;
}

export function getArticlesByCategory(
  category?: MainCategory,
  subcategory?: SubCategory
): Article[] {
  let articles = getAllArticles();
  if (category) {
    articles = articles.filter((a) => a.category === category);
  }
  if (subcategory) {
    articles = articles.filter((a) => a.subcategory === subcategory);
  }
  return articles;
}

export function getFeaturedArticles(): Article[] {
  const articles = getAllArticles();
  const featured = articles.filter((a) => a.featured);
  return featured.length > 0 ? featured : articles.slice(0, 5);
}

export function getBreakingNews(): Article[] {
  const articles = getAllArticles();
  const breaking = articles.filter((a) => a.breaking);
  return breaking.length > 0 ? breaking : articles.slice(0, 4);
}

export function getTrendingArticles(limit: number = 5): Article[] {
  const articles = getAllArticles();
  return [...articles].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function searchArticles(query: string): Article[] {
  if (!query || query.trim() === "") return [];
  const q = query.toLowerCase().trim();
  const articles = getAllArticles();

  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.author.toLowerCase().includes(q)
  );
}

export function createArticle(data: Omit<Article, "id" | "slug" | "views" | "publishedAt"> & { specs?: Record<string, string> }): Article {
  const articles = getAllArticles();
  const id = `art-${Date.now()}`;
  const slug = generateSlug(data.title) + `-${id.slice(-5)}`;

  const newArticle: Article = {
    ...data,
    id,
    slug,
    views: 0,
    publishedAt: new Date().toISOString(),
  };

  articles.unshift(newArticle);
  saveAllArticles(articles);
  return newArticle;
}

export function updateArticle(id: string, data: Partial<Article>): Article | null {
  const articles = getAllArticles();
  const index = articles.findIndex((a) => a.id === id || a.slug === id);
  if (index === -1) return null;

  const current = articles[index];
  const updated: Article = {
    ...current,
    ...data,
    id: current.id, // preserve immutable ID
  };

  articles[index] = updated;
  saveAllArticles(articles);
  return updated;
}

export function deleteArticle(id: string): boolean {
  const articles = getAllArticles();
  const filtered = articles.filter((a) => a.id !== id && a.slug !== id);
  if (filtered.length !== articles.length) {
    saveAllArticles(filtered);
    return true;
  }
  return false;
}

export function getLeadStories(): { lead: Article; side: Article[]; quickWire: Article[] } {
  const articles = getAllArticles();

  // Find newest articles from Top Gear and TechPowerUp
  const topGearArticles = articles.filter((a) => a.source.includes("Top Gear"));
  const techPowerUpArticles = articles.filter((a) => a.source.includes("TechPowerUp"));

  // Primary lead: newest top gear or techpowerup with high visual appeal
  const lead = topGearArticles[0] || techPowerUpArticles[0] || articles[0];

  // Side 4 articles: alternating tech & auto
  const remainingTech = techPowerUpArticles.filter((a) => a.id !== lead?.id);
  const remainingAuto = topGearArticles.filter((a) => a.id !== lead?.id);

  const side: Article[] = [];
  if (remainingTech[0]) side.push(remainingTech[0]);
  if (remainingAuto[0]) side.push(remainingAuto[0]);
  if (remainingTech[1]) side.push(remainingTech[1]);
  if (remainingAuto[1]) side.push(remainingAuto[1]);

  // Backfill if needed
  while (side.length < 4) {
    const nextArt = articles.find((a) => a.id !== lead?.id && !side.some((s) => s.id === a.id));
    if (nextArt) side.push(nextArt);
    else break;
  }

  // Quick wire: next 4 recent articles for fast scanning
  const usedIds = new Set([lead?.id, ...side.map((s) => s.id)]);
  const quickWire = articles.filter((a) => !usedIds.has(a.id)).slice(0, 4);

  return { lead, side, quickWire };
}

export async function syncRssFeeds(): Promise<{ addedCount: number; totalCount: number }> {
  const currentArticles = getAllArticles();
  const existingUrls = new Set(
    currentArticles.map((a) => a.sourceUrl).filter(Boolean)
  );
  const existingTitles = new Set(
    currentArticles.map((a) => a.title.toLowerCase().trim())
  );

  let newArticles: Article[] = [];

  for (const feedConfig of RSS_FEEDS) {
    try {
      const feedItems = await parseRssFeed(feedConfig);
      for (const item of feedItems) {
        if (
          item.sourceUrl &&
          !existingUrls.has(item.sourceUrl) &&
          !existingTitles.has(item.title.toLowerCase().trim())
        ) {
          newArticles.push(item);
          existingUrls.add(item.sourceUrl);
          existingTitles.add(item.title.toLowerCase().trim());
        }
      }
    } catch (err) {
      console.error(`Failed to sync feed: ${feedConfig.name}`, err);
    }
  }

  if (newArticles.length > 0) {
    // Keep max 500 articles to avoid unlimited growth
    const updated = [...newArticles, ...currentArticles].slice(0, 500);
    saveAllArticles(updated);
  }

  return {
    addedCount: newArticles.length,
    totalCount: currentArticles.length + newArticles.length,
  };
}
