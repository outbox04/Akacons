import Image from 'next/image';
import Link from 'next/link';
import { PageHero, PublicSite } from '@/components/public-site';

export default function CollectionsPage() {
  const items=[['/paints/xt-301.jpg','01 · BÊ TÔNG','Hiệu ứng bê tông','89 sắc độ'],['/paints/xv-180.jpg','02 · LIMEWASH','Sơn vôi Limewash','96 sắc độ'],['/paints/xm-03.png','03 · GỈ SÉT','Hiệu ứng gỉ sét','16 sắc độ'],['/paints/mp-06.webp','04 · NGỌC TRAI','Hiệu ứng ngọc trai','17 sắc độ']];
  return <PublicSite>
    <PageHero index="02" eyebrow="Bộ sưu tập" title="Bốn chất liệu," accent="bốn cá tính." description="Mỗi hệ sơn mang một ngôn ngữ bề mặt riêng, từ vẻ mộc của bê tông đến chiều sâu ánh kim của ngọc trai." />
    <section className="page-section collection-grid">{items.map(([image,no,title,count])=><Link href="/ma-son" className="collection-card" data-reveal key={title}><span><Image src={image} alt={title} fill sizes="50vw"/></span><div><section><small>{no}</small><h2>{title}</h2></section><b>{count} →</b></div></Link>)}</section>
  </PublicSite>;
}
