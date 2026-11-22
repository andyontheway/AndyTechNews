import Parser from "rss-parser";
import crypto from "crypto";
import { Article, MainCategory, SubCategory, RssFeedConfig } from "@/types";

const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function cleanHtmlText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImage(item: any, _category: MainCategory): string {
  // 1. Check enclosure (Used by TechPowerUp, VnExpress)
  if (item.enclosure?.url && item.enclosure.url.startsWith("http")) {
    return item.enclosure.url;
  }

  // 2. Check media:content
  if (item.mediaContent?.$?.url) {
    return item.mediaContent.$.url;
  }

  // 3. Check <img> tag in content or contentEncoded
  const contentToSearch = item.contentEncoded || item.content || item.description || "";
  const imgMatch = contentToSearch.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1] && imgMatch[1].startsWith("http")) {
    return imgMatch[1];
  }

  // 4. Return empty if no real image found (allows adaptive text-first rendering)
  return "";
}

function hasWord(text: string, word: string): boolean {
  return new RegExp(`\\b${word}\\b`, "i").test(text);
}

function hasAnyWord(text: string, words: string[]): boolean {
  return words.some((w) =>
    w.includes(" ") ? text.toLowerCase().includes(w.toLowerCase()) : hasWord(text, w)
  );
}

function detectCategory(title: string, desc: string, fallback: MainCategory): MainCategory {
  const text = `${title} ${desc}`.toLowerCase();

  // If feed is already designated as tech (e.g. TechPowerUp)
  if (fallback === "tech") {
    if (hasAnyWord(text, ["electric car", "electric vehicle", "supercar", "hypercar", "ferrari", "porsche macan", "tesla model", "vinfast vf"])) {
      return "auto";
    }
    return "tech";
  }

  // If feed is already designated as auto (e.g. Top Gear)
  if (fallback === "auto") {
    if (hasAnyWord(text, ["rtx 5090", "geforce rtx", "intel core", "amd ryzen", "desktop cpu", "motherboard bios"])) {
      return "tech";
    }
    return "auto";
  }

  if (
    hasAnyWord(text, [
      "ô tô", "xe hơi", "xe điện", "xe máy", "mô tô", "porsche", "vinfast",
      "hyundai", "toyota", "mercedes", "bmw", "tesla", "ferrari", "lamborghini",
      "mclaren", "aston martin", "supercar", "hypercar", "bhp", "suv", "sedan",
      "car", "cars", "vehicle", "vehicles"
    ])
  ) {
    return "auto";
  }

  return "tech";
}

function detectSubcategory(title: string, desc: string, category: MainCategory, fallback: SubCategory): SubCategory {
  const text = `${title} ${desc}`.toLowerCase();

  if (category === "auto") {
    const isNonHybrid = text.includes("non-hybrid");
    if (
      !isNonHybrid &&
      hasAnyWord(text, [
        "electric", "ev", "hybrid", "phev", "battery", "charging",
        "xe điện", "pin", "trạm sạc"
      ])
    ) {
      return "ev";
    }
    if (
      hasAnyWord(text, [
        "bike", "bikes", "motorcycle", "motorcycles", "ducati", "harley",
        "yamaha", "kawasaki", "xe máy", "mô tô", "pkl"
      ])
    ) {
      return "motorbikes";
    }
    if (
      hasAnyWord(text, [
        "review", "reviews", "first drive", "tested", "road test",
        "đánh giá", "trải nghiệm", "lái thử"
      ])
    ) {
      return "auto-reviews";
    }
    if (
      hasAnyWord(text, [
        "market", "price", "prices", "sales", "pricing",
        "bảng giá", "thị trường", "lăn bánh"
      ])
    ) {
      return "market";
    }
    return "cars";
  } else {
    // Tech subcategories
    if (
      hasAnyWord(text, [
        "ai", "npu", "neural", "llm", "chatgpt", "gemini", "claude",
        "machine learning", "deep learning", "trí tuệ nhân tạo"
      ])
    ) {
      return "ai";
    }
    if (
      hasAnyWord(text, [
        "smartphone", "smartphones", "iphone", "galaxy", "xiaomi", "oppo",
        "vivo", "pixel", "snapdragon", "dimensity", "điện thoại", "di động"
      ])
    ) {
      return "smartphones";
    }
    if (
      hasAnyWord(text, [
        "review", "reviews", "benchmark", "benchmarks", "tested", "teardown",
        "đánh giá", "trên tay", "mở hộp"
      ])
    ) {
      return "reviews";
    }
    if (
      hasAnyWord(text, [
        "smartwatch", "headphone", "headphones", "earbuds", "earphone",
        "wearable", "tai nghe", "đồng hồ", "phụ kiện"
      ])
    ) {
      return "gadgets";
    }
    if (
      hasAnyWord(text, [
        "gpu", "cpu", "graphics", "geforce", "rtx", "radeon", "intel",
        "amd", "ryzen", "motherboard", "ssd", "nvme", "ram", "ddr5",
        "vram", "pcie", "cooler", "chassis", "laptop", "pc", "desktop",
        "máy tính", "vi xử lý", "phần cứng", "hardware"
      ])
    ) {
      return "pc";
    }
    return fallback;
  }
}

