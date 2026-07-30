# GIAI ĐOẠN 1 — PHÂN TÍCH & KIẾN TRÚC
## Nền tảng Sơn Hiệu Ứng · AI Render · Dự toán & Báo giá

---

## 1. PHÂN TÍCH YÊU CẦU

### 1.1 Bài toán cốt lõi
Đây không phải một "AI photo editor" đơn thuần, mà là **một hệ thống vận hành nghiệp vụ (CRM + Estimating + Rendering)** trong đó AI render chỉ là một bước trong quy trình bán hàng — không phải trung tâm hệ thống. Nếu thiết kế sai trọng tâm (coi AI render là core, CRM/pricing là phụ) thì hệ thống sẽ sụp khi cần audit số liệu dự toán hoặc khi nhà cung cấp AI đổi API.

### 1.2 Ba trục rủi ro lớn nhất (quyết định toàn bộ kiến trúc)
| Rủi ro | Hệ quả nếu làm sai | Quyết định kiến trúc bắt buộc |
|---|---|---|
| AI vẽ tràn ra ngoài vùng mask | Ảnh khách hàng bị chỉnh sửa ngoài ý muốn → mất tín nhiệm | **Không tin prompt** — composite lại bằng Sharp ở server, pixel ngoài mask luôn lấy từ ảnh gốc |
| Sai số dự toán vật tư | Báo giá sai → lỗ hoặc mất khách | Pricing Engine là **pure function**, có unit test riêng, tách khỏi UI, snapshot toàn bộ input khi phát hành báo giá |
| Rò dữ liệu giữa khách hàng / tổ chức | Vi phạm hợp đồng, lộ giá nội bộ | RLS ở **database level**, không chỉ kiểm tra ở API — kiểm tra 2 lớp (API + RLS) |

### 1.3 Phạm vi Giai đoạn 1 (đầu ra của lượt này)
Kiến trúc, database, permission matrix, storage, 2 workflow lõi (AI render, pricing), folder structure, API contract, checklist bảo mật/hiệu suất, lộ trình 9 giai đoạn. **Chưa viết code** — code bắt đầu từ Giai đoạn 2 theo đúng thứ tự đã đề ra, mỗi giai đoạn kết thúc bằng lint/typecheck/test/build.

---

## 2. KIẾN TRÚC HỆ THỐNG

```
                         ┌───────────────────────────┐
                         │   Next.js App Router       │
                         │   (Vercel)                  │
                         │                              │
   Browser (mobile-first)│  Server Components (RSC)    │
   ─────────────────────▶│  Client Components (canvas)  │
                         │  Route Handlers (/api/*)     │
                         │  Server Actions               │
                         └───────────┬───────────────┘
                                     │
              ┌──────────────────────┼───────────────────────┐
              ▼                      ▼                        ▼
     ┌────────────────┐   ┌───────────────────┐    ┌─────────────────────┐
     │ Supabase Postgres│  │ Supabase Storage   │    │ AI Provider Adapter │
     │ + RLS            │  │ (private buckets)  │    │ (OpenAI/Google/...) │
     │ + Auth           │  │ signed URLs        │    │ chạy trong lib/ai,   │
     │ + Realtime       │  │                    │    │ KHÔNG lộ ra client   │
     └────────────────┘   └───────────────────┘    └─────────────────────┘
              ▲
              │
     ┌────────────────┐
     │ Queue / Background│  (Vercel Functions / Cron / hoặc Supabase Edge Function)
     │ render_jobs worker │  xử lý render bất đồng bộ, retry, dead-letter
     └────────────────┘
```

**Nguyên tắc kiến trúc then chốt:**
- Frontend **không bao giờ** gọi trực tiếp AI provider hoặc dùng Service Role Key.
- Mọi ghi dữ liệu quan trọng đi qua **Route Handler / Server Action → kiểm tra quyền → validate (Zod) → RPC/transaction → audit log**.
- Render AI là **quy trình bất đồng bộ**: client tạo job → nhận `job_id` → theo dõi qua Realtime/polling → không giữ HTTP request chờ AI.
- Composite ảnh (giữ vùng ngoài mask) là **hậu xử lý bắt buộc ở server**, không phải một bước "nice to have".

---

## 3. SƠ ĐỒ LUỒNG DỮ LIỆU CHÍNH

