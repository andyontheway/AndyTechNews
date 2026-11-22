import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles } from "@/lib/storage";
import { CATEGORIES } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { MainCategory, SubCategory } from "@/types";
import { Cpu, Car, BatteryCharging, ChevronRight, Filter } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const isTech = slug === "tech" || ["ai", "smartphones", "pc", "reviews", "gadgets"].includes(slug);
  const title = isTech ? "Tin Tức Công Nghệ Mới Nhất" : "Tin Tức Xe Cộ & Xe Điện";
  return {
    title: `${title} - TechGear Daily`,
    description: `Khám phá các tin tức mới nhất về chuyên mục ${slug} tại TechGear Daily - Driving the Future of Tech.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Check if main category or subcategory
  const isMainCategory = slug === "tech" || slug === "auto";
  const allArticles = getAllArticles();

  let filteredArticles = allArticles;
  let categoryTitle = "";
  let categoryDesc = "";
  let icon = <Cpu className="w-6 h-6 text-blue-500" />;

  if (slug === "tech") {
    filteredArticles = allArticles.filter((a) => a.category === "tech");
    categoryTitle = "Công Nghệ & Kỷ Nguyên Số";
    categoryDesc = "Cập nhật liên tục các đột phá về AI, điện thoại, máy tính, thiết bị thông minh và vi xử lý.";
    icon = <Cpu className="w-6 h-6 text-blue-500" />;
  } else if (slug === "auto") {
    filteredArticles = allArticles.filter((a) => a.category === "auto");
    categoryTitle = "Xe Cộ & Vận Tải";
    categoryDesc = "Thế giới ô tô, xe điện thế hệ mới, xe máy phân khối lớn và thị trường xe Việt Nam.";
    icon = <Car className="w-6 h-6 text-amber-500" />;
  } else if (slug === "ev") {
    filteredArticles = allArticles.filter((a) => a.subcategory === "ev");
    categoryTitle = "Xe Điện (EV) & Công Nghệ Pin";
    categoryDesc = "Tin tức xe điện VinFast, Tesla, Porsche, BYD, công nghệ pin và hệ thống trạm sạc siêu tốc.";
    icon = <BatteryCharging className="w-6 h-6 text-emerald-500" />;
  } else if (slug === "ai") {
    filteredArticles = allArticles.filter((a) => a.subcategory === "ai");
    categoryTitle = "Trí Tuệ Nhân Tạo (AI)";
    categoryDesc = "Khám phá các mô hình ngôn ngữ lớn (LLM), Agentic AI, robot hình người và ứng dụng thực tiễn.";
    icon = <Cpu className="w-6 h-6 text-purple-500" />;
  } else {
    // Other subcategories
    filteredArticles = allArticles.filter(
      (a) => a.subcategory === slug || a.category === (slug as MainCategory)
    );
    categoryTitle = `Chuyên Mục: ${slug.toUpperCase()}`;
    categoryDesc = `Tổng hợp toàn bộ bài viết và phân tích chuyên sâu về ${slug}.`;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-slate-400 capitalize font-medium">{categoryTitle}</span>
        </nav>

        {/* Category Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
              {icon}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Chuyên mục tin tức
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {categoryTitle}
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mt-2">
            {categoryDesc}
          </p>

          {/* Quick Subcategory Pills */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Lọc nhanh:
            </span>
            <Link
              href="/category/tech"
              className={`px-3 py-1 rounded-full transition shrink-0 ${
                slug === "tech"
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Tất cả Công Nghệ
            </Link>
            <Link
              href="/category/auto"
              className={`px-3 py-1 rounded-full transition shrink-0 ${
                slug === "auto"
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Tất cả Xe Cộ
            </Link>
            <Link
              href="/category/ev"
              className={`px-3 py-1 rounded-full transition shrink-0 ${
                slug === "ev"
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Xe Điện (EV)
            </Link>
            <Link
              href="/category/ai"
              className={`px-3 py-1 rounded-full transition shrink-0 ${
                slug === "ai"
                  ? "bg-purple-600 text-white font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Trí Tuệ AI
            </Link>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 mb-3">Hiện chưa có bài viết nào trong danh mục này.</p>
            <Link
              href="/admin"
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
            >
              Đồng bộ tin từ RSS hoặc Đăng bài mới
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
