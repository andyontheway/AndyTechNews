"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article, MainCategory, SubCategory, ImagePosition } from "@/types";
import {
  RefreshCw,
  PlusCircle,
  Trash2,
  ExternalLink,
  Cpu,
  Car,
  Flame,
  CheckCircle2,
  Search,
  Settings,
  Layers,
  Sparkles,
  ArrowLeft,
  ImageIcon,
  SlidersHorizontal,
  Eye,
  X,
  Save,
  Check,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from "lucide-react";

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  // Filtering & Pagination
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  // Image load tracking
  const [thumbErrors, setThumbErrors] = useState<Record<string, boolean>>({});
  const [previewImgError, setPreviewImgError] = useState(false);

  // Tabs: "manage" | "create"
  const [activeTab, setActiveTab] = useState<"manage" | "create">("manage");

  // EDIT / IMAGE ADJUSTMENT STUDIO MODAL
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");
  const [editImagePosition, setEditImagePosition] = useState<ImagePosition>("center");
  const [editCategory, setEditCategory] = useState<MainCategory>("tech");
  const [editSubcategory, setEditSubcategory] = useState<SubCategory>("pc");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [isFetchingBody, setIsFetchingBody] = useState(false);

  // New Article Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<MainCategory>("tech");
  const [subcategory, setSubcategory] = useState<SubCategory>("ai");
  const [coverImage, setCoverImage] = useState("");
  const [imagePosition, setImagePosition] = useState<ImagePosition>("center");
  const [author, setAuthor] = useState("Ban Biên Tập TechGear Daily");
  const [source, setSource] = useState("TechGear Editorial");
  const [featured, setFeatured] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [tags, setTags] = useState("");
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "Thông số", value: "" },
  ]);

  // Load articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/articles?limit=500");
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error("Failed to load articles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Open Edit & Image Adjust Modal
  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setEditTitle(art.title);
    setEditExcerpt(art.excerpt);
    setEditContent(art.content || "");
    setEditCoverImage(art.coverImage || "");
    setEditImagePosition(art.imagePosition || "center");
    setEditCategory(art.category);
    setEditSubcategory(art.subcategory);
    setEditFeatured(Boolean(art.featured));
    setPreviewImgError(false);
  };

  // Fetch Full Article Content from original URL
  const handleFetchFullContent = async () => {
    if (!editingArticle) return;
    setIsFetchingBody(true);
    try {
      const res = await fetch(`/api/articles/${editingArticle.id}/fetch-content`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.content) {
        setEditContent(data.content);
        setArticles((prev) =>
          prev.map((a) => (a.id === editingArticle.id ? { ...a, content: data.content } : a))
        );
        setFormSuccess(data.message || "Đã tải thành công nội dung bài viết gốc!");
        setTimeout(() => setFormSuccess(null), 4000);
      } else {
        alert(data.error || "Không thể tự động tải nội dung từ liên kết này.");
      }
    } catch (err: any) {
      alert(`Lỗi kết nối: ${err.message}`);
    } finally {
      setIsFetchingBody(false);
    }
  };

  // Save Image & Article Edits
  const handleSaveEdit = async () => {
    if (!editingArticle) return;
    setEditSaving(true);
    try {
      const res = await fetch(`/api/articles/${editingArticle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          excerpt: editExcerpt,
          content: editContent,
          coverImage: editCoverImage.trim(),
          imagePosition: editImagePosition,
          category: editCategory,
          subcategory: editSubcategory,
          featured: editFeatured,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) =>
          prev.map((a) => (a.id === editingArticle.id ? data.article : a))
        );
        setFormSuccess(`Đã lưu thay đổi cho bài viết: "${data.article.title.slice(0, 40)}..."`);
        setEditingArticle(null);
        setTimeout(() => setFormSuccess(null), 4000);
      } else {
        alert(data.error || "Không thể cập nhật bài viết");
      }
    } catch (err: any) {
      alert(`Lỗi khi lưu: ${err.message}`);
    } finally {
      setEditSaving(false);
    }
  };

  // Sync RSS Feeds
  const handleSyncRss = async () => {
    setIsSyncing(true);
    setSyncStatus("Đang đồng bộ tin tức từ Top Gear và TechPowerUp...");
    try {
      const res = await fetch("/api/sync-rss", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncStatus(`Đồng bộ thành công! Đã thêm ${data.addedCount} bài viết mới. Tổng số: ${data.totalCount} bài.`);
        await fetchArticles();
      } else {
        setSyncStatus(`Lỗi: ${data.error || "Không thể đồng bộ"}`);
      }
    } catch (err: any) {
      setSyncStatus(`Lỗi mạng: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string, artTitle: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết: "${artTitle}"?`)) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert(data.error || "Không thể xóa bài viết");
      }
    } catch (err: any) {
      alert(`Lỗi khi xóa: ${err.message}`);
    }
  };

  // Submit New Article
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(null);

    const specsObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      title,
      excerpt,
      content: content ? `<p>${content.replace(/\n\n/g, "</p><p>")}</p>` : `<p>${excerpt}</p>`,
      category,
      subcategory,
      coverImage: coverImage.trim(),
      imagePosition,
      author,
      source,
      featured,
      breaking,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      specs: Object.keys(specsObj).length > 0 ? specsObj : undefined,
    };

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess("Đăng bài viết mới thành công!");
        setTitle("");
        setExcerpt("");
        setContent("");
        setCoverImage("");
        setTags("");
        setSpecs([{ key: "Thông số", value: "" }]);
        await fetchArticles();
        setActiveTab("manage");
        setTimeout(() => setFormSuccess(null), 4000);
      } else {
        alert(data.error || "Có lỗi xảy ra khi tạo bài viết");
      }
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  // Filtered articles
  const filteredArticles = articles.filter((a) => {
    const matchCat = filterCategory === "all" || a.category === filterCategory;
    const matchSource =
      filterSource === "all" ||
      (filterSource === "topgear" && a.source.includes("Top Gear")) ||
      (filterSource === "tpu" && a.source.includes("TechPowerUp")) ||
      (filterSource === "vnexpress" && a.source.includes("VnExpress")) ||
      (filterSource === "editorial" && a.source.includes("Editorial"));
    const matchSearch =
      !searchFilter ||
      a.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.author.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSource && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const techCount = articles.filter((a) => a.category === "tech").length;
  const autoCount = articles.filter((a) => a.category === "auto").length;
  const topGearCount = articles.filter((a) => a.source.includes("Top Gear")).length;
  const tpuCount = articles.filter((a) => a.source.includes("TechPowerUp")).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Xem Trang Chủ
              </Link>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Link
                href="/topgear"
                className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
              >
                Top Gear Hub 🏎️
              </Link>
            </div>
            <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              Bảng Quản Trị TechGear Daily & Canh Chỉnh Hình Ảnh
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tùy chỉnh góc cắt ảnh, vị trí căn giữa/trên/dưới và đồng bộ tin tức từ Top Gear và TechPowerUp
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSyncRss}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Đang đồng bộ..." : "Đồng Bộ Top Gear & TPU"}
            </button>
          </div>
        </div>

        {/* Sync Status Feedback */}
        {syncStatus && (
          <div className="p-3.5 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncStatus}</span>
            </div>
            <button onClick={() => setSyncStatus(null)} className="underline font-bold text-xs">
              Đóng
            </button>
          </div>
        )}

        {formSuccess && (
          <div className="p-3.5 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{formSuccess}</span>
          </div>
        )}

        {/* Quick KPI Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[11px] text-slate-500 font-semibold mb-0.5">Tổng bài viết</div>
            <div className="text-2xl font-black">{articles.length}</div>
            <div className="text-[10px] text-emerald-600 font-medium">Lưu trữ trong hệ thống</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[11px] text-amber-500 font-black mb-0.5 flex items-center gap-1">
              <Car className="w-3.5 h-3.5" /> Top Gear (Xe)
            </div>
            <div className="text-2xl font-black text-amber-500">{topGearCount}</div>
            <div className="text-[10px] text-slate-400">Siêu xe & Xe điện</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[11px] text-blue-600 font-black mb-0.5 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> TechPowerUp (Tech)
            </div>
            <div className="text-2xl font-black text-blue-600">{tpuCount}</div>
            <div className="text-[10px] text-slate-400">Hardware & AI</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[11px] text-red-600 font-black mb-0.5 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Tiêu Điểm Hot
            </div>
            <div className="text-2xl font-black text-red-600">
              {articles.filter((a) => a.featured).length}
            </div>
            <div className="text-[10px] text-slate-400">Ghim trên banner</div>
          </div>
        </div>

        {/* Tab Controls: Manage / Canh Chỉnh Ảnh vs Soạn Bài Mới */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-3 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab("manage");
              setEditingArticle(null);
            }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "manage"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Canh Chỉnh Ảnh & Quản Lý Bài Viết ({articles.length})
          </button>

          <button
            onClick={() => {
              setActiveTab("create");
              setEditingArticle(null);
            }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "create"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Soạn Thảo Bài Viết Mới
          </button>
        </div>

        {/* ======================================================== */}
        {/* EDIT / IMAGE ADJUSTMENT STUDIO MODAL (CANH CHỈNH ẢNH) */}
        {/* ======================================================== */}
        {editingArticle && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-blue-500/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Studio Canh Chỉnh Hình Ảnh & Biên Tập Bài Viết
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ID: {editingArticle.id} • Nguồn: {editingArticle.source}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Cột trái: Live Preview & Alignment Control (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Xem trước ảnh hiển thị (Tỷ lệ chuẩn 16:10)</span>
                  <span className="text-[10px] text-blue-600 font-normal">
                    {editCoverImage ? "Đang có ảnh" : "Chế độ chữ tinh gọn"}
                  </span>
                </div>

                {/* Box Live Preview */}
                {editCoverImage && !previewImgError ? (
                  <div
                    className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shadow-inner"
                    style={{ position: "relative", minHeight: "220px", aspectRatio: "16 / 10" }}
                  >
                    <Image
                      src={editCoverImage}
                      alt="Preview"
                      fill
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className={`object-cover ${
                        editImagePosition === "top"
                          ? "object-top"
                          : editImagePosition === "bottom"
                          ? "object-bottom"
                          : editImagePosition === "contain"
                          ? "!object-contain bg-slate-950 p-1"
                          : "object-center"
                      }`}
                      onError={() => setPreviewImgError(true)}
                      unoptimized
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] text-white font-mono flex items-center gap-1.5 shadow">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                      Vị trí: {editImagePosition}
                    </div>
                  </div>
                ) : (
                  <div
                    className="aspect-[16/10] rounded-xl bg-slate-100 dark:bg-slate-850 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center"
                    style={{ minHeight: "220px", aspectRatio: "16 / 10" }}
                  >
                    {previewImgError ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/80 text-red-500 flex items-center justify-center mb-2">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">
                          Không tải được ảnh từ đường dẫn này
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 max-w-xs">
                          URL ảnh bị lỗi, 404 hoặc bị máy chủ nguồn chặn. Bạn hãy dán URL ảnh khác hoặc chọn mẫu ảnh có sẵn bên dưới.
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewImgError(false)}
                          className="mt-2 px-3 py-1 bg-slate-200 dark:bg-slate-700 text-[10px] font-bold rounded-lg hover:bg-slate-300 text-slate-700 dark:text-slate-200 transition"
                        >
                          Thử tải lại ảnh
                        </button>
                      </>
                    ) : (
                      <>
                        <FileText className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          Không có ảnh (Chế độ Text-First)
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">
                          Thẻ bài viết sẽ tự động co lại vừa vặn với chữ, không để lại khoảng trống thừa.
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Alignment Button Controls */}
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Góc Cắt & Căn Chỉnh Vị Trí Ảnh (Image Alignment):
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditImagePosition("center")}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                        editImagePosition === "center"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                      }`}
                    >
                      🎯 Căn Giữa (Center)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditImagePosition("top")}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                        editImagePosition === "top"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                      }`}
                    >
                      ⬆️ Căn Trên (Mui xe/Mặt)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditImagePosition("bottom")}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                        editImagePosition === "bottom"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                      }`}
                    >
                      ⬇️ Căn Dưới (Bánh xe/Đường)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditImagePosition("contain")}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                        editImagePosition === "contain"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                      }`}
                    >
                      🖼️ Vừa Khung (Contain)
                    </button>
                  </div>
                </div>

                {/* Quick Presets / Clear image */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Thao tác nhanh hình ảnh:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditCoverImage("")}
                      className="px-2.5 py-1 rounded bg-red-50 dark:bg-red-950/40 text-red-600 font-bold border border-red-200 dark:border-red-800 text-[11px]"
                    >
                      ✕ Xóa ảnh (Về thẻ chữ)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditCoverImage(
                          "https://www.topgear.com/sites/default/files/images/news-article/2026/11/a2302abba551895fb8349b740f72fe6f/Ferrari_20261121_PIC_16_9_009.jpg"
                        )
                      }
                      className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium text-[11px] border border-amber-200 dark:border-amber-800"
                    >
                      Ferrari Supercar
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditCoverImage("https://www.techpowerup.com/img/bmmAD5T5WJAKHbTm.jpg")
                      }
                      className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium text-[11px] border border-blue-200 dark:border-blue-800"
                    >
                      TechPowerUp SSD
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditCoverImage("https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200")
                      }
                      className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-[11px]"
                    >
                      VinFast EV
                    </button>
                  </div>
                </div>
              </div>

              {/* Cột phải: Form chỉnh sửa chi tiết (7 cols) */}
              <div className="lg:col-span-7 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Đường link ảnh bìa (Cover Image URL):
                  </label>
                  <input
                    type="url"
                    value={editCoverImage}
                    onChange={(e) => setEditCoverImage(e.target.value)}
                    placeholder="Nhập URL ảnh https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tiêu đề bài viết:
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Chuyên mục chính:
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as MainCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    >
                      <option value="tech">Công Nghệ</option>
                      <option value="auto">Xe Cộ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phân mục con:
                    </label>
                    <select
                      value={editSubcategory}
                      onChange={(e) => setEditSubcategory(e.target.value as SubCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    >
                      {editCategory === "tech" ? (
                        <>
                          <option value="pc">PC & Hardware</option>
                          <option value="ai">Trí tuệ nhân tạo (AI)</option>
                          <option value="reviews">Đánh giá & Benchmark</option>
                          <option value="smartphones">Smartphone</option>
                          <option value="gadgets">Thiết bị thông minh</option>
                        </>
                      ) : (
                        <>
                          <option value="cars">Ô tô & Siêu xe (Supercars)</option>
                          <option value="ev">Xe Điện (EV) & Pin</option>
                          <option value="auto-reviews">Đánh giá lái thử</option>
                          <option value="motorbikes">Xe máy & PKL</option>
                          <option value="market">Thị trường xe</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tóm tắt bài viết (Excerpt):
                  </label>
                  <textarea
                    rows={3}
                    value={editExcerpt}
                    onChange={(e) => setEditExcerpt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                      Nội dung chi tiết (HTML / Toàn văn bài viết):
                    </label>
                    {editingArticle.sourceUrl && (
                      <button
                        type="button"
                        onClick={handleFetchFullContent}
                        disabled={isFetchingBody}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition disabled:opacity-50 shadow-sm"
                      >
                        <RefreshCw className={`w-3 h-3 ${isFetchingBody ? "animate-spin" : ""}`} />
                        {isFetchingBody ? "Đang cào bài từ nguồn..." : "Tự động lấy bài viết đầy đủ từ nguồn"}
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={8}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Nhập hoặc dán nội dung chi tiết (hỗ trợ thẻ HTML: <p>, <h3>, <img>, <blockquote>...)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>Độ dài: {editContent.length} ký tự</span>
                    {editingArticle.sourceUrl && (
                      <a
                        href={editingArticle.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-0.5"
                      >
                        Mở bài gốc <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={editFeatured}
                      onChange={(e) => setEditFeatured(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Ghim lên Tiêu Điểm Lớn (Hero Spotlight)</span>
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs hover:bg-slate-300 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={editSaving}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {editSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: DANH SÁCH BÀI VIẾT & NÚT CANH CHỈNH ẢNH */}
        {/* ======================================================== */}
        {activeTab === "manage" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-extrabold">
                  Kho Bài Viết ({filteredArticles.length} / {articles.length})
                </h3>
              </div>

              {/* Advanced Filter Controls */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm theo tên xe, chip..."
                    value={searchFilter}
                    onChange={(e) => {
                      setSearchFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs w-48"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={filterSource}
                  onChange={(e) => {
                    setFilterSource(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="all">Mọi nguồn tin</option>
                  <option value="topgear">Top Gear (Xe)</option>
                  <option value="tpu">TechPowerUp (Tech)</option>
                  <option value="vnexpress">VnExpress</option>
                  <option value="editorial">TechGear Editorial</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="all">Mọi chuyên mục</option>
                  <option value="auto">Chỉ Xe cộ</option>
                  <option value="tech">Chỉ Công nghệ</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-slate-400">Đang nạp danh sách bài viết...</div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">Không tìm thấy bài viết nào phù hợp bộ lọc.</div>
            ) : (
              <>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[640px] overflow-y-auto pr-1">
                  {paginatedArticles.map((art) => {
                    const isTG = art.source.includes("Top Gear");
                    const isTPU = art.source.includes("TechPowerUp");
                    const hasValidThumb = Boolean(art.coverImage && art.coverImage.trim()) && !thumbErrors[art.id];

                    return (
                      <div
                        key={art.id}
                        className="py-3 flex items-start justify-between gap-3 group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 p-2 rounded-xl transition"
                      >
                        {/* Thumbnail with visual position badge */}
                        <div
                          className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                          style={{ position: "relative", width: "80px", height: "56px" }}
                        >
                          {hasValidThumb ? (
                            <Image
                              src={art.coverImage}
                              alt={art.title}
                              fill
                              sizes="80px"
                              loading="lazy"
                              className={`object-cover ${
                                art.imagePosition === "top"
                                  ? "object-top"
                                  : art.imagePosition === "bottom"
                                  ? "object-bottom"
                                  : art.imagePosition === "contain"
                                  ? "!object-contain bg-slate-950"
                                  : "object-center"
                              }`}
                              onError={() => setThumbErrors((prev) => ({ ...prev, [art.id]: true }))}
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[9px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-800">
                              <FileText className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                              <span>{art.coverImage ? "Lỗi ảnh" : "Chữ"}</span>
                            </div>
                          )}
                          {art.imagePosition && (
                            <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] text-white text-center font-mono py-0.2">
                              {art.imagePosition}
                            </div>
                          )}
                        </div>

                        {/* Content info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            {isTG ? (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                                TOP GEAR
                              </span>
                            ) : isTPU ? (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-600 text-white">
                                TECHPOWERUP
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-500 uppercase">
                                {art.source}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">
                              • {art.subcategory}
                            </span>
                            {art.featured && (
                              <span className="text-[9px] font-bold bg-red-100 dark:bg-red-950 text-red-600 px-1.5 rounded">
                                Tiêu điểm
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              • {new Date(art.publishedAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>

                          <Link
                            href={`/article/${art.slug}`}
                            target="_blank"
                            className="font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600 line-clamp-1 leading-snug"
                          >
                            {art.title}
                          </Link>

                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {art.excerpt}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 pt-1">
                          <button
                            onClick={() => handleOpenEdit(art)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold text-[11px] flex items-center gap-1 border border-blue-200 dark:border-blue-800 transition cursor-pointer"
                            title="Canh chỉnh ảnh & biên tập"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            Chỉnh ảnh
                          </button>

                          <Link
                            href={`/article/${art.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Xem bài viết"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDeleteArticle(art.id, art.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                            title="Xóa bài viết"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="text-slate-500 text-[11px]">
                      Đang xem {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredArticles.length)} trên tổng{" "}
                      <strong>{filteredArticles.length}</strong> bài viết
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Trước
                      </button>

                      <div className="text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {currentPage} / {totalPages}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        Sau <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: SOẠN THẢO BÀI VIẾT MỚI */}
        {/* ======================================================== */}
        {activeTab === "create" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-base font-extrabold pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-blue-600" /> Soạn Thảo Bài Viết Mới
            </h3>

            <form onSubmit={handleSubmitArticle} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold mb-1">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tiêu đề bài viết..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Chuyên mục chính *</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const val = e.target.value as MainCategory;
                      setCategory(val);
                      setSubcategory(val === "tech" ? "pc" : "cars");
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="tech">Công Nghệ</option>
                    <option value="auto">Xe Cộ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Phân mục con *</label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value as SubCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    {category === "tech" ? (
                      <>
                        <option value="pc">PC & Hardware</option>
                        <option value="ai">Trí tuệ AI</option>
                        <option value="reviews">Đánh giá & Benchmark</option>
                        <option value="smartphones">Smartphone</option>
                        <option value="gadgets">Thiết bị thông minh</option>
                      </>
                    ) : (
                      <>
                        <option value="cars">Ô tô & Siêu xe</option>
                        <option value="ev">Xe Điện (EV)</option>
                        <option value="auto-reviews">Đánh giá lái thử</option>
                        <option value="motorbikes">Xe máy & PKL</option>
                        <option value="market">Thị trường xe</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Link Ảnh Bìa (URL)</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://... (Để trống nếu muốn bài dạng chữ tinh gọn)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Căn chỉnh góc ảnh</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["center", "top", "bottom", "contain"] as ImagePosition[]).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setImagePosition(pos)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                        imagePosition === pos
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Tóm tắt (Excerpt) *</label>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Ghim Tiêu Điểm Lớn</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase shadow transition"
              >
                Xuất Bản Bài Viết
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
