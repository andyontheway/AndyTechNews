import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/storage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { 
  Car, 
  Flame, 
  BatteryCharging, 
  Gauge, 
  Trophy, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  Zap
} from "lucide-react";

export const metadata = {
  title: "Top Gear Hub - Siêu Xe, Xe Điện & Đánh Giá Xe Toàn Cầu | TechGear Daily",
  description: "Chuyên mục độc quyền tổng hợp tin tức siêu xe, xe điện EV, đánh giá đường trường và bảng thông số kỹ thuật chuẩn Top Gear UK.",
};

export default function TopGearPage() {
  const allArticles = getAllArticles();
  
  // Filter all Top Gear articles + high-performance auto articles
  const topGearArticles = allArticles.filter(
    (a) => a.source.includes("Top Gear") || a.category === "auto"
  );

  const supercars = topGearArticles.filter(
    (a) =>
      a.title.toLowerCase().includes("ferrari") ||
      a.title.toLowerCase().includes("supercar") ||
      a.title.toLowerCase().includes("porsche") ||
      a.title.toLowerCase().includes("stradale") ||
      a.title.toLowerCase().includes("macan") ||
      a.subcategory === "cars"
  );

  const electricCars = topGearArticles.filter(
    (a) => a.subcategory === "ev" || a.title.toLowerCase().includes("electric") || a.title.toLowerCase().includes("ev")
  );

  const leadCar = topGearArticles.find((a) => a.source.includes("Top Gear")) || topGearArticles[0];
  const otherCars = topGearArticles.filter((a) => a.id !== leadCar?.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header breakingArticles={topGearArticles.slice(0, 3)} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 flex-1 w-full space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/category/auto" className="hover:text-amber-400 transition">
            Xe Cộ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-amber-400 font-bold uppercase tracking-wider">Top Gear Hub</span>
        </nav>

        {/* Top Gear Banner Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#001024] via-slate-900 to-[#001833] border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-md">
                  TOP GEAR GARAGE
                </span>
                <span className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Official Global Car Syndication
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Siêu Xe, Xe Điện & Văn Hóa Tốc Độ
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Kênh tin tức chuyên biệt cập nhật những cỗ máy tốc độ đỉnh cao nhất hành tinh, các đánh giá lái thử độc quyền từ Top Gear UK và bước chuyển mình sang kỷ nguyên xe thuần điện (EV).
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-3 gap-2.5 shrink-0 text-center">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-xl font-black text-amber-400">{topGearArticles.length}+</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Mẫu Xe</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-xl font-black text-cyan-400">{supercars.length}</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Siêu Xe</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-xl font-black text-emerald-400">{electricCars.length}</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Xe Điện EV</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Gear Spotlight Lead Feature */}
        {leadCar && (
          <section className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-slate-900 border border-slate-800 shadow-xl group" style={{ position: "relative" }}>
            {leadCar.coverImage && (
              <Image
                src={leadCar.coverImage}
                alt={leadCar.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover object-center group-hover:scale-105 transition duration-700 opacity-80"
                unoptimized
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow">
                TOP GEAR COVER STORY
              </span>
              {leadCar.subcategory === "ev" && (
                <span className="px-2.5 py-1 rounded bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow">
                  <BatteryCharging className="w-3.5 h-3.5" /> Thuần Điện
                </span>
              )}
            </div>

            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8">
              <Link href={`/article/${leadCar.slug}`}>
                <h2 className="text-xl sm:text-3xl font-black text-white hover:text-amber-400 transition leading-snug line-clamp-2 mb-2">
                  {leadCar.title}
                </h2>
              </Link>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-2xl leading-relaxed mb-4">
                {leadCar.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span>Nguồn: <strong className="text-white">{leadCar.source}</strong></span>
                  <span>•</span>
                  <span>{new Date(leadCar.publishedAt).toLocaleDateString("vi-VN")}</span>
                </div>

                <Link
                  href={`/article/${leadCar.slug}`}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow transition"
                >
                  Khám phá xe ↗
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Section: Siêu Xe & Hiệu Năng Cao (Supercars & Track Toys) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-amber-500">
            <h3 className="text-base sm:text-lg font-black text-white uppercase flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Siêu Xe & Xe Thể Thao (Supercars)
            </h3>
            <span className="text-xs text-slate-400 font-medium">BHP, 0-100 km/h, Verdict</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supercars.slice(0, 6).map((art) => (
              <ArticleCard key={art.id} article={art} variant="standard" />
            ))}
          </div>
        </section>

        {/* Section: Xe Thuần Điện & Hybrid (EV Revolution) */}
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-500">
            <h3 className="text-base sm:text-lg font-black text-white uppercase flex items-center gap-2">
              <BatteryCharging className="w-5 h-5 text-emerald-400" />
              Kỷ Nguyên Xe Điện (Electric Revolution)
            </h3>
            <span className="text-xs text-slate-400 font-medium">Pin, Tầm hoạt động & Sạc 800V</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {electricCars.slice(0, 6).map((art) => (
              <ArticleCard key={art.id} article={art} variant="standard" />
            ))}
          </div>
        </section>

        {/* Dòng xe mới cập nhật khác */}
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Toàn Bộ Kho Xe Top Gear
            </h3>
            <span className="text-xs text-slate-400">Được đồng bộ liên tục</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherCars.slice(6, 16).map((art) => (
              <ArticleCard key={art.id} article={art} variant="horizontal" />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
