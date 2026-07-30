-- =========================================================================
-- SEED DATA: 20260720000000_seed.sql
-- DỮ LIỆU MẪU BAN ĐẦU DÀNH CHO SƠN HIỆU ỨNG VIỆT
-- =========================================================================

-- 1. Default Organization
INSERT INTO public.organizations (id, name, code)
VALUES ('00000000-0000-0000-0000-000000000001', 'Sơn Hiệu Ứng Việt Org', 'SHV-MAIN')
ON CONFLICT (code) DO NOTHING;

-- 2. Effect Systems (4 Dòng sơn thực tế từ thư mục Mã Sơn)
INSERT INTO public.effect_systems (id, name, area, swatch_hex, description) VALUES
('e0000000-0000-0000-0000-000000000001', 'Sơn hiệu ứng Bê tông (Series XT)', 'interior', '#B7B0A2', 'Hiệu ứng bê tông mờ phong cách Loft đô thị (89 mã màu)'),
('e0000000-0000-0000-0000-000000000002', 'Sơn Vôi Lime Wash (Series XV)', 'interior', '#E8E2D5', 'Hiệu ứng vôi khoáng tự nhiên nhã nhặn (96 mã màu)'),
('e0000000-0000-0000-0000-000000000003', 'Sơn hiệu ứng Gỉ Sét (Series Xm)', 'exterior', '#8C4A27', 'Bề mặt oxy hóa phong cách công nghiệp Industrial (16 mã màu)'),
('e0000000-0000-0000-0000-000000000004', 'Sơn hiệu ứng Ngọc Trai (Series MP)', 'interior', '#D8CFBC', 'Bề mặt ánh lụa ngọc trai sang trọng (17 mã màu)');

-- 3. Colors (Mã màu đại diện cho từng dòng sơn)
INSERT INTO public.colors (effect_system_id, name, hex) VALUES
-- Series XT (Bê tông)
('e0000000-0000-0000-0000-000000000001', 'XT-01 (Ghi xám mờ)', '#9E9A93'),
('e0000000-0000-0000-0000-000000000001', 'XT-02 (Ghi xi măng)', '#B2ADA4'),
('e0000000-0000-0000-0000-000000000001', 'XT-101 (Be cát nhạt)', '#D6CBBA'),
('e0000000-0000-0000-0000-000000000001', 'XT-201 (Cam đất ấm)', '#C87B52'),
('e0000000-0000-0000-0000-000000000001', 'XT-501 (Xanh rêu phong)', '#5B6B4F'),

-- Series XV (Sơn Vôi)
('e0000000-0000-0000-0000-000000000002', 'XV-01 (Vôi trắng kem)', '#EBE5D8'),
('e0000000-0000-0000-0000-000000000002', 'XV-02 (Vôi be sáng)', '#DFD7C7'),
('e0000000-0000-0000-0000-000000000002', 'XV-100 (Vôi cam nung)', '#C67E58'),
('e0000000-0000-0000-0000-000000000002', 'XV-120 (Vôi nâu rustic)', '#84624D'),

-- Series Xm (Gỉ Sét)
('e0000000-0000-0000-0000-000000000003', 'Xm-01 (Gỉ đồng đỏ)', '#A64B2A'),
('e0000000-0000-0000-0000-000000000003', 'Xm-02 (Gỉ sắt nhám)', '#8F3D1F'),
('e0000000-0000-0000-0000-000000000003', 'Xm-03 (Gỉ oxy hóa nhẹ)', '#B85832'),

-- Series MP (Ngọc Trai)
('e0000000-0000-0000-0000-000000000004', 'MP-01 (Ngọc trai champagne)', '#E2D7C4'),
('e0000000-0000-0000-0000-000000000004', 'MP-02 (Ngọc trai ánh bạc)', '#D1CDC4'),
('e0000000-0000-0000-0000-000000000004', 'MP-03 (Ngọc trai vàng hồng)', '#D8C3B4');

-- 4. Products
INSERT INTO public.products (id, name, unit, coverage_per_unit) VALUES
('p0000000-0000-0000-0000-000000000001', 'Sơn Lót Kháng Kiềm', 'lít', 0.12),
('p0000000-0000-0000-0000-000000000002', 'Sơn Hiệu Ứng Bê Tông', 'kg', 0.28),
('p0000000-0000-0000-0000-000000000003', 'Sơn Phủ Bóng Bảo Vệ', 'lít', 0.10);

-- 5. Default Price Book 2026
INSERT INTO public.price_books (id, organization_id, name, is_active) VALUES
('pb000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Bảng Giá Niêm Yết 2026', true);

INSERT INTO public.price_book_items (price_book_id, product_id, unit_price, vat_rate) VALUES
('pb000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 180000.00, 10.0),
('pb000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002', 420000.00, 10.0),
('pb000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003', 150000.00, 10.0);

-- 6. AI Provider Config Initial State
INSERT INTO public.ai_provider_configs (organization_id, provider_name, kill_switch, daily_limit, used_today) VALUES
('00000000-0000-0000-0000-000000000001', 'OpenAI Image', false, 200, 0);
