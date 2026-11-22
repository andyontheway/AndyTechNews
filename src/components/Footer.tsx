import Link from "next/link";
import { Zap, Cpu, Car, BatteryCharging, Rss, ShieldCheck, Mail, Phone, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="flex items-center text-2xl font-black tracking-tight text-white">
                  <span className="text-blue-500">TECH</span>
                  <span className="text-amber-400">GEAR</span>
                  <span className="text-[11px] ml-1.5 px-1.5 py-0.5 rounded bg-blue-900/70 text-blue-300 font-extrabold uppercase tracking-wider">
                    DAILY
                  </span>
                </div>
                <p className="text-[10px] font-semibold tracking-wide text-slate-400 mt-0.5">
                  Driving the Future of Tech • Dẫn lối tương lai công nghệ
                </p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Cổng thông tin hàng đầu cập nhật 24/7 xu hướng phần cứng máy tính, AI, chip xử lý từ TechPowerUp cùng thế giới siêu xe, xe điện và bài đánh giá lái từ Top Gear UK.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                <Rss className="w-3.5 h-3.5 text-orange-400" /> RSS Syndication Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Chuẩn SEO Google
              </span>
            </div>
          </div>

          {/* Col 1: Tech */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" /> Công Nghệ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/ai" className="hover:text-blue-400 transition">
                  Trí Tuệ Nhân Tạo (AI)
                </Link>
              </li>
              <li>
                <Link href="/category/smartphones" className="hover:text-blue-400 transition">
                  Điện Thoại Thông Minh
                </Link>
              </li>
              <li>
                <Link href="/category/pc" className="hover:text-blue-400 transition">
                  Máy Tính & Phần Cứng
                </Link>
              </li>
              <li>
                <Link href="/category/reviews" className="hover:text-blue-400 transition">
                  Đánh Giá & Mở Hộp
                </Link>
              </li>
              <li>
                <Link href="/category/gadgets" className="hover:text-blue-400 transition">
                  Phụ Kiện & Smart Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Auto */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" /> Xe Cộ & Vận Tải
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/ev" className="hover:text-amber-400 transition flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-emerald-400" /> Xe Điện (EV) & Pin
                </Link>
              </li>
              <li>
                <Link href="/category/cars" className="hover:text-amber-400 transition">
                  Ô Tô & Giá Lăn Bánh
                </Link>
              </li>
              <li>
                <Link href="/category/motorbikes" className="hover:text-amber-400 transition">
                  Xe Máy & Phân Khối Lớn
                </Link>
              </li>
              <li>
                <Link href="/category/auto-reviews" className="hover:text-amber-400 transition">
                  Trải Nghiệm Lái Thực Tế
                </Link>
              </li>
              <li>
                <Link href="/category/market" className="hover:text-amber-400 transition">
                  Thị Trường & Chính Sách
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quản trị & Liên hệ */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Hệ Thống
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin" className="text-amber-400 font-semibold hover:underline">
                  Quản Trị CMS (/admin)
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition">
                  Tìm Kiếm Bài Viết
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Nguồn dữ liệu: TechPowerUp, Top Gear UK, VnExpress</span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>Email: contact@techgeardaily.com</div>
              <div>Hotline: 1900 xxxx (Hà Nội, Việt Nam)</div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 TechGear Daily. Driving the Future of Tech (Dẫn lối tương lai công nghệ).</p>
          <p className="flex items-center gap-1">
            Thiết kế & Vận hành với <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
