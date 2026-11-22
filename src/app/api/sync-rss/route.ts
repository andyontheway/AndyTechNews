import { NextResponse } from "next/server";
import { syncRssFeeds } from "@/lib/storage";

export async function POST() {
  try {
    const result = await syncRssFeeds();
    return NextResponse.json({
      success: true,
      message: `Đồng bộ thành công! Đã thêm ${result.addedCount} bài viết mới. Tổng số: ${result.totalCount} bài.`,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync RSS feeds" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
