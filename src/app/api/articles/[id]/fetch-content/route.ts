import { NextRequest, NextResponse } from "next/server";
import { getArticleBySlug, updateArticle } from "@/lib/storage";
import { fetchFullArticleContent } from "@/lib/scraper";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = getArticleBySlug(id);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy bài viết" },
        { status: 404 }
      );
    }

    if (!article.sourceUrl) {
      return NextResponse.json(
        { success: false, error: "Bài viết này không có đường dẫn nguồn gốc (sourceUrl)" },
        { status: 400 }
      );
    }

    const fullContent = await fetchFullArticleContent(article);

    if (!fullContent || fullContent.length < 150) {
      return NextResponse.json(
        {
          success: false,
          error: "Không thể trích xuất nội dung từ trang nguồn (Trang có thể chặn bot hoặc đổi cấu trúc)",
        },
        { status: 422 }
      );
    }

    // Save into storage
    const updated = updateArticle(article.id, { content: fullContent });

    return NextResponse.json({
      success: true,
      content: fullContent,
      article: updated,
      message: `Đã tải thành công ${fullContent.length} ký tự nội dung chi tiết!`,
    });
  } catch (error: any) {
    console.error("Error in fetch-content API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ khi tải nội dung" },
      { status: 500 }
    );
  }
}