```
[Sale/Customer] 
   → tạo Customer → tạo Project → upload Image (Storage: project-originals)
   → mở Canvas Editor → vẽ mask → lưu annotation_json + mask_image_path (Storage: project-masks)
   → chọn effect_system + color → tạo Render Job (status=queued)
        → Worker: preprocessing → chuẩn hoá ảnh & mask
        → gọi AI Provider Adapter (qua lib/ai, có idempotency key + credit check)
        → nhận ảnh AI thô
        → Sharp: resize khớp ảnh gốc → composite theo mask (feather nhẹ)
              final_pixel = mask ? ai_pixel : original_pixel
        → Quality Check tự động (kích thước, mask rỗng?, tràn màu ngoài mask?)
        → nếu fail → needs_review (không tự gửi khách)
        → nếu pass → completed → lưu Storage (project-renders) → Realtime notify
   → Sale/Customer xem Before/After → chọn version → duyệt
   → nhập diện tích + hệ sơn → Pricing Engine tính Estimate
        (effect_system → layers → products → coverage → wastage → packages → price_book_items)
   → tạo Quote từ Estimate → SNAPSHOT toàn bộ giá/sản phẩm/khách hàng vào quote_versions
   → gửi Quote qua link token (public/quotes/[token]) → theo dõi quote_view_logs
   → khách accepted/rejected → cập nhật Project status → audit log toàn bộ bước trên
```

---

## 4. DANH SÁCH MODULE (features/)

| Module | Trách nhiệm |
|---|---|
| `auth` | Đăng nhập, session, role, MFA cho admin |
| `customers` | CRUD khách hàng, mã tự sinh `KH-YYYY-000001` |
| `projects` | CRUD công trình, trạng thái, lịch sử trạng thái, phân công |
| `uploads` | Upload ảnh, resumable, tạo preview/thumbnail, xoá metadata GPS |
| `annotations` | Canvas mask editor, lưu/mở lại `annotation_json` |
| `renders` | Render job lifecycle, provider adapter, composite, quality check, versioning |
| `products` | Effect systems, layers, products, packages, colors, samples |
| `pricing` | Price book, import Excel có validate, versioning giá |
| `estimates` | Pricing Engine: định mức → khối lượng → đóng gói → thành tiền |
| `quotations` | Quote lifecycle, snapshot, PDF, public link có token |
| `notifications` | In-app + email, chuẩn bị hook mở rộng Zalo/Telegram sau |
| `admin` | Người dùng, vai trò, audit log, AI provider config, kill switch |

---

## 5. PERMISSION MATRIX (RBAC × RLS)

| Hành động | customer | sale | technician | manager | admin | super_admin |
|---|---|---|---|---|---|---|
| Xem project của chính mình | ✅ | ✅ (phụ trách) | ✅ (được giao) | ✅ (đội nhóm) | ✅ (org) | ✅ |
| Xem project người khác | ❌ | ❌ | ❌ | ✅ (đội nhóm) | ✅ (org) | ✅ |
| Tạo customer/project | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Upload ảnh | ✅ (project của mình) | ✅ | ✅ (ghi chú kỹ thuật) | ✅ | ✅ | ✅ |
| Vẽ mask / tạo render job | ❌ | ✅ | ❌ (chỉ đánh dấu cần review) | ✅ | ✅ | ✅ |
| Duyệt kết quả AI (needs_review) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Xem giá nội bộ (purchase_price) | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Tạo/sửa price book | ❌ | ❌ | ❌ | ❌ (chỉ duyệt) | ✅ | ✅ |
| Tạo estimate/quote | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Duyệt quote trước khi gửi | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Accept/reject quote (public) | ✅ (qua token) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Quản lý user/role | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Xem audit log | ❌ | ❌ | ❌ | ❌ (giới hạn đội) | ✅ | ✅ |
| Cấu hình AI provider / kill switch | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

**Nguyên tắc thực thi:** matrix này ánh xạ trực tiếp sang (1) middleware kiểm tra role ở Route Handler và (2) RLS policy SQL — hai lớp độc lập, không lớp nào được tin tưởng tuyệt đối vào lớp kia.

---

## 6. DATABASE SCHEMA — NHÓM BẢNG & QUAN HỆ

> SQL migration đầy đủ (constraints, indexes, triggers, RLS) sẽ được viết ở **Giai đoạn 2**. Ở đây là thiết kế quan hệ mức logic để chốt trước khi sinh migration.

### 6.1 Nhóm Tổ chức & Người dùng
```
organizations 1───* profiles
profiles *───* roles (qua user_roles)
roles 1───* permissions (qua role_permissions, nếu cần chi tiết hơn role tĩnh)
```