// Special Scraper for Top Gear (which does not provide traditional RSS, but rich JSON in page props)
async function fetchTopGearArticles(feedConfig: RssFeedConfig): Promise<Article[]> {
  try {
    const res = await fetch(feedConfig.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`Top Gear fetch error: HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (!match) return [];

    const data = JSON.parse(match[1]);
    const pageProps = data.props?.pageProps;
    const rawResults =
      pageProps?.newsResults?.results ||
      pageProps?.results?.results ||
      pageProps?.results ||
      pageProps?.latestCarReviews ||
      [];

    const articles: Article[] = [];

    for (const item of rawResults) {
      if (!item.title || !item.path) continue;

      const rawTitle = item.title.replace(/\*/g, "").trim();
      const rawExcerpt = cleanHtmlText(item.description || item.summary || "");
      const fullUrl = item.path.startsWith("http") ? item.path : `https://www.topgear.com${item.path}`;

      let coverImage = "";
      if (item.image) {
        coverImage = item.image.startsWith("http") ? item.image : `https://www.topgear.com${item.image}`;
      }

      const subcategory = detectSubcategory(
        rawTitle,
        rawExcerpt,
        "auto",
        feedConfig.defaultSubcategory
      );

      const hash = crypto.createHash("md5").update(fullUrl).digest("hex").slice(0, 10);
      const uniqueId = `tg-${hash}`;
      const baseSlug = generateSlug(rawTitle);
      const slug = `${baseSlug}-${hash.slice(0, 6)}`;

      // Extract specs from title/desc (e.g. 670bhp, 328bhp, 0-60mph)
      const specs: Record<string, string> = {
        "Nguồn đưa tin": "Top Gear UK",
      };
      const bhpMatch = `${rawTitle} ${rawExcerpt}`.match(/(\d{3,4})\s*bhp/i);
      if (bhpMatch) {
        specs["Công suất"] = `${bhpMatch[1]} BHP (Mã lực)`;
      }
      if (subcategory === "ev") {
        specs["Loại động cơ"] = "Thuần điện (Electric EV)";
      }

      const tags = [
        "Top Gear",
        "Xe cộ",
        ...(item.categories?.map((c: any) => c.title) || []),
      ];

      const contentHtml = `
        <p class="lead text-lg font-medium text-slate-700 dark:text-slate-300 mb-6">${rawExcerpt}</p>
        <p class="mb-4">Bài viết được cập nhật trực tiếp từ chuyên trang xe hơi hàng đầu thế giới <strong>Top Gear</strong>. Bạn có thể đón đọc bài phóng sự và hình ảnh gốc độ phân giải cao tại liên kết bên dưới:</p>
        <div class="my-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div class="text-sm text-slate-500">Chuyên mục Top Gear</div>
            <div class="font-semibold text-slate-900 dark:text-white">Top Gear Global Edition</div>
          </div>
          <a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-sm font-bold transition inline-flex items-center gap-1 shadow">
            Xem bài gốc trên Top Gear ↗
          </a>
        </div>
      `;

      articles.push({
        id: uniqueId,
        slug,
        title: rawTitle,
        excerpt: rawExcerpt,
        content: contentHtml,
        category: "auto",
        subcategory,
        coverImage,
        source: "Top Gear",
        sourceUrl: fullUrl,
        author: "Top Gear UK Editorial",
        publishedAt: item.created || new Date().toISOString(),
        featured: false,
        breaking: Boolean(item.categories?.some((c: any) => c.title?.toLowerCase().includes("supercar"))),
        views: Math.floor(Math.random() * 3200) + 800,
        readingTime: 4,
        tags,
        specs,
      });
    }

    return articles;
  } catch (err) {
    console.error(`Failed to scrape Top Gear from ${feedConfig.url}:`, err);
    return [];
  }
}

