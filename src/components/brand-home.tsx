"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import "./brand-home.css";

const finishes = [
  { name: "Ghi khoáng", image: "/paints/xt-01.png" },
  { name: "Be tự nhiên", image: "/paints/xt-101.png" },
  { name: "Đá sáng", image: "/paints/xt-301.jpg" },
  { name: "Cát ấm", image: "/paints/xv-01.jpg" },
  { name: "Xanh ngọc", image: "/paints/xv-180.jpg" },
];

const rooms = [
  { name: "Phòng ngủ", image: "/paints/xv-180.jpg" },
  { name: "Phòng khách", image: "/paints/xt-301.jpg" },
  { name: "Phòng làm việc", image: "/paints/mp-06.webp" },
];

const library = [
  ["Sơn đá", "/paints/xt-301.jpg"],
  ["Vữa hiệu ứng", "/paints/xt-101.png"],
  ["Sơn hiệu ứng bê tông", "/paints/xt-01.png"],
  ["Sơn hiệu ứng ánh kim", "/paints/mp-06.webp"],
  ["Sơn hiệu ứng gỉ sét", "/paints/xm-03.png"],
  ["Sơn vôi Limewash", "/paints/xv-180.jpg"],
] as const;

export default function BrandHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [finish, setFinish] = useState(1);
  const [room, setRoom] = useState(1);

  return (
    <main className="surface-home">
      <header className="surface-nav">
        <Link href="/" className="surface-logo" aria-label="AKACONS trang chủ">
          <Image src="/brand/akacons-logo.png" alt="AKACONS" width={172} height={58} priority />
          <span>Surface Studio</span>
        </Link>
        <nav className={menuOpen ? "is-open" : ""}>
          <Link href="#about" onClick={() => setMenuOpen(false)}>Về AKACONS</Link>
          <Link href="#library" onClick={() => setMenuOpen(false)}>Bộ sưu tập</Link>
          <Link href="/ai" onClick={() => setMenuOpen(false)}>Thiết kế AI</Link>
          <Link className="mobile-consult" href="#contact" onClick={() => setMenuOpen(false)}>Nhận tư vấn</Link>
        </nav>
        <Link className="nav-cta" href="#contact">Nhận tư vấn</Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở trình đơn">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero" id="about">
        <Image className="hero-photo" src="/home/hero-townhouse.png" alt="Mặt tiền sơn hiệu ứng AKACONS" fill priority sizes="100vw" />
        <div className="hero-copy">
          <p className="kicker">Nghệ thuật bề mặt</p>
          <h1>Kiến tạo không gian<br /><em>đậm chất riêng</em></h1>
          <h2>Bằng dịch vụ thi công tiêu chuẩn <b>5★</b></h2>
          <p>AKACONS tiên phong trong lĩnh vực tư vấn và thi công sơn hiệu ứng chuyên nghiệp.</p>
          <Link href="#library">Khám phá vật liệu <ArrowRight size={17} /></Link>
        </div>
        <div className="finish-picker" aria-label="Chọn màu hoàn thiện mặt tiền">
          {finishes.map((item, index) => (
            <button key={item.name} className={finish === index ? "active" : ""} onClick={() => setFinish(index)} aria-label={item.name}>
              <Image src={item.image} alt="" fill sizes="60px" />
            </button>
          ))}
        </div>
        <div className="hero-tint" style={{ backgroundImage: `url(${finishes[finish].image})` }} />
      </section>

      <section className="signature">
        <div className="signature-copy">
          <p className="kicker">Không gian ứng dụng</p>
          <h2>Dấu ấn <em>độc bản</em><br />cho không gian đẳng cấp</h2>
          <p>Sơn hiệu ứng được ứng dụng linh hoạt trong nhà ở, nhà hàng, khách sạn và villa — nâng tầm trải nghiệm bằng chiều sâu vật liệu.</p>
          <div className="room-list">
            {rooms.map((item, index) => (
              <button key={item.name} className={room === index ? "active" : ""} onClick={() => setRoom(index)}>
                <span><Image src={item.image} alt={item.name} fill sizes="130px" /></span>{item.name}
              </button>
            ))}
          </div>
          <div className="swatches">
            {finishes.map((item, index) => <button key={item.name} onClick={() => setFinish(index)} className={finish === index ? "active" : ""}><Image src={item.image} alt={item.name} fill sizes="60px" /></button>)}
          </div>
          <Link href="/ai" className="ai-button">Trợ lý chọn màu <ArrowRight size={16} /></Link>
        </div>
        <div className="signature-visual">
          <Image src="/home/hero-townhouse.png" alt={`Phối cảnh ${rooms[room].name}`} fill sizes="(max-width: 800px) 100vw, 45vw" />
          <span>{rooms[room].name} · {finishes[finish].name}</span>
        </div>
      </section>

      <section className="material-library" id="library">
        <p className="kicker">Thư viện vật liệu</p>
        <h2>Bề mặt tạo nên <em>bản sắc</em> không gian</h2>
        <div className="library-grid">
          {library.map(([name, image]) => (
            <Link href="/bo-suu-tap" key={name}>
              <Image src={image} alt={name} fill sizes="(max-width:700px) 50vw, 32vw" />
              <span>{name}</span><ArrowRight />
            </Link>
          ))}
        </div>
      </section>

      <section className="service">
        <Image src="/home/craft-service.png" alt="Nghệ nhân AKACONS thi công sơn hiệu ứng" fill sizes="100vw" />
        <div>
          <p className="kicker">Chuẩn mực hoàn thiện khác biệt</p>
          <h2>Dịch vụ thi công<br />tiêu chuẩn <em>5★</em></h2>
          <p>AKACONS chuẩn hóa từng điểm chạm trong dịch vụ, mang đến sự an tâm tuyệt đối cho khách hàng.</p>
          <ol>
            <li><b>01</b> Dịch vụ đồng hành sớm</li>
            <li><b>02</b> Lên phối cảnh & duyệt mẫu thực tế</li>
            <li><b>03</b> Thi công chuyên nghiệp</li>
            <li><b>04</b> Kiểm soát chất lượng từng giai đoạn</li>
            <li><b>05</b> Nghiệm thu & bảo hành chủ động</li>
          </ol>
        </div>
      </section>

      <section className="contact" id="contact">
        <p className="kicker">Tư vấn mẫu miễn phí</p>
        <h2>Làm mới không gian sống<br />ngay hôm nay</h2>
        <p>Chia sẻ với chúng tôi về không gian của bạn. Đội ngũ AKACONS sẽ tư vấn màu sắc, hiệu ứng và gửi mẫu phù hợp.</p>
        <div>
          <a href="tel:+84900000000"><Phone size={18} /> Liên hệ ngay</a>
          <Link href="/lien-he">Gửi yêu cầu tư vấn <ArrowRight size={18} /></Link>
        </div>
      </section>
    </main>
  );
}
