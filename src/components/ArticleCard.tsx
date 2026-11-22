"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";
import { Clock, BatteryCharging, Cpu, Car, FileText } from "lucide-react";
import { getThematicFallbackImage, isBlockedOrMissingImage } from "@/lib/fallback-images";

interface ArticleCardProps {
  article: Article;
  variant?: "standard" | "horizontal" | "compact" | "lead" | "strip";
  priority?: boolean;
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
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export default function ArticleCard({
  article,
  variant = "standard",
  priority = false,
}: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);
  const isAuto = article.category === "auto";
  const isTopGear = article.source.includes("Top Gear");
  const isTechPowerUp = article.source.includes("TechPowerUp");

  const isBlocked = isBlockedOrMissingImage(article.coverImage);
  const displayImage = isBlocked || imgError ? getThematicFallbackImage(article) : article.coverImage;
  const hasValidImage = Boolean(displayImage && displayImage.trim());

  const positionClass =
    article.imagePosition === "top"
      ? "object-top"
      : article.imagePosition === "bottom"
      ? "object-bottom"
      : article.imagePosition === "contain"
      ? "!object-contain bg-slate-950 p-1"
      : "object-center";

  // Source Badge Pill
  const sourceBadge = isTopGear ? (
    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 shadow-sm shrink-0">
      TOP GEAR
    </span>
  ) : isTechPowerUp ? (
    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white shadow-sm shrink-0">
      TECHPOWERUP
    </span>
  ) : (
    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
      {article.source}
    </span>
  );

  // ==========================================
  // VARIANT: STRIP (Dòng tin nhanh 4 thẻ ngang)
  // ==========================================
  if (variant === "strip") {
    return (
      <article className="group bg-white dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 p-2.5 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition flex items-center gap-2.5">
        {hasValidImage ? (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800" style={{ position: "relative" }}>
            <Image
              src={displayImage}
              alt={article.title}
              fill
              sizes="64px"
              className={`object-cover ${positionClass} group-hover:scale-105 transition duration-300`}
              onError={() => setImgError(true)}
              unoptimized
            />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            {isAuto ? <Car className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] mb-0.5">
            {sourceBadge}
            <span className="text-slate-400">• {formatRelativeTime(article.publishedAt)}</span>
          </div>
          <Link href={`/article/${article.slug}`}>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition leading-snug">
              {article.title}
            </h4>
          </Link>
        </div>
      </article>
    );
  }

  // ==========================================
  // VARIANT: COMPACT (Hàng danh sách gọn)
  // ==========================================
  if (variant === "compact") {
    return (
      <article className="group flex items-start gap-2.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 last:border-0">
        {hasValidImage ? (
          <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800" style={{ position: "relative" }}>
            <Image
              src={displayImage}
              alt={article.title}
              fill
              sizes="80px"
              className={`object-cover ${positionClass} group-hover:scale-105 transition duration-300`}
              onError={() => setImgError(true)}
              unoptimized
            />
          </div>
        ) : (
          <div className="w-2 h-10 rounded-full bg-blue-500/40 shrink-0 self-center" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] mb-0.5">
            {sourceBadge}
            <span className="text-slate-400">{formatRelativeTime(article.publishedAt)}</span>
          </div>
          <Link href={`/article/${article.slug}`}>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition leading-snug">
              {article.title}
            </h4>
          </Link>
        </div>
      </article>
    );
  }

  // ==========================================
  // VARIANT: HORIZONTAL (Thẻ ngang cân đối)
  // ==========================================
  if (variant === "horizontal") {
    return (
      <article className="group bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition flex flex-col sm:flex-row gap-3">
        {hasValidImage ? (
          /* Locked aspect ratio [16/10], clean image with NO overlay clutter */
          <div className="relative w-full sm:w-44 md:w-48 aspect-[16/10] shrink-0 self-start sm:self-center rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800" style={{ position: "relative" }}>
            <Image
              src={displayImage}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, 192px"
              className={`object-cover ${positionClass} group-hover:scale-105 transition duration-300`}
              onError={() => setImgError(true)}
              unoptimized
            />
          </div>
        ) : (
          /* Text-only banner accent when no image: NO awkward whitespace */
          <div className="w-1.5 sm:w-2 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full self-stretch shrink-0" />
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1 flex-wrap">
              {sourceBadge}
              <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize text-[10px]">
                {article.subcategory}
              </span>
              {article.breaking && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-600 text-white">
                  HOT
                </span>
              )}
              <span>•</span>
              <span>{formatRelativeTime(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" /> {article.readingTime}m
              </span>
            </div>

            <Link href={`/article/${article.slug}`}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug line-clamp-2 mb-1">
                {article.title}
              </h3>
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {article.specs && Object.keys(article.specs).length > 0 && (
            <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-1.5 text-[10px]">
              {Object.entries(article.specs).slice(0, 2).map(([key, val]) => (
                <span
                  key={key}
                  className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300"
                >
                  <strong className="text-slate-800 dark:text-slate-200">{key}:</strong> {val}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    );
  }

  // ==========================================
  // VARIANT: STANDARD (Thẻ dọc)
  // ==========================================
  return (
    <article className="group bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col">
      {hasValidImage ? (
        /* Strict locked aspect ratio [16/10] + object-cover object-center: NEVER stretched, 100% clean image with NO overlay tags */
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800" style={{ position: "relative" }}>
          <Image
            src={displayImage}
            alt={article.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover ${positionClass} group-hover:scale-105 transition duration-500`}
            onError={() => setImgError(true)}
            unoptimized
          />
        </div>
      ) : (
        /* Text-only header accent bar when NO image: Eliminates empty 16/10 gray block */
        <div className="pt-3.5 px-3.5 sm:pt-4 sm:px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5">
            {sourceBadge}
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {article.category === "auto" ? "Xe cộ" : "Công nghệ"}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">{formatRelativeTime(article.publishedAt)}</span>
        </div>
      )}

      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 flex-wrap gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {sourceBadge}
              <span className="font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                {article.category === "auto" ? "Xe cộ" : "Công nghệ"} • {article.subcategory}
              </span>
              {article.breaking && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-600 text-white animate-pulse">
                  HOT
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>{formatRelativeTime(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.readingTime}m</span>
            </div>
          </div>

          <Link href={`/article/${article.slug}`}>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug line-clamp-2 mb-1.5">
              {article.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
            {article.excerpt}
          </p>
        </div>

        {article.specs && Object.keys(article.specs).length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-1 text-[10px]">
            {Object.entries(article.specs).slice(0, 2).map(([key, val]) => (
              <div key={key} className="bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded truncate">
                <span className="text-slate-400 block text-[9px] truncate">{key}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