### 6.2 Nhóm CRM
```
organizations 1───* customers
customers 1───* customer_contacts
customers 1───* leads
customers 1───* projects
projects 1───* project_members (user_id, role_in_project)
projects 1───* project_status_history
projects 1───* project_areas (khu vực: phòng khách, mặt tiền...)
```

### 6.3 Nhóm Ảnh & Annotation
```
projects 1───* project_images
project_images 1───* image_annotations (annotation_json, version)
image_annotations 1───1 image_masks (mask_image_path, canvas size, gốc size)
```

### 6.4 Nhóm Thư viện sơn
```
effect_systems 1───* effect_layers
effect_layers *───* products (qua effect_layer_products: coverage_min/max, wastage_percent)
products 1───* product_packages
effect_systems 1───* colors
effect_systems 1───* effect_samples
```

### 6.5 Nhóm Giá
```
price_books 1───* price_book_items (product_id, package_id, purchase_price, sale_price, vat_rate)
price_imports 1───* price_import_rows (raw_data, mapped_data, errors[])
```
Ràng buộc: `price_book_items` không update-in-place khi đổi giá — tạo `price_books` version mới, `effective_from/to` không chồng lấp (check constraint / exclusion constraint theo product_id+package_id).

### 6.6 Nhóm Render AI
```
project_images 1───* render_jobs
render_jobs 1───* render_job_inputs (mask, effect_system, color, prompt config — snapshot tại thời điểm tạo job)
render_jobs 1───* render_outputs (mỗi version một dòng: url, model, cost, processing_time)
render_outputs 1───* render_reviews (approved_by, status, note)
```

### 6.7 Nhóm Dự toán & Báo giá
```
projects 1───* estimates
estimates 1───* estimate_items (layer, product, coverage, quantity, package, unit_price, subtotal)
estimates 1───* quotes
quotes 1───* quote_versions   ← SNAPSHOT toàn bộ dữ liệu tại thời điểm phát hành
quote_versions 1───* quote_items (bản sao bất biến, không join lại price_book_items)
quotes 1───* quote_view_logs (token, viewed_at, ip_hash)
```

### 6.8 Nhóm hệ thống
```
notifications (recipient_id, type, payload, read_at)
activity_logs (hoạt động thông thường, không nhạy cảm)
audit_logs (actor_id, action, entity_type, entity_id, before_data, after_data, ip_hash, user_agent)
system_settings (key, value, updated_by)
ai_provider_configs (provider, model, is_active, daily_limit, org_limit, kill_switch)
usage_credits / usage_transactions (theo organization, theo user)
```

**Quy ước chung mọi bảng nghiệp vụ:** `id UUID PK`, `organization_id`, `created_by/updated_by`, `created_at/updated_at`, `deleted_at NULL` (soft delete). Trigger `updated_at` và trigger sinh mã (`KH-`, `CT-`, `BG-`) sẽ đặt trong `supabase/migrations` ở Giai đoạn 2.

---

## 7. STORAGE STRUCTURE

```
Buckets (đều PRIVATE, truy cập qua signed URL ngắn hạn):
├── project-originals     # ảnh gốc, không bao giờ ghi đè
├── project-previews      # bản preview webp dùng cho canvas & AI input
├── project-thumbnails    # danh sách, tải nhẹ
├── project-masks         # mask.png từng annotation
├── project-renders       # ảnh render theo version
├── effect-samples        # ảnh mẫu hệ sơn (có thể public-read nếu là tài liệu marketing)
├── quotation-files       # PDF báo giá
└── temporary-uploads     # dọn dẹp theo TTL, dùng khi upload nhiều bước

Path pattern:
{organization_id}/{project_id}/{image_id}/original.{ext}
{organization_id}/{project_id}/{image_id}/preview.webp
{organization_id}/{project_id}/{image_id}/thumbnail.webp
{organization_id}/{project_id}/{image_id}/mask.png
{organization_id}/{project_id}/{image_id}/render-v{n}.webp
```
Storage policy phải **đồng bộ 1:1** với RLS của `project_images`/`render_outputs` — không có policy `using (true)`.

---

## 8. AI RENDER WORKFLOW (chi tiết kỹ thuật)

