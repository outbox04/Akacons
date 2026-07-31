import Image from 'next/image';
import { PageHero, PublicSite } from '@/components/public-site';

export default function AboutPage() {
  return <PublicSite>
    <PageHero index="01" eyebrow="Câu chuyện AKACONS" title="Bề mặt có" accent="cảm xúc riêng." description="Chúng tôi kết hợp sự am hiểu vật liệu, kỹ thuật thủ công và tư duy thiết kế để tạo ra những bề mặt sống cùng kiến trúc." />
    <section className="page-section story-grid">
      <div className="story-image" data-reveal><Image src="/paints/xt-301.jpg" alt="Bề mặt sơn AKACONS" fill sizes="60vw" /></div>
      <div className="story-copy" data-reveal><h2>Không chỉ là một lớp màu.</h2><p>Mỗi công trình bắt đầu bằng việc lắng nghe không gian: ánh sáng, vật liệu, nhịp sống và cảm xúc mà chủ nhân muốn lưu giữ. Từ đó, đội ngũ AKACONS thử mẫu, điều chỉnh sắc độ và hoàn thiện từng lớp bằng tay.</p><p>Kết quả là một bề mặt không lặp lại máy móc, có chiều sâu và mang dấu ấn riêng của công trình.</p></div>
    </section>
    <section className="page-section"><div className="section-title" data-reveal><h2>Giá trị chúng tôi theo đuổi</h2><p>Một quy trình rõ ràng, vật liệu trung thực và chất lượng hoàn thiện có thể kiểm chứng.</p></div><div className="value-grid">{[['01','Thấu hiểu','Bắt đầu từ nhu cầu thực tế của không gian.'],['02','Thủ công','Từng lớp bề mặt được xử lý bởi người thợ.'],['03','Chính xác','Thử mẫu và duyệt sắc độ trước thi công.'],['04','Bền vững','Ưu tiên giải pháp phù hợp và sử dụng lâu dài.']].map(([n,t,d])=><article className="value-card" data-reveal key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
  </PublicSite>;
}
