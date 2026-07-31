import { ArrowRight } from 'lucide-react';
import { PageHero, PublicSite } from '@/components/public-site';

export default function ContactPage() {
  return <PublicSite>
    <PageHero index="05" eyebrow="Liên hệ" title="Bắt đầu một" accent="bề mặt khác biệt." description="Gửi thông tin về không gian của bạn. Đội ngũ AKACONS sẽ liên hệ để tư vấn hệ sơn, sắc độ và phương án phù hợp." />
    <section className="contact-layout">
      <div className="contact-info" data-reveal><article><small>ĐIỆN THOẠI</small><a href="tel:0900000000">0900 000 000</a></article><article><small>EMAIL</small><a href="mailto:hello@akacons.vn">hello@akacons.vn</a></article><article><small>KHU VỰC PHỤC VỤ</small><p>Toàn quốc · Việt Nam</p></article></div>
      <form className="contact-form" data-reveal><label>Họ và tên<input name="name" required/></label><label>Số điện thoại<input name="phone" type="tel" required/></label><label className="full">Không gian cần tư vấn<input name="project" placeholder="Nhà ở, cửa hàng, văn phòng..."/></label><label className="full">Nội dung<textarea name="message" placeholder="Chia sẻ diện tích, phong cách hoặc mã màu bạn quan tâm..."/></label><button type="submit">Gửi yêu cầu tư vấn <ArrowRight size={17}/></button></form>
    </section>
  </PublicSite>;
}
