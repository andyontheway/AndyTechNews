export type MainCategory = "tech" | "auto";

export type SubCategory =
  // Tech subcategories
  | "ai"
  | "smartphones"
  | "pc"
  | "reviews"
  | "gadgets"
  // Auto subcategories
  | "ev"
  | "cars"
  | "motorbikes"
  | "auto-reviews"
  | "market";

export interface ArticleSpecs {
  [key: string]: string;
}

export type ImagePosition = "center" | "top" | "bottom" | "contain";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: MainCategory;
  subcategory: SubCategory;
  coverImage: string;
  imagePosition?: ImagePosition;
  source: string;
  sourceUrl?: string;
  author: string;
  publishedAt: string; // ISO string
  featured?: boolean;
  breaking?: boolean;
  views: number;
  readingTime: number; // in minutes
  tags: string[];
  specs?: Record<string, string>;
}

export interface RssFeedConfig {
  name: string;
  url: string;
  category: MainCategory;
  defaultSubcategory: SubCategory;
}

export interface CategoryInfo {
  id: MainCategory;
  name: string;
  slug: string;
  description: string;
  subcategories: {
    id: SubCategory;
    name: string;
    slug: string;
  }[];
}
