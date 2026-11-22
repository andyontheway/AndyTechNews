import { NextRequest, NextResponse } from "next/server";
import { getAllArticles, createArticle, searchArticles, getArticlesByCategory } from "@/lib/storage";
import { MainCategory, SubCategory } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category") as MainCategory | null;
  const subcategory = searchParams.get("subcategory") as SubCategory | null;
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  if (q) {
    const results = searchArticles(q);
    return NextResponse.json(results.slice(0, limit));
  }

  if (category || subcategory) {
    const results = getArticlesByCategory(category || undefined, subcategory || undefined);
    return NextResponse.json(results.slice(0, limit));
  }

  const all = getAllArticles();
  return NextResponse.json(all.slice(0, limit));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.excerpt || !body.category) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ Tiêu đề, Tóm tắt và Chuyên mục." },
        { status: 400 }
      );
    }

    const newArticle = createArticle({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content || `<p>${body.excerpt}</p>`,
      category: body.category,
      subcategory: body.subcategory || (body.category === "auto" ? "cars" : "ai"),
      coverImage: body.coverImage ? body.coverImage.trim() : "",
      source: body.source || "TechGear Editorial",
      author: body.author || "Ban Biên Tập TechGear Daily",
      featured: Boolean(body.featured),
      breaking: Boolean(body.breaking),
      readingTime: body.readingTime ? parseInt(body.readingTime, 10) : 4,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(",").map((s: string) => s.trim()) : []),
      specs: body.specs || undefined,
    });

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