```
1. Client → POST /api/render/jobs { image_id, mask_id, effect_system_id, color_id, params }
2. Server:
   - AuthN/AuthZ + can_access_project(project_id)
   - Kiểm tra usage_credits (org + user + daily_limit)
   - Idempotency-Key header → tránh tạo trùng job khi double-submit
   - Ghi render_jobs (status=queued) + render_job_inputs (snapshot input)
3. Worker (Vercel Function / Edge Function, kích hoạt bởi queue hoặc cron polling):
   - preprocessing: resize ảnh + mask về cùng hệ toạ độ, build prompt từ effect_system+color
   - sending_to_provider → gọi ImageRenderProvider.createRender()
   - processing → poll getStatus() nếu provider async
   - postprocessing (Sharp):
        a. resize ảnh AI về đúng kích thước ảnh gốc
        b. feather nhẹ cạnh mask (tránh viền cứng)
        c. composite: final = mask ? ai_pixel : original_pixel
        d. kiểm tra tràn màu ngoài mask (diff pixel > threshold ở vùng ngoài mask → fail)
   - quality_check tự động → completed | needs_review
4. Lưu render_outputs (version mới, không ghi đè version cũ) → Storage (project-renders)
5. Realtime/notification → client cập nhật UI, hiển thị Before/After
```
**Bất biến (invariant) phải test được bằng unit test:** với mọi pixel `p` nằm ngoài mask, `output[p] == original[p]` (so sánh byte-for-byte sau resize, cho phép sai số nén webp ở mức rất nhỏ).

---

## 9. PRICING / ESTIMATE WORKFLOW

```
Input: project_area, effect_system_id, area_m2, surface_condition, price_book_id, vat, discount, labor_fee, shipping_fee

for each layer in effect_layers(effect_system_id, order by layer_order):
    for each product in layer_products(layer.id):
        coverage = product.coverage_config(theo layer + area type nội/ngoại thất)
        theoretical_qty = area_m2 * coverage
        actual_qty = theoretical_qty * (1 + wastage_percent)
        packages = optimize_packages(actual_qty, product.packages, price_book_id)
            # ưu tiên: đủ khối lượng > tổng chi phí thấp nhất > lượng dư thấp
            #          > ít thùng hơn > quy cách lớn hơn (khi ngang điểm)
        line_total = packages.total_cost
        push estimate_item { layer, product, qty, packages, unit_price, line_total }

subtotal = sum(estimate_items.line_total)
vat_amount = subtotal * vat_rate
total = subtotal - discount + labor_fee + shipping_fee + vat_amount
```

**Package optimization** implement dạng **pure function** (`lib/pricing-engine/optimizePackages.ts`), input/output đều là dữ liệu thuần (không side-effect), để test toàn bộ tổ hợp biên (thiếu 1 quy cách, nhiều quy cách gần bằng nhau, giá âm/0 phải reject...).

**Bất biến bắt buộc:**
- Không lấy `price_book_items` có `effective_to < now()` hoặc `status != active`.
- Không trộn sản phẩm `application_area=exterior` vào hệ sơn `interior` (check ở tầng service, không chỉ ở UI).
- `quote_versions`/`quote_items` không bao giờ join lại `price_book_items` hiện tại — chỉ đọc từ snapshot đã lưu.

---

## 10. FOLDER STRUCTURE (chốt cho Giai đoạn 2 trở đi)

```
src/
├── app/(public)|(auth)|customer|sale|technician|manager|admin|api/
├── components/ui|layout|forms|project|customer|renderer|canvas|estimate|quotation|dashboard/
├── features/auth|customers|projects|uploads|annotations|renders|products|pricing|estimates|quotations/
├── lib/supabase|ai|image-processing|pricing-engine|permissions|validation|security|rate-limit|logger|utils/
├── hooks/ ├── stores/ ├── types/ ├── constants/ ├── emails/ └── styles/
supabase/migrations|seed|functions|policies/
docs/ (architecture, database, permissions, ai-render-workflow, quotation-engine, security, deployment, testing).md
```
Quy tắc: **page component chỉ gọi feature/service**, không viết logic nghiệp vụ trực tiếp trong `app/**/page.tsx`.

---

## 11. API ARCHITECTURE (contract chung)

Response format thống nhất:
```json
{ "success": true, "data": {}, "message": "Thành công", "requestId": "uuid" }
```
Mọi route: `withAuth → withRole([...]) → withValidation(zodSchema) → withRateLimit → handler → withAuditLog`.
Danh sách route theo mục XXV giữ nguyên; mỗi route sẽ có file test integration riêng ở Giai đoạn 9 (nhưng viết test song song ngay khi tạo route, không dồn cuối).

---

## 12. SECURITY CHECKLIST (áp dụng từ Giai đoạn 2)

