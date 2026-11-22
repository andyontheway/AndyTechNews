import { CategoryInfo, RssFeedConfig } from "@/types";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "tech",
    name: "Công Nghệ",
    slug: "tech",
    description: "Cập nhật xu hướng AI, phần cứng, vi xử lý, card đồ họa và thiết bị từ TechPowerUp và các nguồn hàng đầu thế giới.",
    subcategories: [
      { id: "pc", name: "PC & Phần Cứng (Hardware)", slug: "pc" },
      { id: "ai", name: "Trí Tuệ Nhân Tạo (AI & NPU)", slug: "ai" },
      { id: "reviews", name: "Đánh Giá & Benchmark", slug: "reviews" },
      { id: "smartphones", name: "Điện Thoại & Di Động", slug: "smartphones" },
      { id: "gadgets", name: "Thiết Bị Thông Minh", slug: "gadgets" },
    ],
  },
  {
    id: "auto",
    name: "Xe Cộ & Vận Tải",
    slug: "auto",
    description: "Tin tức siêu xe, xe điện thế hệ mới, đánh giá xe và văn hóa tốc độ từ Top Gear toàn cầu.",
    subcategories: [
      { id: "cars", name: "Ô Tô & Siêu Xe (Supercars)", slug: "cars" },
      { id: "ev", name: "Xe Điện (EV) & Công Nghệ Pin", slug: "ev" },
      { id: "auto-reviews", name: "Trải Nghiệm & Đánh Giá Lái", slug: "auto-reviews" },
      { id: "motorbikes", name: "Xe Máy & Phân Khối Lớn", slug: "motorbikes" },
      { id: "market", name: "Thị Trường & Xu Hướng Xe", slug: "market" },
    ],
  },
];

export const RSS_FEEDS: RssFeedConfig[] = [
  // 1. Tech: TechPowerUp (Hardware, GPUs, CPUs, Motherboards, AI)
  {
    name: "TechPowerUp News",
    url: "https://www.techpowerup.com/rss/news",
    category: "tech",
    defaultSubcategory: "pc",
  },
  {
    name: "TechPowerUp Reviews",
    url: "https://www.techpowerup.com/rss/reviews",
    category: "tech",
    defaultSubcategory: "reviews",
  },

  // 2. Auto: Top Gear (Car News, Supercars, Electric)
  {
    name: "Top Gear Car News",
    url: "https://www.topgear.com/car-news",
    category: "auto",
    defaultSubcategory: "cars",
  },
  {
    name: "Top Gear Electric Cars",
    url: "https://www.topgear.com/car-news/electric",
    category: "auto",
    defaultSubcategory: "ev",
  },
  {
    name: "Top Gear Supercars",
    url: "https://www.topgear.com/car-news/supercars",
    category: "auto",
    defaultSubcategory: "cars",
  },

  // 3. Optional Vietnamese domestic sources
  {
    name: "VnExpress Số Hóa",
    url: "https://vnexpress.net/rss/so-hoa.rss",
    category: "tech",
    defaultSubcategory: "smartphones",
  },
  {
    name: "VnExpress Ô tô Xe máy",
    url: "https://vnexpress.net/rss/oto-xe-may.rss",
    category: "auto",
    defaultSubcategory: "cars",
  },
];
