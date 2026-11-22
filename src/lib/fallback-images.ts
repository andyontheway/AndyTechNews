/**
 * Curated, verified high-resolution fallback image repository with topic labels
 * All URLs are verified and accessible from any origin (no 403 hotlink blocks).
 */

export interface LabeledImage {
  url: string;
  category: "tech" | "auto";
  tags: string[];
  label: string;
}

export const FALLBACK_IMAGE_LIBRARY: LabeledImage[] = [
  // --- XE ĐIỆN (EV) & TRẠM SẠC ---
  {
    url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
    category: "auto",
    tags: ["ev", "charging", "vinfast", "battery", "xe-dien", "tram-sac"],
    label: "Trạm sạc xe điện thông minh",
  },
  {
    url: "https://images.unsplash.com/photo-1558441719-74e64593259e?auto=format&fit=crop&w=1200&q=80",
    category: "auto",
    tags: ["ev", "electric", "tesla", "eco", "xe-dien"],
    label: "Xe điện thế hệ mới",
  },
  {
    url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    category: "auto",
    tags: ["ev", "porsche", "taycan", "macan", "luxury-ev"],
    label: "Porsche Taycan / Macan EV",
  },
  {
    url: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80",
    category: "auto",
    tags: ["ev", "charging-station", "supercharger"],
    label: "Trụ sạc điện cao áp siêu nhanh",
  },

  // --- SIÊU XE & Ô TÔ THỂ THAO (CARS / SUPERCARS) ---
  {
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    category: "auto",
    tags: ["cars", "supercars", "porsche", "speed", "the-thao"],
    label: "Porsche 911 GT3 trên đường đua",
  },
  {
    url: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80",
    category: "auto",
    tags: ["cars", "supercars", "lamborghini", "hypercar"],
    label: "Lamborghini Huracan thể thao",
  },
  {
    url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
    category: "auto",
    tags: ["cars", "supercars", "ferrari", "stradale", "f1"],
    label: "Ferrari Siêu xe thể thao đường phố",
  },
  {
    url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    category: "auto",
    tags: ["cars", "porsche", "luxury", "gt"],
    label: "Porsche thể thao khí động học",
  },
  {
    url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    category: "auto",
    tags: ["cars", "chevrolet", "corvette", "muscle-car"],
    label: "Xe cơ bắp & Siêu xe thể thao",
  },

  // --- CARD ĐỒ HỌA (GPU) ---
  {
    url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["gpu", "graphics", "nvidia", "rtx", "geforce", "radeon", "vram"],
    label: "Card đồ họa Gaming & AI GPU",
  },
  {
    url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["gpu", "hardware", "board", "pcb", "nvidia"],
    label: "Bo mạch xử lý đồ họa cao cấp",
  },

  // --- VI XỬ LÝ (CPU) & BÁN DẪN ---
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["cpu", "processor", "intel", "amd", "ryzen", "core", "chipset"],
    label: "Vi xử lý silicon đa nhân thế hệ mới",
  },
  {
    url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["cpu", "semiconductor", "wafer", "microchip", "arm"],
    label: "Công nghệ bán dẫn và kiến trúc chip",
  },

  // --- Ổ CỨNG SSD, BỘ NHỚ NVME & RAM ---
  {
    url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["ssd", "nvme", "pcie", "storage", "phison", "predator", "memory", "ram"],
    label: "Ổ cứng SSD NVMe PCIe tốc độ cao",
  },

  // --- PHẦN CỨNG PC, CASE & MAINBOARD ---
  {
    url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["pc", "motherboard", "cooling", "watercooled", "psu", "hardware"],
    label: "Dàn máy tính Custom PC hiệu năng cao",
  },
  {
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["pc", "rig", "gaming", "hardware", "gadgets"],
    label: "Hệ thống Gaming Rig & Linh kiện PC",
  },

  // --- TRÍ TUỆ NHÂN TẠO (AI) & TRUNG TÂM DỮ LIỆU ---
  {
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["ai", "neural", "deep-learning", "npu", "llm", "gemini"],
    label: "Mạng nơ-ron Trí tuệ nhân tạo (AI)",
  },
  {
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["ai", "server", "datacenter", "cloud", "supercomputer"],
    label: "Hạ tầng máy chủ AI & Siêu máy tính",
  },
  {
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["ai", "future", "network", "digital", "data"],
    label: "Kỷ nguyên số & Dữ liệu tương lai",
  },

  // --- SMARTPHONES & THIẾT BỊ DI ĐỘNG ---
  {
    url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["smartphones", "mobile", "samsung", "galaxy", "iphone"],
    label: "Smartphone Flagship cao cấp",
  },
  {
    url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["smartphones", "camera", "sensor", "apple", "iphone"],
    label: "Công nghệ ống kính & Cảm biến di động",
  },
  {
    url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=80",
    category: "tech",
    tags: ["smartphones", "gadgets", "display", "screen"],
    label: "Màn hình điện thoại thông minh sắc nét",
  },

  // --- XE MÁY & XE PHÂN KHỐI LỚN (MOTORBIKES) ---
  {
    url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
    category: "auto",
    tags: ["motorbikes", "pkl", "xe-may", "ducati", "honda", "yamaha"],
    label: "Mô tô phân khối lớn thể thao PKL",
  },
  {
    url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
    category: "auto",
    tags: ["motorbikes", "electric-bike", "scooter", "xe-may-dien"],
    label: "Xe máy điện & Phương tiện xanh",
  },
];

