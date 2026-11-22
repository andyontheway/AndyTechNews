import { searchArticles, getAllArticles } from "@/lib/storage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";
  const results = query ? searchArticles(query) : getAllArticles().slice(0, 12);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Header />

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

          <form action="/search" method="GET" className="relative max-w-xl">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Nhập từ khóa cần tìm..."
              className="w-full pl-11 pr-24 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
            >
              Tìm kiếm
            </button>
          </form>

          {query && (
            <div className="mt-4 text-xs text-slate-500">
              Kết quả cho từ khóa: <strong className="text-blue-600 dark:text-blue-400">"{query}"</strong> — tìm thấy {results.length} bài viết.
            </div>
          )}
        </div>

        {/* Results Grid */}
        {results.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 mb-2">Không tìm thấy bài viết nào phù hợp với từ khóa "{query}".</p>
            <p className="text-xs text-slate-400 mb-4">Hãy thử tìm với các từ khóa ngắn hơn hoặc kiểm tra lỗi chính tả.</p>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
            >
              Về Trang Chủ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
