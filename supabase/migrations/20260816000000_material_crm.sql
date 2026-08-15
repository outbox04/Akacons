-- CRM vật liệu: phân cấp danh mục, nội dung SEO, ảnh màu và Supabase Storage.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.material_catalog_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES public.material_catalog_nodes(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('product_type', 'category', 'subcategory')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.material_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  product_type_id UUID NOT NULL REFERENCES public.material_catalog_nodes(id) ON DELETE RESTRICT,
  category_id UUID NOT NULL REFERENCES public.material_catalog_nodes(id) ON DELETE RESTRICT,
  subcategory_id UUID REFERENCES public.material_catalog_nodes(id) ON DELETE SET NULL,
  short_description TEXT,
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.material_product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.material_products(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, code)
);

CREATE INDEX IF NOT EXISTS material_catalog_parent_idx ON public.material_catalog_nodes(parent_id, position);
CREATE INDEX IF NOT EXISTS material_products_category_idx ON public.material_products(category_id, status);
CREATE INDEX IF NOT EXISTS material_products_subcategory_idx ON public.material_products(subcategory_id);
CREATE INDEX IF NOT EXISTS material_colors_product_idx ON public.material_product_colors(product_id, position);

ALTER TABLE public.material_catalog_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_product_colors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads active material categories" ON public.material_catalog_nodes;
CREATE POLICY "Public reads active material categories" ON public.material_catalog_nodes FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Public reads published materials" ON public.material_products;
CREATE POLICY "Public reads published materials" ON public.material_products FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Public reads material colors" ON public.material_product_colors;
CREATE POLICY "Public reads material colors" ON public.material_product_colors FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.material_products p WHERE p.id = product_id AND p.status = 'published')
);

-- Tài khoản đăng nhập được phép quản trị; ứng dụng tiếp tục giới hạn trang bằng RBAC admin.
DROP POLICY IF EXISTS "Authenticated manages material categories" ON public.material_catalog_nodes;
CREATE POLICY "Authenticated manages material categories" ON public.material_catalog_nodes FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Authenticated manages materials" ON public.material_products;
CREATE POLICY "Authenticated manages materials" ON public.material_products FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Authenticated manages material colors" ON public.material_product_colors;
CREATE POLICY "Authenticated manages material colors" ON public.material_product_colors FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('material-assets', 'material-assets', TRUE, 15728640, ARRAY['image/jpeg','image/png','image/webp','image/avif','image/gif'])
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public reads material assets" ON storage.objects;
CREATE POLICY "Public reads material assets" ON storage.objects FOR SELECT USING (bucket_id = 'material-assets');
DROP POLICY IF EXISTS "Authenticated uploads material assets" ON storage.objects;
CREATE POLICY "Authenticated uploads material assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'material-assets');
DROP POLICY IF EXISTS "Authenticated updates material assets" ON storage.objects;
CREATE POLICY "Authenticated updates material assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'material-assets') WITH CHECK (bucket_id = 'material-assets');
DROP POLICY IF EXISTS "Authenticated deletes material assets" ON storage.objects;
CREATE POLICY "Authenticated deletes material assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'material-assets');

INSERT INTO public.material_catalog_nodes (kind, name, slug, position) VALUES
  ('product_type', 'Lớp phủ hiệu ứng', 'lop-phu-hieu-ung', 10),
  ('product_type', 'Sơn đá', 'son-da', 20)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.material_catalog_nodes (parent_id, kind, name, slug, position)
SELECT parent.id, 'category', child.name, child.slug, child.position
FROM (VALUES
  ('lop-phu-hieu-ung','Vữa Hiệu Ứng Stucco','lop-phu-hieu-ung-vua-hieu-ung-stucco',10),
  ('lop-phu-hieu-ung','Sơn hiệu ứng bê tông','lop-phu-hieu-ung-son-hieu-ung-be-tong',20),
  ('lop-phu-hieu-ung','Sơn hiệu ứng gỉ sét','lop-phu-hieu-ung-son-hieu-ung-gi-set',30),
  ('lop-phu-hieu-ung','Sơn hiệu ứng ngọc trai','lop-phu-hieu-ung-son-hieu-ung-ngoc-trai',40),
  ('lop-phu-hieu-ung','Sơn Tự Hiệu Ứng','lop-phu-hieu-ung-son-tu-hieu-ung',50),
  ('lop-phu-hieu-ung','Sơn Vô Cơ','lop-phu-hieu-ung-son-vo-co',60),
  ('lop-phu-hieu-ung','Sơn vôi','lop-phu-hieu-ung-son-voi',70),
  ('son-da','Sơn đá tự nhiên','son-da-son-da-tu-nhien',10),
  ('son-da','Sơn Đá Hoa Cương','son-da-son-da-hoa-cuong',20),
  ('son-da','Sơn đá bàn bả','son-da-son-da-ban-ba',30)
) AS child(parent_slug,name,slug,position)
JOIN public.material_catalog_nodes parent ON parent.slug = child.parent_slug
ON CONFLICT (slug) DO NOTHING;
