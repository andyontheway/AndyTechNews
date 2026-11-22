"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Zap, 
  Cpu, 
  Car, 
  Search, 
  Settings, 
  RefreshCw, 
  Flame, 
  Menu, 
  X,
  Compass,
  BatteryCharging
} from "lucide-react";

interface HeaderProps {
  breakingArticles?: { title: string; slug: string }[];
}

export default function Header({ breakingArticles = [] }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/sync-rss", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(`Đã cập nhật ${data.addedCount} tin mới!`);
        router.refresh();
        setTimeout(() => setSyncMessage(null), 4000);
      }
    } catch (err) {
      setSyncMessage("Lỗi khi kết nối nguồn RSS");
      setTimeout(() => setSyncMessage(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const todayStr = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
      {/* Top Bar: Live Ticker & Info */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <span className="flex items-center gap-1 bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0 animate-pulse">
              <Flame className="w-3 h-3 inline" /> Tin Nóng
            </span>
            <div className="truncate text-slate-300 hover:text-white transition">
              {breakingArticles.length > 0 ? (
                <Link href={`/article/${breakingArticles[0].slug}`} className="hover:underline">
                  {breakingArticles[0].title}
                </Link>
              ) : (
                <span>Cập nhật liên tục tin tức Công nghệ & Xe cộ 24/7 từ các nguồn báo chí uy tín</span>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-400">
            <span className="capitalize">{todayStr}</span>
            <span className="text-slate-600">|</span>
            <button
              onClick={handleQuickSync}
              disabled={isSyncing}
              className="flex items-center gap-1 hover:text-cyan-400 transition font-medium cursor-pointer"
              title="Đồng bộ ngay bài viết từ RSS"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-cyan-400" : ""}`} />
              {isSyncing ? "Đang lấy tin..." : "Lấy tin mới (RSS)"}
            </button>
            <span className="text-slate-600">|</span>
            <Link
              href="/admin"
              className="flex items-center gap-1 hover:text-amber-400 transition font-medium"
            >
              <Settings className="w-3 h-3" />
              Quản trị (Admin)
            </Link>
          </div>
        </div>
      </div>

      {syncMessage && (
        <div className="bg-emerald-600 text-white text-xs font-medium py-1 text-center transition-all">
          {syncMessage}
        </div>
      )}

      {/* Main Bar: Logo & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center text-2xl font-black tracking-tight leading-none text-slate-900 dark:text-white">
              <span className="text-blue-600 dark:text-blue-400">TECH</span>
              <span className="text-amber-500 dark:text-amber-400">GEAR</span>
              <span className="text-[11px] ml-1.5 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-extrabold uppercase tracking-wider">
                DAILY
              </span>
            </div>
            <p className="text-[10px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 mt-0.5">
              Driving the Future of Tech <span className="text-slate-400 dark:text-slate-500 font-normal">• Dẫn lối tương lai công nghệ</span>
            </p>
          </div>
        </Link>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm: M4 Max, VinFast VF 7, Galaxy S25, Tesla, AI..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold transition"
            >
              Tìm
            </button>
          )}
        </form>

        {/* Actions / Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold transition"
          >
            <Settings className="w-3.5 h-3.5" />
            + Đăng Bài
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <nav className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-1 lg:space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 overflow-x-auto py-1.5">
            <Link
              href="/"
              className="px-2.5 py-1 rounded-md hover:bg-blue-600 hover:text-white transition flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold"
            >
              <Compass className="w-3.5 h-3.5" />
              Trang Chủ
            </Link>

            <span className="text-slate-300 dark:text-slate-700">|</span>

            <Link
              href="/category/tech"
              className="px-2.5 py-1 rounded-md hover:bg-blue-600 hover:text-white transition flex items-center gap-1 font-bold text-slate-800 dark:text-slate-100"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              Công Nghệ
            </Link>
            <Link
              href="/search?q=TechPowerUp"
              className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white font-bold transition flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              TechPowerUp
            </Link>
            <Link
              href="/category/ai"
              className="px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-blue-500 hover:text-white text-slate-600 dark:text-slate-300 transition"
            >
              Trí tuệ AI
            </Link>
            <Link
              href="/category/pc"
              className="px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-blue-500 hover:text-white text-slate-600 dark:text-slate-300 transition"
            >
              Hardware & PC
            </Link>

            <span className="text-slate-300 dark:text-slate-700">|</span>

            <Link
              href="/category/auto"
              className="px-2.5 py-1 rounded-md hover:bg-amber-600 hover:text-white transition flex items-center gap-1 font-bold text-slate-800 dark:text-slate-100"
            >
              <Car className="w-3.5 h-3.5 text-amber-500" />
              Xe Cộ
            </Link>
            <Link
              href="/topgear"
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 font-black text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse"></span>
              Top Gear Hub 🏎️
            </Link>
            <Link
              href="/category/ev"
              className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition flex items-center gap-1"
            >
              <BatteryCharging className="w-3 h-3 text-emerald-500" />
              Xe Điện (EV)
            </Link>
            <Link
              href="/category/cars"
              className="px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-amber-500 hover:text-white text-slate-600 dark:text-slate-300 transition"
            >
              Siêu Xe & Ô Tô
            </Link>
            <Link
              href="/category/motorbikes"
              className="px-2.5 py-1 text-xs rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-amber-500 hover:text-white text-slate-600 dark:text-slate-300 transition"
            >
              Xe Máy & PKL
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live RSS Feeds
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" /> Trang Chủ
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> Quản Trị
            </Link>
            <Link
              href="/category/tech"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-800 dark:text-white"
            >
              <Cpu className="w-4 h-4 text-blue-500" /> Công Nghệ
            </Link>
            <Link
              href="/category/auto"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-800 dark:text-white"
            >
              <Car className="w-4 h-4 text-amber-500" /> Xe Cộ
            </Link>
            <Link
              href="/category/ev"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-amber-600"
            >
              <BatteryCharging className="w-4 h-4" /> Xe Điện (EV)
            </Link>
            <Link
              href="/category/ai"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-purple-600"
            >
              <Zap className="w-4 h-4" /> Trí Tuệ AI
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>{todayStr}</span>
            <button
              onClick={handleQuickSync}
              disabled={isSyncing}
              className="text-blue-600 font-medium flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
              Cập nhật tin RSS
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
