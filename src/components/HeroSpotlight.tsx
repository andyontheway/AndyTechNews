"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";
import { Flame, Clock, Sparkles, ArrowRight, BatteryCharging, Cpu, Car } from "lucide-react";
import { getThematicFallbackImage, isBlockedOrMissingImage } from "@/lib/fallback-images";

interface HeroSpotlightProps {
  lead: Article;
  side: Article[];
}

function formatRelativeTime(dateString: string) {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return "Vừa xong";
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Hôm qua";
    return `${diffDays} ngày trước`;
  } catch {
    return dateString;
  }
}

export default function HeroSpotlight({ lead, side }: HeroSpotlightProps) {
  const [leadImgError, setLeadImgError] = useState(false);
  const [sideImgErrors, setSideImgErrors] = useState<Record<string, boolean>>({});

  if (!lead) return null;

  const isTopGear = lead.source.includes("Top Gear");
  const isTechPowerUp = lead.source.includes("TechPowerUp");

  const leadBlocked = isBlockedOrMissingImage(lead.coverImage);
  const leadDisplayImage = leadBlocked || leadImgError ? getThematicFallbackImage(lead) : lead.coverImage;
  const hasValidLeadImage = Boolean(leadDisplayImage && leadDisplayImage.trim());

  const handleSideImgError = (id: string) => {
    setSideImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="my-4 sm:my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Main Lead Feature (7-8 Cols): Tin vừa mới vừa lớn nhất */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="relative group rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-md" style={{ position: "relative" }}>
            {hasValidLeadImage ? (
              <Image
                src={leadDisplayImage}
                alt={lead.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover object-center group-hover:scale-105 transition duration-500 opacity-85"
                onError={() => setLeadImgError(true)}
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  {lead.category === "auto" ? <Car className="w-12 h-12" /> : <Cpu className="w-12 h-12" />}
                </div>
              </div>
            )}

            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />

            {/* Subtle Minimal Pill on Top */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-lg animate-pulse">
                <Flame className="w-3 h-3" /> TIÊU ĐIỂM
              </span>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white z-10">
              <div className="flex items-center gap-2 text-xs text-slate-300 mb-1.5 flex-wrap">
                {isTopGear ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-slate-950 shadow">
                    TOP GEAR
                  </span>
                ) : isTechPowerUp ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-600 text-white shadow">
                    TECHPOWERUP
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/20 text-white">
                    {lead.source}
                  </span>
                )}
                <span className="font-semibold text-white capitalize">{lead.subcategory}</span>
                <span>•</span>
                <span>{formatRelativeTime(lead.publishedAt)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lead.readingTime}m đọc
                </span>
              </div>

              <Link href={`/article/${lead.slug}`}>
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug hover:text-blue-300 transition line-clamp-2 sm:line-clamp-3 mb-2">
                  {lead.title}
                </h2>
              </Link>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-3 hidden sm:block">
                {lead.excerpt}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/15">
                <div className="text-xs text-slate-300">
                  Nguồn: <strong className="text-white">{lead.source}</strong>
                </div>

                <Link
                  href={`/article/${lead.slug}`}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition"
                >
                  Xem ngay <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Side Headline Stack (4-5 Cols): 4 tin trọng tâm kế tiếp */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Điểm Nóng Toàn Cầu
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Feed
            </span>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 justify-between">
            {side.map((art, idx) => {
              const artIsTopGear = art.source.includes("Top Gear");
              const artIsTechPowerUp = art.source.includes("TechPowerUp");
              const sideBlocked = isBlockedOrMissingImage(art.coverImage);
              const sideDisplayImage = sideBlocked || sideImgErrors[art.id] ? getThematicFallbackImage(art) : art.coverImage;
              const hasSideImg = Boolean(sideDisplayImage && sideDisplayImage.trim());

              return (
                <div
                  key={art.id}
                  className="group p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition flex gap-3 items-center shadow-sm"
                >
                  {hasSideImg ? (
                    <div className="relative w-20 sm:w-24 aspect-[16/10] rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800" style={{ position: "relative" }}>
                      <Image
                        src={sideDisplayImage}
                        alt={art.title}
                        fill
                        sizes="96px"
                        className="object-cover object-center group-hover:scale-105 transition duration-300"
                        onError={() => handleSideImgError(art.id)}
                        unoptimized
                      />
                      <div className="absolute top-1 left-1 w-4 h-4 rounded bg-slate-950/80 text-white text-[10px] font-black flex items-center justify-center">
                        {idx + 1}
                      </div>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-black text-xs shrink-0">
                      {idx + 1}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] mb-1">
                      {artIsTopGear ? (
                        <span className="font-black px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px]">
                          TOP GEAR
                        </span>
                      ) : artIsTechPowerUp ? (
                        <span className="font-black px-1.5 py-0.2 rounded bg-blue-600 text-white text-[9px]">
                          TECHPOWERUP
                        </span>
                      ) : (
                        <span className="font-bold text-slate-500 text-[9px] uppercase">
                          {art.source}
                        </span>
                      )}
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-400">{formatRelativeTime(art.publishedAt)}</span>
                    </div>

                    <Link href={`/article/${art.slug}`}>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug line-clamp-2">
                        {art.title}
                      </h4>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