/**
 * Checks if an image URL is empty, missing, or blocked by hotlink policies
 * (e.g. techpowerup.com/img returns 403 Forbidden when served from github.io)
 */
export function isBlockedOrMissingImage(url?: string): boolean {
  if (!url || !url.trim()) return true;
  if (url.includes("techpowerup.com/img")) return true;
  return false;
}

/**
 * Returns a deterministic, contextually matching fallback image
 * based on the article's title, category, subcategory, and tags.
 */
export function getThematicFallbackImage(article: {
  title?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
}): string {
  const text = `${article.title || ""} ${article.subcategory || ""} ${(article.tags || []).join(" ")}`.toLowerCase();

  // 1. Detect subcategory / topic keywords
  let matchingPool = FALLBACK_IMAGE_LIBRARY;

  if (
    text.includes("gpu") ||
    text.includes("rtx") ||
    text.includes("geforce") ||
    text.includes("radeon") ||
    text.includes("graphics") ||
    text.includes("vram") ||
    text.includes("card đồ họa")
  ) {
    matchingPool = FALLBACK_IMAGE_LIBRARY.filter((img) => img.tags.includes("gpu"));
  } else if (
    text.includes("ssd") ||
    text.includes("nvme") ||
    text.includes("pcie") ||
    text.includes("phison") ||
    text.includes("predator") ||
    text.includes("storage") ||
    text.includes("ổ cứng")
  ) {
    matchingPool = FALLBACK_IMAGE_LIBRARY.filter((img) => img.tags.includes("ssd"));
  } else if (
    text.includes("cpu") ||
    text.includes("intel") ||
    text.includes("ryzen") ||
    text.includes("core") ||
    text.includes("processor") ||
    text.includes("chip") ||
    text.includes("vi xử lý") ||
    text.includes("lake")
  ) {
    matchingPool = FALLBACK_IMAGE_LIBRARY.filter((img) => img.tags.includes("cpu"));
  } else if (
    text.includes("ai") ||
    text.includes("npu") ||
    text.includes("neural") ||
    text.includes("trí tuệ nhân tạo") ||
    text.includes("llm") ||
    text.includes("gemini")
  ) {
    matchingPool = FALLBACK_IMAGE_LIBRARY.filter((img) => img.tags.includes("ai"));
  } else if (
    article.subcategory === "smartphones" ||
    text.includes("smartphone") ||
    text.includes("iphone") ||
    text.includes("galaxy") ||
    text.includes("điện thoại")
  ) {
    matchingPool = FALLBACK_IMAGE_LIBRARY.filter((img) => img.tags.includes("smartphones"));
  } else if (
    article.subcategory === "ev" ||
    text.includes("ev") ||
    text.includes("electric") ||
    text.includes("xe điện") ||
    text.includes("trạm sạc") ||
    text.includes("pin")
  ) {
    matchingPool = FALLBACK_IMAGE_LIBRARY.filter((img) => img.tags.includes("ev"));
  } else if (
    article.subcategory === "motorbikes" ||
    text.includes("mô tô") ||
    text.includes("xe máy") ||
    text.includes("pkl")
  ) {
    matchingPool = FALLBACK_IMAGE_LIBRARY.filter((img) => img.tags.includes("motorbikes"));
  } else if (
    article.category === "auto" ||
    article.subcategory === "cars" ||
    text.includes("ferrari") ||
    text.includes("porsche") ||
    text.includes("lamborghini") ||
    text.includes("siêu xe") ||
    text.includes("ô tô")
  ) {
    matchingPool = FALLBACK_IMAGE_LIBRARY.filter((img) => img.tags.includes("cars"));
  } else if (article.category === "tech") {
    matchingPool = FALLBACK_IMAGE_LIBRARY.filter((img) => img.category === "tech");
  } else {
    matchingPool = FALLBACK_IMAGE_LIBRARY.filter((img) => img.category === "auto");
  }

  if (matchingPool.length === 0) {
    matchingPool = FALLBACK_IMAGE_LIBRARY;
  }

  // Deterministic selection based on title character sum so the same article always gets the same image
  let hash = 0;
  const str = article.title || "techgear";
  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i) * (i + 1)) % matchingPool.length;
  }

  return matchingPool[hash].url;
}