- [ ] RLS bật cho **mọi** bảng chứa dữ liệu người dùng, không có `using (true)` trên bảng nhạy cảm.
- [ ] Service Role Key chỉ dùng trong Route Handler/Server Action chạy server, không bao giờ vào bundle client.
- [ ] Buckets private + signed URL TTL ngắn (ví dụ 5–15 phút).
- [ ] Upload: kiểm tra MIME + file signature (magic bytes), giới hạn dung lượng, UUID hoá tên file, xoá EXIF/GPS.
- [ ] Rate limit theo user + theo IP cho `/api/render/jobs`, `/api/uploads/*`, `/api/auth/*`.
- [ ] Idempotency key cho tạo render job, tạo quote.
- [ ] AI: credit check trước khi gọi provider, `daily_limit`/`org_limit`/`user_limit`, kill switch toàn hệ thống.
- [ ] Public quote link: token ngẫu nhiên đủ entropy, có thể revoke, không đoán được qua ID tuần tự.
- [ ] Không trả stack trace / lỗi DB thô ra client — map qua các Error class (mục XXVI) → message tiếng Việt.
- [ ] Audit log không thể sửa/xoá bởi role thường; ghi `before_data/after_data` cho hành động thay đổi giá, quote, quyền.
- [ ] MFA cho admin/super_admin; khoá tạm sau N lần đăng nhập sai; captcha ở form nhạy cảm.

## 13. PERFORMANCE CHECKLIST

- [ ] Danh sách ảnh/công trình dùng thumbnail + cursor pagination, không load ảnh gốc.
- [ ] Canvas editor lazy-load (`dynamic import`), chỉ mount khi vào bước đánh dấu.
- [ ] Render AI luôn bất đồng bộ — request tạo job trả về ngay `job_id`, cập nhật qua Realtime/polling.
- [ ] Upload resumable, retry exponential backoff, preview local trước khi upload xong.
- [ ] Select đúng field cần (`.select('id,name,...')`), tránh N+1 (dùng RPC cho estimate calculation).
- [ ] Cache danh mục (effect_systems, colors, products) ở tầng React Query với staleTime hợp lý; không cache dữ liệu cá nhân.
- [ ] `prefers-reduced-motion` được tôn trọng; animation chỉ dùng transform/opacity.

---

## 14. LỘ TRÌNH 9 GIAI ĐOẠN (nhắc lại để theo dõi tiến độ)

1. ✅ Phân tích & kiến trúc *(tài liệu này)*
2. Nền tảng: Next.js + Supabase + Auth + Role + RLS + design system
3. CRM: Customer/Project CRUD + phân công + status history
4. Upload & Canvas: ảnh, preview, thumbnail, mask editor, annotation
5. AI Render: provider adapter, queue, composite, quality check, before/after
6. Dữ liệu sơn & bảng giá: effect systems, products, import price book
7. Dự toán & Báo giá: pricing engine, package optimization, quote, PDF, public link
8. Bảo mật & hiệu suất: rate limit, security headers, storage policy, tối ưu mobile
9. Test & Deploy: unit/integration/E2E/security test, staging, production checklist

Mỗi giai đoạn kết thúc bằng: liệt kê file/migration đã tạo → `lint` → `typecheck` → `test` → `build` → sửa hết lỗi rồi mới sang giai đoạn kế tiếp — đúng như mục XXXII/XXXIII đã quy định.

---

## 15. ĐIỂM CẦN QUYẾT ĐỊNH TRƯỚC KHI VÀO GIAI ĐOẠN 2

Vì đây là hệ thống thật (không phải demo), tôi cần bạn xác nhận/chốt các điểm sau — nếu không, tôi sẽ dùng giá trị mặc định ghi trong ngoặc:
1. Package manager: npm hay pnpm? (mặc định **pnpm**)
2. AI provider khởi điểm để build adapter đầu tiên: OpenAI Image hay Google? (mặc định **OpenAI**, các adapter khác chỉ cần implement interface sau)
3. Multi-tenant thật (nhiều `organization`) hay hiện tại chỉ 1 tổ chức duy nhất? (ảnh hưởng độ phức tạp RLS) (mặc định: **thiết kế multi-tenant nhưng seed 1 org duy nhất**)
4. Email provider cho notification (Resend / SendGrid / khác)? (mặc định **Resend**)

Nếu bạn không có ý kiến khác, tôi sẽ dùng mặc định trên và bắt đầu **Giai đoạn 2 (Nền tảng)** ở lượt tiếp theo: khởi tạo Next.js, migration Auth/Role/RLS cơ bản, design system, layout theo 5 khu vực.