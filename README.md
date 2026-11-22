# ⚡ TechGear Daily - Driving the Future of Tech (Dẫn lối tương lai công nghệ)

Website tin tức và đánh giá chuyên sâu về **Công nghệ & Phần cứng** (TechPowerUp, AI, Chipset, GPU, Smartphone) và **Xe Cộ & Xe Điện** (Top Gear UK, Siêu xe, EV, Đánh giá lái thử), được xây dựng trên nền tảng **Next.js 16**, **React 19**, **Tailwind CSS 4** cùng cơ chế **Hybrid Architecture (Auto-Scraper + RSS Feeds + Admin CMS)**.

---

## 🌟 Tính Năng Nổi Bật

### 1. 📰 Giao Diện Báo Chí Hiện Đại & Tối Ưu Trải Nghiệm (20-30% Khoảng Trống)
- **Tiêu điểm chính (Hero Spotlight)**: Cụm tin bài tâm điểm với kích thước lớn, hiệu ứng gradient cinematic và nhãn tiêu điểm tinh tế.
- **Dòng tin nhanh (Quick Wire)**: Thẻ tin tóm tắt nhanh dạng compact giúp độc giả nắm bắt diễn biến công nghệ và xe cộ trong vài giây.
- **Hình ảnh chuẩn tỷ lệ vàng 16:10**: Không bị kéo giãn, không bị cắt xén méo mó, hoàn toàn không bị các tag đè che khuất chi tiết xe và linh kiện phần cứng.
- **Chuyên trang Top Gear Hub (`/topgear`)**: Không gian riêng biệt dành cho cộng đồng đam mê xe hơi, siêu xe tốc độ và xe điện thế hệ mới với phong cách biên tập Top Gear UK.
- **Trang chi tiết bài viết chuyên sâu (`/article/[slug]`)**:
  - Tích hợp hệ thống tag và badge nhận diện nguồn tin (`TOP GEAR UK`, `TECHPOWERUP`, `TECHGEAR EDITORIAL`, `VNEXPRESS`).
  - Huy hiệu xe điện `[⚡ Thuần Điện (EV)]`, nhãn `[🔥 Tin Nóng]`, `[⭐ Tiêu Điểm]`.
  - Khung thông số kỹ thuật (Spec Sheet) dạng thẻ trực quan.
  - Toàn văn bài viết nhiều tầng lớp (thiết kế, vận hành, nội thất, ADAS, tầm hoạt động, bảng ưu/nhược điểm Verdict).
  - Hashtag chủ đề liên quan và khu vực thảo luận/bình luận độc giả.

### 2. 🤖 Hệ Thống Thu Thập & Tự Động Bóc Tách Nội Dung (Full-Text Scraper)
- **Nguồn tin quốc tế & trong nước**:
  - **Top Gear UK**: Tin tức siêu xe, đánh giá lái thử, xe điện thế hệ mới.
  - **TechPowerUp**: Tin tức phần cứng PC, CPU Intel/AMD, GPU Nvidia/AMD, SSD PCIe Gen 5, AI Hardware.
  - **VnExpress**: Ô tô - Xe máy & Số Hóa công nghệ.
- **Cơ chế bóc tách toàn văn thông minh**:
  - Tự động trích xuất dữ liệu gốc `__NEXT_DATA__` từ Top Gear UK.
  - Bóc tách nội dung chuyên sâu từ `<div class="text p">` của TechPowerUp.
  - Tự động lưu cache vào cơ sở dữ liệu khi người đọc mở bài, giúp tải trang tức thì.

### 3. ✍️ Bảng Quản Trị Nội Dung Toàn Diện (Admin CMS Studio - `/admin`)
- **Studio Canh Chỉnh Hình Ảnh (Image Alignment Studio)**:
  - Xem trước (Live Preview) ảnh bìa ở tỷ lệ chuẩn 16:10.
  - Canh chỉnh vị trí cắt ảnh linh hoạt: Căn giữa (Center), Căn trên mui xe/mặt (Top), Căn dưới bánh xe/đường (Bottom), hoặc Vừa khung (Contain).
  - Chế độ Text-First thông minh: Tự động co gọn thẻ tin khi bài viết không có ảnh, xóa bỏ hoàn toàn khoảng trống thừa.
- **Biên tập toàn văn & 1-Click Auto Scraper**:
  - Khung soạn thảo HTML đầy đủ cho nội dung chi tiết bài viết.
  - Nút bấm **"Tự động lấy bài viết đầy đủ từ nguồn"**: 1 click để tự động kéo toàn văn từ Top Gear / TechPowerUp về lưu trữ.
- **Phân trang & Lọc thông minh**:
  - Phân trang 25 bài/trang tối ưu hiệu năng.
  - Lọc nhanh theo chuyên mục (Công nghệ / Xe cộ) và nguồn tin (Top Gear / TechPowerUp / Editorial / VnExpress).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Yêu cầu hệ thống
- **Node.js**: v18+ hoặc v20+
- **npm** hoặc **yarn** / **pnpm**

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Khởi động môi trường phát triển (Dev)
```bash
npm run dev
```
Truy cập trình duyệt tại:
- **Trang chủ:** [http://localhost:3000](http://localhost:3000)
- **Top Gear Hub:** [http://localhost:3000/topgear](http://localhost:3000/topgear)
- **Trang Quản trị CMS:** [http://localhost:3000/admin](http://localhost:3000/admin)

### 4. Đóng gói bản Production
```bash
npm run build
npm run start
```

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Styling**: [Tailwind CSS 4](https://tailwindcss.com/) với `@tailwindcss/postcss`
- **Icon Set**: [Lucide React](https://lucide.dev/)
- **Data Engine**: RSS Parser & Cheerio / Custom DOM Scraper
- **Font chữ**: Geist Sans & Geist Mono (Google Fonts)

---

## 📄 Bản Quyền & Giấy Phép
Dự án được phát triển bởi **andyontheway**.
Bản quyền nội dung thuộc về **TechGear Daily** và các nguồn tin trích dẫn đối tác.
