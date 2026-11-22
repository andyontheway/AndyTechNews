"use client";

import { useState } from "react";
import { Car, Cpu, BatteryCharging, Zap, CheckCircle2 } from "lucide-react";

export default function TechAutoShowcase() {
  const [activeTab, setActiveTab] = useState<"auto" | "tech">("auto");

  return (
    <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-xl border border-indigo-900/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-indigo-800/50">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-0.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Đo Lường Thông Số & So Sánh
          </div>
          <h3 className="text-base sm:text-lg font-black">Bảng Đo Hiệu Năng Thế Hệ Mới</h3>
        </div>

        {/* Tab switchers */}
        <div className="inline-flex rounded-xl bg-slate-800/80 p-0.5 border border-indigo-700/50 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab("auto")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "auto"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Car className="w-3 h-3" /> Top Gear / Xe Điện
          </button>
          <button
            onClick={() => setActiveTab("tech")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "tech"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Cpu className="w-3 h-3" /> TechPowerUp / Vi Xử Lý
          </button>
        </div>
      </div>

      {activeTab === "auto" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Car 1 */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-amber-500/30 hover:border-amber-400 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <BatteryCharging className="w-3 h-3" /> Thuần Điện AWD
              </span>
              <span className="text-xs font-black text-amber-400">999.000.000 VNĐ</span>
            </div>
            <h4 className="text-base font-extrabold text-white mb-0.5">VinFast VF 7 Plus</h4>
            <p className="text-[11px] text-slate-300 mb-3">SUV Thể thao phân khúc C, thiết kế khí động học cao cấp</p>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Công suất tối đa:</span>
                <span className="font-bold text-white">349 mã lực (260 kW)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Mô-men xoắn:</span>
                <span className="font-bold text-white">500 Nm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Tăng tốc 0-100 km/h:</span>
                <span className="font-bold text-amber-400">5.8 giây</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Pin & Tầm hoạt động:</span>
                <span className="font-bold text-white">75.3 kWh / 431 km</span>
              </div>
            </div>
          </div>

          {/* Car 2 */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-indigo-500/30 hover:border-indigo-400 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <BatteryCharging className="w-3 h-3" /> 800V Architecture
              </span>
              <span className="text-xs font-black text-indigo-300">Top Gear Rated</span>
            </div>
            <h4 className="text-base font-extrabold text-white mb-0.5">Ferrari 296 Challenge Stradale</h4>
            <p className="text-[11px] text-slate-300 mb-3">Siêu xe thuần động cơ đốt trong 670 bhp đỉnh cao từ Maranello</p>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Động cơ:</span>
                <span className="font-bold text-white">V6 Twin-Turbo Non-Hybrid</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Công suất cực đại:</span>
                <span className="font-bold text-white">670 BHP</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Khối lượng khô:</span>
                <span className="font-bold text-indigo-400">Siêu nhẹ Carbon-Fiber</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Đánh giá Top Gear:</span>
                <span className="font-bold text-emerald-400">The coolest 296 yet</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tech 1 */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-blue-500/30 hover:border-blue-400 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> TechPowerUp Preview
              </span>
              <span className="text-xs font-black text-blue-400">NPU SSD Controller</span>
            </div>
            <h4 className="text-base font-extrabold text-white mb-0.5">Phison AI SSD Controller</h4>
            <p className="text-[11px] text-slate-300 mb-3">Chạy mô hình AI trực tiếp trên vi điều khiển SSD</p>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Vi xử lý tích hợp:</span>
                <span className="font-bold text-white">Dedicated On-board NPU</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Tốc độ đọc/ghi:</span>
                <span className="font-bold text-blue-400">PCIe Gen 5 x4 (14.000 MB/s)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Tác vụ AI:</span>
                <span className="font-bold text-emerald-400">Local LLM Offloading</span>
              </div>
            </div>
          </div>

          {/* Tech 2 */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-purple-500/30 hover:border-purple-400 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Flagship Mobile
              </span>
              <span className="text-xs font-black text-purple-400">Snapdragon 8 Elite</span>
            </div>
            <h4 className="text-base font-extrabold text-white mb-0.5">Qualcomm Oryon Architecture</h4>
            <p className="text-[11px] text-slate-300 mb-3">Xung nhịp 4.32 GHz trên tiến trình 3nm</p>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Nhân CPU:</span>
                <span className="font-bold text-white">2 Prime 4.32GHz + 6 Performance 3.53GHz</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">NPU Xử lý AI:</span>
                <span className="font-bold text-purple-400">Hexagon NPU 45% Nhanh hơn</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60 text-[11px]">
                <span className="text-slate-400">Hiệu năng đồ họa:</span>
                <span className="font-bold text-emerald-400">Adreno 830 Ray Tracing</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
