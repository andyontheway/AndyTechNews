import https from "https";
import http from "http";
import type { Article } from "@/types";

/**
 * Fetch HTML or JSON from an external URL with redirect following
 */
export function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith("https");
    const client = isHttps ? https : http;

    const req = client.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      },
      (res) => {
        // Handle 301/302 redirects
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          const redirectUrl = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          return resolve(fetchUrl(redirectUrl));
        }

        if (res.statusCode && res.statusCode >= 400) {
          return resolve("");
        }

        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
        res.on("error", (err) => {
          console.error(`Error streaming data from ${url}:`, err);
          resolve("");
        });
      }
    );

    req.on("error", (err) => {
      console.error(`Error fetching ${url}:`, err);
      resolve("");
    });

    req.setTimeout(8000, () => {
      req.destroy();
      resolve("");
    });
  });
}

/**
 * Clean and normalize scraped HTML body for article rendering
 */
function cleanArticleHtml(rawHtml: string, baseUrl?: string): string {
  if (!rawHtml) return "";

  let cleaned = rawHtml
    // Remove scripts and style tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Remove iframes and forms
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "")
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, "");

  // Fix relative image URLs if baseUrl provided
  if (baseUrl) {
    cleaned = cleaned.replace(/src="(\/[^"]+)"/g, (match, path) => {
      try {
        const fullUrl = new URL(path, baseUrl).toString();
        return `src="${fullUrl}"`;
      } catch {
        return match;
      }
    });
  }

  return cleaned.trim();
}

/**
 * Fetch and parse the full, detailed article body from original source
 */
export async function fetchFullArticleContent(article: Article): Promise<string | null> {
  const url = article.sourceUrl;
  if (!url) return null;

  try {
    // 1. TOP GEAR ARTICLE
    if (url.includes("topgear.com")) {
      const html = await fetchUrl(url);
      if (!html) return null;

      const nextDataMatch = html.match(
        /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
      );
      if (nextDataMatch) {
        try {
          const json = JSON.parse(nextDataMatch[1]);
          const contentObj = json.props?.pageProps?.content;
          if (contentObj?.body) {
            const cleanBody = cleanArticleHtml(contentObj.body, "https://www.topgear.com");
            return `
              <div class="lead text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                ${article.excerpt}
              </div>
              <div class="article-body space-y-4">
                ${cleanBody}
              </div>
            `;
          }
        } catch (e) {
          console.error("Error parsing Top Gear NEXT_DATA:", e);
        }
      }
    }

    // 2. TECHPOWERUP ARTICLE
    if (url.includes("techpowerup.com")) {
      const html = await fetchUrl(url);
      if (!html) return null;

      const tpuMatch = html.match(/<div class="text p">([\s\S]*?)<\/div>/i);
      if (tpuMatch && tpuMatch[1]) {
        const cleanBody = cleanArticleHtml(tpuMatch[1], "https://www.techpowerup.com");
        return `
          <div class="lead text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            ${article.excerpt}
          </div>
          <div class="article-body space-y-4 text-slate-800 dark:text-slate-200">
            ${cleanBody}
          </div>
        `;
      }
    }

    // 3. VNEXPRESS ARTICLE
    if (url.includes("vnexpress.net")) {
      const html = await fetchUrl(url);
      if (!html) return null;

      const vneMatch = html.match(/<article class="[^"]*fck_detail[^"]*">([\s\S]*?)<\/article>/i);
      if (vneMatch && vneMatch[1]) {
        let content = vneMatch[1]
          .replace(/<div class="list_action_item"[\s\S]*?<\/div>/gi, "")
          .replace(/<p class="description">[\s\S]*?<\/p>/gi, "");
        const cleanBody = cleanArticleHtml(content, "https://vnexpress.net");
        return `
          <div class="lead text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            ${article.excerpt}
          </div>
          <div class="article-body space-y-4 text-slate-800 dark:text-slate-200">
            ${cleanBody}
          </div>
        `;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error scraping full content for article ${article.id}:`, error);
    return null;
  }
}