export async function parseRssFeed(feedConfig: RssFeedConfig): Promise<Article[]> {
  // Check if Top Gear
  if (feedConfig.url.includes("topgear.com")) {
    return fetchTopGearArticles(feedConfig);
  }

  // Standard RSS Feed (TechPowerUp, VnExpress, GenK...)
  try {
    const feed = await parser.parseURL(feedConfig.url);
    const articles: Article[] = [];

    for (const rawItem of feed.items || []) {
      const item = rawItem as any;
      if (!item.title || !item.link) continue;

      const rawDescription = item.contentSnippet || item.content || item.description || "";
      const cleanedExcerpt = cleanHtmlText(rawDescription).slice(0, 240);
      const coverImage = extractImage(item, feedConfig.category);

      // Determine category and subcategory dynamically
      const detectedCategory = detectCategory(item.title, cleanedExcerpt, feedConfig.category);
      const subcategory = detectSubcategory(
        item.title,
        cleanedExcerpt,
        detectedCategory,
        feedConfig.defaultSubcategory
      );

      const hash = crypto.createHash("md5").update(item.link).digest("hex").slice(0, 10);
      const uniqueId = `rss-${hash}`;
      const baseSlug = generateSlug(item.title);
      const slug = `${baseSlug}-${hash.slice(0, 6)}`;

      // Approximate reading time based on word count
      const wordCount = (cleanedExcerpt + " " + (item.content || "")).split(/\s+/).length;
      const readingTime = Math.max(2, Math.ceil(wordCount / 180));

      // Compose clean content HTML
      const fullContentHtml = `
        <p class="lead text-lg font-medium text-slate-700 dark:text-slate-300 mb-6">${cleanedExcerpt}</p>
        <p class="mb-4">Thông tin chi tiết được xuất bản trực tiếp từ nguồn <strong>${feedConfig.name}</strong>. Bạn có thể xem toàn văn bài viết gốc qua liên kết bên dưới:</p>
        <div class="my-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div class="text-sm text-slate-500">Nguồn bài viết gốc</div>
            <div class="font-semibold text-slate-900 dark:text-white">${feedConfig.name}</div>
          </div>
          <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition inline-flex items-center gap-1">
            Đọc bài gốc ↗
          </a>
        </div>
      `;

      // Extract specs if hardware review (e.g. TPU)
      const specs: Record<string, string> = {
        "Nguồn": feedConfig.name,
      };

      articles.push({
        id: uniqueId,
        slug,
        title: item.title.trim(),
        excerpt: cleanedExcerpt,
        content: fullContentHtml,
        category: detectedCategory,
        subcategory,
        coverImage,
        source: feedConfig.name.includes("TechPowerUp") ? "TechPowerUp" : feedConfig.name,
        sourceUrl: item.link,
        author: item.creator || item.author || feedConfig.name,
        publishedAt: item.isoDate || (item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()),
        featured: false,
        breaking: false,
        views: Math.floor(Math.random() * 2500) + 300,
        readingTime,
        tags: [
          feedConfig.name.includes("TechPowerUp") ? "TechPowerUp" : feedConfig.name,
          detectedCategory === "tech" ? "Công nghệ" : "Xe cộ",
          subcategory.toUpperCase(),
        ],
        specs: Object.keys(specs).length > 1 ? specs : undefined,
      });
    }

    return articles;
  } catch (error) {
    console.error(`Error parsing RSS feed from ${feedConfig.url}:`, error);
    return [];
  }
}
