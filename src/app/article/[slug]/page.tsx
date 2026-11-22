import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getAllArticles, getTrendingArticles, updateArticle } from "@/lib/storage";
import { fetchFullArticleContent } from "@/lib/scraper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import {
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  ChevronRight,
  ExternalLink,
  Cpu,
  Car,
  BatteryCharging,
  Flame,
  MessageSquare,
  ThumbsUp,
  Tag
} from "lucide-react";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Không tìm thấy bài viết - TechGear Daily" };
  return {
    title: `${article.title} - TechGear Daily`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  let article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Automatically fetch & cache the real in-depth full content from the source if not yet cached (skip concurrent writes during static export build)
  const isBuilding = process.env.GITHUB_PAGES === "true" || process.env.NEXT_PHASE === "phase-production-build";
  const isPlaceholderContent =
    !article.content ||
    article.content.length < 500 ||
    article.content.includes("Bài viết được cập nhật trực tiếp từ chuyên trang") ||
    article.content.includes("Thông tin chi tiết được xuất bản trực tiếp từ nguồn") ||
    article.content.includes("Nguồn bài viết gốc");

  if (!isBuilding && isPlaceholderContent && article.sourceUrl) {
    try {
      const fullBody = await fetchFullArticleContent(article);
      if (fullBody && fullBody.length > 250) {
        updateArticle(article.id, { content: fullBody });
        article = { ...article, content: fullBody };
      }
    } catch (err) {
      console.error("Auto full content scrape error:", err);
    }
  }

  const allArticles = getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);
  const trending = getTrendingArticles(5);

  const isAuto = article.category === "auto";
  const isTopGear = article.source.includes("Top Gear");
  const isTechPowerUp = article.source.includes("TechPowerUp");

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(article.publishedAt));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600 transition">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/category/${article.category}`}
            className="hover:text-blue-600 capitalize transition font-semibold"
          >
            {isAuto ? "Xe Cộ & Vận Tải" : "Công Nghệ"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/category/${article.subcategory}`}
            className="hover:text-blue-600 uppercase transition"
          >
            {article.subcategory}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-slate-400 truncate max-w-xs">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content (8 cols) */}
          <article className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            {/* Category & Status tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {/* Prominent Source Badge */}
              {isTopGear ? (
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-sm">
                  TOP GEAR UK
                </span>
              ) : isTechPowerUp ? (
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-600 text-white shadow-sm">
                  TECHPOWERUP
                </span>
              ) : (
                <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
                  {article.source}
                </span>
              )}

              {/* Main Category Pill */}
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isAuto
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                }`}
              >
                {isAuto ? "Xe Cộ" : "Công Nghệ"} • {article.subcategory}
              </span>

              {/* EV Badge */}
              {article.subcategory === "ev" && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                  <BatteryCharging className="w-3.5 h-3.5" /> Thuần Điện (EV)
                </span>
              )}

              {/* Breaking / Hot Badge */}
              {article.breaking && (
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-red-600 text-white flex items-center gap-1 animate-pulse shadow-sm">
                  <Flame className="w-3.5 h-3.5" /> Tin Nóng
                </span>
              )}

              {article.featured && (
                <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Tiêu Điểm
                </span>
              )}
            </div>

            {/* Article Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
              {article.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center justify-between py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-500 gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  {article.author[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{article.author}</div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formattedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readingTime} phút đọc
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {article.views.toLocaleString()} lượt xem
                </span>
              </div>
            </div>

            {/* Lead excerpt */}
            <div className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border-l-4 border-blue-600 mb-6">
              {article.excerpt}
            </div>

            {/* Cover Image - Render only if image exists, with locked aspect ratio and centered object-cover */}
            {article.coverImage && (
              <div className="relative w-full aspect-[16/9] max-h-[480px] rounded-2xl overflow-hidden mb-8 bg-slate-100 dark:bg-slate-800 shadow-md" style={{ position: "relative" }}>
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover object-center"
                  unoptimized
                />
              </div>
            )}

            {/* Optional Technical Specifications Card */}
            {article.specs && Object.keys(article.specs).length > 0 && (
              <div className="my-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-800/60">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                  {isAuto ? <Car className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                  Thông Số Kỹ Thuật Đáng Chú Ý
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(article.specs).map(([specKey, specVal]) => (
                    <div
                      key={specKey}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between"
                    >
                      <span className="text-slate-400 text-[11px] mb-1">{specKey}</span>
                      <span className="font-extrabold text-white text-sm">{specVal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Article Body Content */}
            <div
              className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Source Reference Badge */}
            {article.sourceUrl && (
              <div className="mt-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Nguồn trích dẫn: {article.source}</div>
                  <div className="text-slate-500">Bài viết được tổng hợp và phân phối qua hệ thống RSS thông minh.</div>
                </div>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shrink-0"
                >
                  Mở bài gốc <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-semibold">Chủ đề liên quan:</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-xs text-slate-700 dark:text-slate-300 font-medium transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Interactive Comments & Feedback Mockup */}
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white mb-4">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Bình Luận & Thảo Luận (2)
              </h3>

              <div className="space-y-3 mb-6">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs">
                  <div className="flex justify-between items-center mb-1 font-semibold text-slate-800 dark:text-slate-200">
                    <span>Trần Hải Đăng</span>
                    <span className="text-[10px] text-slate-400">1 giờ trước</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Thiết kế và thông số thực sự ấn tượng. Rất kỳ vọng vào mức giá lăn bánh cạnh tranh ở thị trường Việt Nam!
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs">
                  <div className="flex justify-between items-center mb-1 font-semibold text-slate-800 dark:text-slate-200">
                    <span>Nguyễn Minh Tiến</span>
                    <span className="text-[10px] text-slate-400">3 giờ trước</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Bài viết tổng hợp thông tin rất nhanh và chuẩn xác. Chúc TechGear Daily phát triển mạnh mẽ!
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Viết bình luận của bạn về bài viết này..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition">
                  Gửi
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Top Trending */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" /> Tin Đọc Nhiều Nhất
              </h3>

              <div className="space-y-1">
                {trending.map((item, idx) => (
                  <div key={item.id} className="py-2.5 flex items-start gap-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <Link href={`/article/${item.slug}`}>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 transition leading-snug">
                          {item.title}
                        </h4>
                      </Link>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {item.views.toLocaleString()} lượt xem
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Admin Access */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800">
              <h4 className="font-bold text-sm mb-2">Ban Quản Trị TechGear Daily</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Bạn muốn bổ sung bài viết phân tích hoặc đồng bộ thêm tin tức mới nhất từ các nguồn báo chí?
              </p>
              <Link
                href="/admin"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                Đăng bài & Quản lý CMS ↗
              </Link>
            </div>
          </aside>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">
              Bài Viết Cùng Chuyên Mục
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} variant="standard" />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
