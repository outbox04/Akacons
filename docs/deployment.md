# Hướng Dẫn Chi Tiết Triển Khai (Deployment Guide)

Tài liệu này hướng dẫn chi tiết quy trình triển khai hệ thống **Sơn Hiệu Ứng Việt** từ Local -> GitHub -> Supabase -> Vercel.

---

## 1. Thiết Lập Cơ Sở Dữ Liệu Supabase

1. Đăng nhập vào [Supabase Console](https://supabase.com/dashboard).
2. Tạo mới một **Project** (Ví dụ: `sonhieuung-prod`). Chọn Region thích hợp (ví dụ: `Singapore` hoặc `Tokyo` để tối ưu latency về Việt Nam).
3. Sau khi dự án khởi tạo xong, truy cập mục **SQL Editor**.
4. Mở tệp SQL Migration [`supabase/migrations/20260720000000_initial_schema.sql`](file:///d:/WEBSITE/AKACONS/supabase/migrations/20260720000000_initial_schema.sql), sao chép toàn bộ nội dung và dán vào SQL Editor trên Supabase, sau đó bấm **Run**.
5. Mở tệp SQL Seed [`supabase/seed.sql`](file:///d:/WEBSITE/AKACONS/supabase/seed.sql), dán vào SQL Editor và chạy để khởi tạo các Hệ sơn mẫu & Bảng giá ban đầu.
6. Lấy API Keys tại mục **Project Settings -> API**:
   - `URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon / public key` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` -> `SUPABASE_SERVICE_ROLE_KEY` (Chỉ dùng phía Server, tuyệt đối không lộ ra Client).

---

## 2. Thiết Lập Storage Buckets Trộn ẢNh AI trên Supabase

Truy cập mục **Storage** trên Supabase Dashboard và tạo 6 Buckets riêng tư (Private):
- `project-originals` (Ảnh gốc khách hàng upload)
- `project-previews` (Ảnh preview webp)
- `project-masks` (Tệp mask png)
- `project-renders` (Ảnh render AI sau composite)
- `quotation-files` (Tệp PDF báo giá)
- `effect-samples` (Ảnh mẫu hệ sơn)

---

## 3. Lấy API Key Từ OpenAI

1. Đăng nhập vào [OpenAI Platform](https://platform.openai.com/).
2. Truy cập mục **API Keys** và tạo một secret key mới.
3. Sao chép API key (có dạng `sk-proj-...`) -> Đặt tên biến là `OPENAI_API_KEY`.

---

## 4. Đẩy Mã Nguồn Lên GitHub

Mở Terminal tại thư mục dự án và thực thi:
```bash
git init
git add .
git commit -m "Feat: Complete Production Source Code for Sơn Hiệu Ứng Việt"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/sonhieuungviet.git
git push -u origin main
```

---

## 5. Triển Khai Tự Động Lên Vercel

1. Đăng nhập vào [Vercel](https://vercel.com).
2. Nhấp chọn **Add New... -> Project**.
3. Chọn Repository `sonhieuungviet` từ GitHub.
4. Tại mục **Environment Variables**, điền các biến môi trường sau:

| Tên Biến | Giá Trị | Phạm Vi |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL dự án Supabase | Production & Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key anon của Supabase | Production & Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Key service_role của Supabase | Production & Preview |
| `OPENAI_API_KEY` | API key OpenAI | Production & Preview |
| `NEXT_PUBLIC_APP_URL` | URL tên miền Vercel (ví dụ `https://sonhieuungviet.vercel.app`) | Production & Preview |

5. Nhấn **Deploy**. Vercel sẽ tự động build ứng dụng Next.js và cung cấp URL truy cập trực tiếp có chứng chỉ SSL free.
