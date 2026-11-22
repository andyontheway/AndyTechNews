import { NextRequest, NextResponse } from "next/server";
import { getArticleBySlug, deleteArticle, updateArticle } from "@/lib/storage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = getArticleBySlug(id);
  if (!article) {
    return NextResponse.json({ error: "Bài viết không tồn tại" }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = updateArticle(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Không tìm thấy bài viết để cập nhật" }, { status: 404 });
    }
    return NextResponse.json({ success: true, article: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = deleteArticle(id);
  if (!success) {
    return NextResponse.json({ error: "Không tìm thấy bài viết để xóa" }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Đã xóa bài viết thành công" });
}
