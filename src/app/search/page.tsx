"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { Article } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In static export, load from public/data/articles.json
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/data/articles.json`)
      .then((res) => res.json())
      .then((data: Article[]) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load articles", err);
        setLoading(false);
      });
  }, []);

  const results = query
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          a.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : articles.slice(0, 12);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition">
          Trang Chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-slate-400">Tìm kiếm</span>
      </nav>

      {/* Search Input Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
          Tìm Kiếm Tin Tức Công Nghệ & Xe Cộ
        </h1>
        <p className="text-xs text-slate-500 mb-4">
          Nhập từ khóa như tên mẫu xe (VF 7, Porsche, Tesla...), vi xử lý (M4, Snapdragon, RTX), hoặc chủ đề AI, smartphone...
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.location.search = `?q=${encodeURIComponent(searchTerm)}`;
          }}
          className="relative max-w-xl"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập từ khóa cần tìm..."
            className="w-full pl-11 pr-24 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
          >
            Tìm Kiếm
          </button>
        </form>
      </div>

      {/* Search Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {query ? `Kết quả cho từ khóa "${query}"` : "Tin tức mới nhất"}
          </h2>
          <span className="text-xs text-slate-400">
            {loading ? "Đang tìm kiếm..." : `Tìm thấy ${results.length} bài viết`}
          </span>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-1">
              Không tìm thấy bài viết phù hợp
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Hãy thử tìm kiếm với các từ khóa ngắn gọn hơn như "VinFast", "iPhone", "AI", "Top Gear", "Nvidia".
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Header />
      <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Đang tải trang tìm kiếm...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}