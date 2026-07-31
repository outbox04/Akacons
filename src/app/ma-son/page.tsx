import { PageHero, PublicSite } from '@/components/public-site';
import PaintCatalog from '@/components/paint-catalog-page';
import '@/components/paint-catalog-page.css';

export default function PaintCatalogPage() {
  return <PublicSite>
    <PageHero index="03" eyebrow="Thư viện vật liệu" title="Chọn màu bằng" accent="hình ảnh thật." description="Khám phá trọn bộ 218 mẫu bề mặt thực tế, giúp bạn hình dung chính xác hơn về chất liệu và sắc độ trong không gian." />
    <PaintCatalog />
  </PublicSite>;
}
