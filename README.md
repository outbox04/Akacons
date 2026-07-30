# Sơn Hiệu Ứng Việt · Hệ Thống Vận Hành CRM + AI Render + Dự Toán & Báo Giá

Nền tảng vận hành doanh nghiệp ngành sơn trang trí & hiệu ứng được xây dựng trên công nghệ **Next.js (App Router)**, **Supabase (PostgreSQL, Auth, RLS)**, **OpenAI API (Inpainting & Composite)** và triển khai tự động lên **Vercel** thông qua **GitHub**.

---

## 🏗 Cấu Trúc Mã Nguồn (Directory Structure)

```
AKACONS/
├── docs/                             # Tài liệu kiến trúc & Deployment
│   └── deployment.md                 # Hướng dẫn chi tiết từng bước deploy Vercel + Supabase
├── supabase/                         # Phân hệ Cơ sở dữ liệu Supabase
│   ├── migrations/
│   │   └── 20260720000000_initial_schema.sql  # SQL Migration khởi tạo Schema, Triggers, RLS Policies
│   └── seed.sql                      # Dữ liệu mẫu ban đầu (Hệ sơn, Bảng giá)
└── src/
    ├── app/                          # App Router Pages & API Route Handlers
    │   ├── layout.tsx                # App Shell Root Layout
    │   ├── page.tsx                  # Bảng điều khiển Tổng quan (Dashboard)
    │   ├── globals.css               # Design System & Styling Tokens
    │   ├── (auth)/login/             # Đăng nhập Supabase Auth
    │   ├── customers/                # CRM Khách hàng
    │   ├── projects/                 # CRM Công trình
    │   ├── studio/                   # Studio Render AI (Canvas Mask Editor)
    │   ├── pricing/                  # Bộ máy Dự toán & Bảng giá
    │   ├── quotes/                   # Báo giá Snapshot & Cổng Khách hàng
    │   ├── admin/                    # Quản trị (Kill Switch, AI Config, Audit Logs)
    │   └── api/                      # REST API Endpoints (render/jobs, estimates, quotes, admin)
    ├── components/                   # React UI Components tái sử dụng
    │   ├── ui/                       # Buttons, Cards, Badges, Modals, Toasts
    │   ├── layout/                   # Sidebar Navigation, Topbar
    │   ├── canvas/                   # CanvasMaskEditor, BeforeAfterSlider
    │   ├── estimate/                 # PricingForm, BreakdownTable
    │   └── quotation/                # QuoteDocument, PrintView
    ├── lib/                          # Core Business Logic Libraries
    │   ├── supabase/                 # Supabase SSR Helpers (client, server, middleware)
    │   ├── ai/                       # OpenAI Provider Adapter (DALL-E 3 & Inpainting)
    │   ├── image-processing/         # Post-processing Sharp Composite (Bảo toàn pixel ngoài mask)
    │   ├── pricing-engine/           # Pure function tính toán dự toán vật tư & đóng gói
    │   ├── permissions/              # Phân quyền 2 lớp RBAC & RLS
    │   └── validation/               # Zod Schemas validate dữ liệu
    └── types/                        # TypeScript Interfaces & Supabase Types
        ├── database.types.ts
        └── index.ts
```

---

## ⚡ Hướng Dẫn Chạy Môi Trường Local Development

### 1. Cài Đặt Dependencies
```bash
npm install
# hoặc nếu dùng pnpm:
pnpm install
```

### 2. Cấu Hình Biến Môi Trường (`.env.local`)
Tạo tệp `.env.local` dựa trên tệp mẫu `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OPENAI_API_KEY=sk-proj-your-openai-api-key
```

### 3. Khởi Chạy Dev Server
```bash
npm run dev
```
Truy cập đường dẫn: `http://localhost:3000`

---

## 🚀 Hướng Dẫn Đẩy Code Lên GitHub & Deploy Vercel

Xem hướng dẫn chi tiết tại tài liệu [`docs/deployment.md`](file:///d:/WEBSITE/AKACONS/docs/deployment.md).

### Tóm tắt 4 bước Deployment:
1. **Khởi tạo Database Supabase**: Đăng nhập [Supabase Dashboard](https://supabase.com), tạo dự án mới và chạy toàn bộ câu lệnh trong tệp [`supabase/migrations/20260720000000_initial_schema.sql`](file:///d:/WEBSITE/AKACONS/supabase/migrations/20260720000000_initial_schema.sql) tại mục SQL Editor.
2. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit AKACONS Sơn Hiệu Ứng Việt production app"
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
3. **Kết nối Vercel**: Đăng nhập [Vercel Dashboard](https://vercel.com), chọn **Import Project** từ GitHub repository vừa đẩy lên.
4. **Cấu hình Environment Variables trên Vercel**: Điền đầy đủ các biến `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` và `OPENAI_API_KEY` trong phần Settings của dự án trên Vercel. Bấm **Deploy**!
