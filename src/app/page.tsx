import { getAllArticles, getLeadStories, getTrendingArticles } from "@/lib/storage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSpotlight from "@/components/HeroSpotlight";
import ArticleCard from "@/components/ArticleCard";
import TechAutoShowcase from "@/components/TechAutoShowcase";
import Link from "next/link";
import { Cpu, Car, Flame, ArrowRight, Zap, TrendingUp, Sparkles, BatteryCharging } from "lucide-react";

export const revalidate = 60;

export default function HomePage() {
  const allArticles = getAllArticles();
  const { lead, side, quickWire } = getLeadStories();
  const trendingArticles = getTrendingArticles(5);

  // Dedicated feeds for TechPowerUp and Top Gear
  const techPowerUpArticles = allArticles.filter((a) => a.source.includes("TechPowerUp"));
  const topGearArticles = allArticles.filter((a) => a.source.includes("Top Gear"));

  // Secondary stream
  const latestStream = allArticles.slice(10, 18);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Header breakingArticles={allArticles.slice(0, 3)} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 flex-1 w-full space-y-5 sm:space-y-6">
        {/* 1. HERO SPOTLIGHT: Tin vừa mới vừa lớn nhất (Top Gear & TechPowerUp) */}
        <HeroSpotlight lead={lead} side={side} />

        {/* 2. QUICK WIRE STRIP: 4 tin nhanh cập nhật tức thì (Tối ưu không gian) */}
        {quickWire.length > 0 && (
          <section className="bg-slate-100/70 dark:bg-slate-900/50 p-2.5 sm:p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-800 text-xs">
              <span className="font-extrabold flex items-center gap-1.5 text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
                Dòng Tin Nhanh 24/7 (Quick Wire)
              </span>
              <span className="text-[10px] text-slate-400">Tự động cập nhật</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {quickWire.map((item) => (
                <ArticleCard key={item.id} article={item} variant="strip" />
              ))}
            </div>
          </section>
        )}

        {/* 3. DUAL CORE COLUMNS: TECHPOWERUP vs TOP GEAR (Song mã đối trọng) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* CỘT TRÁI: TECHPOWERUP (Tin Công Nghệ, Vi Xử Lý & AI) */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-blue-600">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-xs uppercase shadow-sm">
                    TECHPOWERUP
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                    <Cpu className="w-4 h-4 text-blue-500" />
                    Phần Cứng & Trí Tuệ AI
                  </h3>
                </div>
                <Link
                  href="/category/tech"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  Xem thêm <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Lead Card Tech */}
              {techPowerUpArticles[0] && (
                <div className="mb-3">
                  <ArticleCard article={techPowerUpArticles[0]} variant="standard" />
                </div>
              )}

              {/* Stack 3 next tech stories */}
              <div className="space-y-2">
                {techPowerUpArticles.slice(1, 4).map((art) => (
                  <ArticleCard key={art.id} article={art} variant="horizontal" />
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TOP GEAR (Tin Siêu Xe, Xe Điện EV & Đánh Giá Lái) */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-amber-500">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs uppercase shadow-sm">
                    TOP GEAR
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                    <Car className="w-4 h-4 text-amber-500" />
                    Siêu Xe & Xe Điện Toàn Cầu
                  </h3>
                </div>
                <Link
                  href="/category/auto"
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                >
                  Xem thêm <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Lead Card Auto */}
              {topGearArticles[0] && (
                <div className="mb-3">
                  <ArticleCard article={topGearArticles[0]} variant="standard" />
                </div>
              )}

              {/* Stack 3 next auto stories */}
              <div className="space-y-2">
                {topGearArticles.slice(1, 4).map((art) => (
                  <ArticleCard key={art.id} article={art} variant="horizontal" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. SHOWCASE SO SÁNH THÔNG SỐ (Tinh giản, gọn gàng) */}
        <TechAutoShowcase />

        {/* 5. DÒNG TIN TỔNG HỢP & TRENDING SIDEBAR */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Cột chính: 8 cột */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                Cập Nhật Liên Tục (Latest Feed)
              </h3>
              <span className="text-xs text-slate-400">TechPowerUp • Top Gear • VnExpress</span>
            </div>

            <div className="space-y-3">
              {latestStream.map((art) => (
                <ArticleCard key={art.id} article={art} variant="horizontal" />
              ))}
            </div>
          </div>

          {/* Sidebar: 4 cột */}
          <div className="lg:col-span-4 space-y-4">
            {/* Top Trending */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-1.5 pb-2.5 mb-2 border-b border-slate-100 dark:border-slate-800 font-extrabold text-sm text-slate-900 dark:text-white">
                <TrendingUp className="w-4 h-4 text-red-500" />
                Đọc Nhiều Nhất
              </div>

              <div className="space-y-1">
                {trendingArticles.map((art, idx) => (
                  <div key={art.id} className="py-2 flex items-start gap-2.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                    <span className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <Link href={`/article/${art.slug}`}>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 transition leading-snug">
                          {art.title}
                        </h4>
                      </Link>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {art.source} • {art.views.toLocaleString()} xem
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-md">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                Hệ Thống Phân Phối Tin
              </span>
              <h4 className="font-extrabold text-sm mt-0.5 mb-1.5">
                Đồng Bộ Tự Động Tech & Car
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Tin tức từ TechPowerUp và Top Gear được xử lý, lọc nội dung và cập nhật liên tục mỗi phút.
              </p>
              <Link
                href="/admin"
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
              >
                Mở Trang Quản Trị (/admin) ↗
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
