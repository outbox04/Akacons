import Link from 'next/link';
import { ArrowRight, Calculator, ImagePlus } from 'lucide-react';
import { PageHero, PublicSite } from '@/components/public-site';

export default function ToolsPage() {
  return <PublicSite>
    <PageHero index="04" eyebrow="Công cụ AKACONS" title="Từ hình dung đến" accent="phương án thực tế." description="Bộ công cụ dành cho đội ngũ tư vấn và thi công, giúp rút ngắn quá trình chọn màu, dựng hình và lập dự toán." />
    <section className="page-section alt"><div className="tool-grid">
      <Link className="tool-card-public" href="/ai" data-reveal><span><ImagePlus/></span><small>01 · AI VISUALIZER</small><h2>Thử sơn bằng hình ảnh AI</h2><p>Tải ảnh không gian, khoanh vùng bề mặt và thử trực tiếp mã sơn AKACONS.</p><b>Mở công cụ <ArrowRight size={17}/></b></Link>
      <Link className="tool-card-public" href="/bao-gia" data-reveal><span><Calculator/></span><small>02 · ESTIMATE & QUOTE</small><h2>Dự toán và báo giá</h2><p>Tính vật tư, nhân công, VAT và lưu lịch sử báo giá theo từng nhân viên.</p><b>Mở công cụ <ArrowRight size={17}/></b></Link>
    </div></section>
  </PublicSite>;
}
