"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Calculator,
  Check,
  ChevronDown,
  ImagePlus,
  Mail,
  MapPin,
  Menu,
  Paintbrush,
  Phone,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import paints from "@/lib/data/generated-paints.json";
import "./brand-home.css";

const categories = [
  ["all", "Tất cả", paints.length],
  ["be-tong", "Hiệu ứng bê tông", 89],
  ["son-voi", "Sơn vôi Limewash", 96],
  ["gi-set", "Hiệu ứng gỉ sét", 16],
  ["ngoc-trai", "Hiệu ứng ngọc trai", 17],
] as const;
const featured = [
  ["XT-01", "Bê tông nguyên bản", "Mộc mạc · Tối giản"],
  ["XV-180", "Limewash xanh cổ", "Tĩnh tại · Thủ công"],
  ["XM-03", "Gỉ sét oxy hóa", "Cá tính · Công nghiệp"],
  ["MP-06", "Ngọc trai ánh kim", "Tinh tế · Sang trọng"],
];
const projects = [
  ["XT-301", "Không gian sống đương đại", "Sơn hiệu ứng bê tông"],
  ["XV-180", "Không gian nghỉ dưỡng", "Sơn vôi Limewash"],
  ["MP-06", "Điểm nhấn nội thất", "Hiệu ứng ngọc trai"],
] as const;
const heroMaps = ["XT-301", "XV-180", "XM-03", "MP-06"] as const;

export default function BrandHome({
  initialSection,
}: {
  initialSection?: string;
}) {
  const [category, setCategory] = useState("all"),
    [query, setQuery] = useState(""),
    [visible, setVisible] = useState(12),
    [selected, setSelected] = useState<(typeof paints)[number] | null>(null),
    [menu, setMenu] = useState(false);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("vi");
    return paints.filter(
      (p) =>
        (category === "all" || p.categoryId === category) &&
        (!q ||
          p.code.toLowerCase().includes(q) ||
          p.name.toLocaleLowerCase("vi").includes(q)),
    );
  }, [category, query]);
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".aka-manifesto,.aka-heading,.aka-project-grid>article,.aka-feature,.aka-process-title,.aka-process-list>div,.aka-tool-cards>a,.aka-paint,.aka-contact>*,footer>*",
    );
    targets.forEach((el, index) => {
      el.classList.add("aka-reveal");
      (el as HTMLElement).style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 4, 3) * 70}ms`,
      );
    });
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    let animationFrame = 0;
    const updateScrollEffects = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (scrollProgressRef.current) {
        scrollProgressRef.current.style.transform = `scaleX(${progress / 100})`;
      }
      document.documentElement.style.setProperty(
        "--aka-parallax",
        `${Math.min(window.scrollY * 0.08, 70)}px`,
      );
      animationFrame = 0;
    };
    const onScroll = () => {
      if (!animationFrame) {
        animationFrame = requestAnimationFrame(updateScrollEffects);
      }
    };
    updateScrollEffects();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);
  useEffect(() => {
    if (!initialSection) return;
    const frame = requestAnimationFrame(() =>
      document
        .getElementById(initialSection)
        ?.scrollIntoView({ block: "start" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [initialSection]);
  return (
    <div className={`aka-site aka-page-${initialSection ?? "home"}`}>
      <div
        ref={scrollProgressRef}
        className="aka-scroll-progress"
      />
      <header className="aka-header">
        <Link className="aka-brand" href="/">
          <Logo />
        </Link>
        <div className="aka-header-right">
          <nav className={menu ? "aka-nav open" : "aka-nav"}>
            {[
              ["/gioi-thieu", "Về AKACONS"],
              ["/bo-suu-tap", "Bộ sưu tập"],
              ["/ma-son", "Bảng màu"],
              ["/cong-cu", "Công cụ AI"],
            ].map(([href, t]) => (
              <Link key={href} href={href} onClick={() => setMenu(false)}>
                {t}
              </Link>
            ))}
          </nav>
          <Link className="aka-header-cta" href="/lien-he">
            Nhận tư vấn <ArrowRight size={17} />
          </Link>
          <button
            className="aka-menu"
            aria-label="Mở menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <section className="aka-hero" id="about">
        <div className="aka-hero-copy">
          <div className="aka-eyebrow">
            <span /> NGHỆ THUẬT BỀ MẶT
          </div>
          <h1>
            Kiến tạo không gian
            <br />
            <em>đậm chất riêng.</em>
          </h1>
          <p>
            AKACONS là đơn vị tư vấn và thi công sơn hiệu ứng thủ công, tạo nên
            những bề mặt độc bản cho không gian sống.
          </p>
          <div className="aka-actions">
            <button className="aka-primary" onClick={() => go("catalog")}>
              Khám phá bảng màu <ArrowRight size={18} />
            </button>
            <button className="aka-link" onClick={() => go("projects")}>
              Công trình tiêu biểu <span>↘</span>
            </button>
          </div>
          <div className="aka-proof">
            <div>
              <strong>218+</strong>
              <span>Mẫu & màu độc bản</span>
            </div>
            <div>
              <strong>04</strong>
              <span>Dòng hiệu ứng</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Hoàn thiện thủ công</span>
            </div>
          </div>
        </div>
        <div className="aka-hero-visual">
          <div className="aka-map-reel">
            {heroMaps.map((code, index) => {
              const paint = paints.find((item) => item.code === code)!;
              return (
                <Image
                  key={code}
                  src={paint.image}
                  alt={`Mẫu màu ${paint.category} ${code}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width:900px) 100vw,48vw"
                />
              );
            })}
          </div>
          <div className="aka-material-stack">
            {heroMaps.map((code) => {
              const paint = paints.find((item) => item.code === code)!;
              return (
                <div className="aka-material" key={code}>
                  <span>
                    <Image src={paint.image} alt="" fill sizes="86px" />
                  </span>
                  <div>
                    <small>MẪU ĐƯỢC YÊU THÍCH</small>
                    <strong>
                      {paint.code} · {paint.name}
                    </strong>
                    <p>{paint.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <b>Bề mặt thật · Sắc độ thật · Cảm xúc thật</b>
        </div>
      </section>
      <section className="aka-manifesto">
        <p>SƠN HIỆU ỨNG</p>
        <h2>
          Dấu ấn <em>độc bản</em>
          <br />
          cho không gian sống đẳng cấp.
        </h2>
      </section>
      <section className="aka-section" id="collections">
        <Heading
          no="01"
          eyebrow="BỘ SƯU TẬP TIÊU BIỂU"
          title={
            <>
              Chạm vào từng <em>sắc độ.</em>
            </>
          }
          text="Mỗi bề mặt là một trải nghiệm thị giác khác biệt, được tạo nên từ kỹ thuật thủ công và sự thấu hiểu vật liệu."
        />
        <div className="aka-featured">
          {featured.map(([code, label, note], i) => {
            const p = paints.find((x) => x.code === code)!;
            return (
              <button
                className={`aka-feature f${i + 1}`}
                key={code}
                onClick={() => setSelected(p)}
              >
                <span>
                  <Image
                    src={p.image}
                    alt={`${p.category} ${p.code}`}
                    fill
                    sizes="(max-width:700px) 100vw,30vw"
                  />
                </span>
                <i>0{i + 1}</i>
                <div>
                  <small>{note}</small>
                  <strong>{label}</strong>
                  <b>
                    {code} <ArrowRight size={16} />
                  </b>
                </div>
              </button>
            );
          })}
        </div>
      </section>
      <section className="aka-process aka-section" id="process">
        <div className="aka-process-title">
          <span>02</span>
          <p>QUY TRÌNH AKACONS</p>
          <h2>
            Đồng hành từ ý tưởng
            <br />
            <em>đến sau khi hoàn thiện.</em>
          </h2>
        </div>
        <div className="aka-process-list">
          {[
            [
              "01",
              "Lắng nghe không gian",
              "Phong cách, ánh sáng và cảm xúc bạn muốn truyền tải.",
            ],
            [
              "02",
              "Chọn mẫu & lên phối cảnh",
              "Đối chiếu mẫu thật và tư vấn sắc độ phù hợp tại công trình.",
            ],
            [
              "03",
              "Thi công thủ công",
              "Nghệ nhân xử lý từng lớp để tạo chiều sâu riêng cho bề mặt.",
            ],
            [
              "04",
              "Nghiệm thu & bảo hành",
              "Bàn giao chỉn chu cùng hướng dẫn chăm sóc và bảo hành.",
            ],
          ].map(([n, t, d]) => (
            <div key={n}>
              <span>{n}</span>
              <section>
                <h3>{t}</h3>
                <p>{d}</p>
              </section>
              <ArrowRight />
            </div>
          ))}
        </div>
      </section>
      <section className="aka-tools-section aka-section" id="tools">
        <Heading
          no="04"
          eyebrow="CÔNG CỤ NHÂN VIÊN"
          title={
            <>
              Hai công cụ.
              <br />
              <em>Một quy trình.</em>
            </>
          }
          text="AI tạo phương án hình ảnh và Dự toán & Báo giá được tách riêng, mỗi công cụ đều lưu lịch sử theo mã nhân viên."
        />
        <div className="aka-tool-cards">
          <Link href="/ai">
            <span>
              <ImagePlus />
            </span>
            <small>01 · AI</small>
            <h3>Tạo hình ảnh bằng AI</h3>
            <p>
              Tải ảnh không gian, chọn mã sơn và lưu thông tin từng lần render
              theo mã nhân viên.
            </p>
            <b>
              Mở công cụ AI <ArrowRight />
            </b>
          </Link>
          <Link href="/bao-gia">
            <span>
              <Calculator />
            </span>
            <small>02 · DỰ TOÁN & BÁO GIÁ</small>
            <h3>Tính và lưu báo giá công trình</h3>
            <p>
              Tính vật tư, nhân công, VAT và xem lại lịch sử báo giá của từng
              nhân viên.
            </p>
            <b>
              Mở Dự toán & Báo giá <ArrowRight />
            </b>
          </Link>
        </div>
      </section>
      <section className="aka-catalog aka-section" id="catalog">
        <Heading
          no="03"
          eyebrow="THƯ VIỆN VẬT LIỆU"
          title={
            <>
              Hơn 218 mẫu & màu độc bản
              <br />
              <em>cho mọi phong cách không gian.</em>
            </>
          }
          text="Khám phá trọn bộ 218 mẫu bề mặt. Mỗi mã sơn đều đi kèm ảnh mẫu thực tế để bạn dễ hình dung chất liệu và sắc độ."
        />
        <div className="aka-tools">
          <div className="aka-tabs">
            {categories.map(([id, name, count]) => (
              <button
                key={id}
                className={category === id ? "active" : ""}
                onClick={() => {
                  setCategory(id);
                  setVisible(12);
                }}
              >
                {name}
                <sup>{count}</sup>
              </button>
            ))}
          </div>
          <label>
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(12);
              }}
              placeholder="Tìm mã sơn, màu sắc..."
            />
          </label>
        </div>
        <div className="aka-paints">
          {filtered.slice(0, visible).map((p) => (
            <button
              className="aka-paint"
              key={p.code}
              onClick={() => setSelected(p)}
            >
              <span>
                <Image
                  src={p.image}
                  alt={`Ảnh mẫu ${p.category} mã ${p.code}`}
                  fill
                  sizes="(max-width:560px) 50vw,(max-width:900px) 33vw,25vw"
                />
              </span>
              <div>
                <section>
                  <small>{p.category}</small>
                  <strong>{p.name}</strong>
                </section>
                <b>{p.code}</b>
              </div>
              <i>
                Xem mẫu lớn <ArrowRight size={15} />
              </i>
            </button>
          ))}
        </div>
        {!filtered.length && (
          <div className="aka-empty">Không tìm thấy mã sơn phù hợp.</div>
        )}
        {visible < filtered.length && (
          <button className="aka-more" onClick={() => setVisible(visible + 12)}>
            Xem thêm mẫu sơn <ChevronDown size={18} />
          </button>
        )}
        <p className="aka-note">
          * Màu sắc trên màn hình có thể chênh lệch nhẹ so với mẫu thực tế.
          AKACONS khuyến nghị xem mẫu trực tiếp tại công trình.
        </p>
      </section>
      <section className="aka-projects aka-section" id="projects">
        <Heading
          no="04"
          eyebrow="CÔNG TRÌNH TIÊU BIỂU"
          title={
            <>
              <span>Dấu ấn riêng</span>
              <br />
              <em>trong từng không gian.</em>
            </>
          }
          text="Các hướng ứng dụng tiêu biểu của sơn hiệu ứng AKACONS trong không gian sống, nghỉ dưỡng và nội thất."
        />
        <div className="aka-project-grid">
          {projects.map(([code, title, type], index) => {
            const paint = paints.find((item) => item.code === code)!;
            return (
              <article className={index === 0 ? "featured" : ""} key={code}>
                <span>
                  <Image
                    src={paint.image}
                    alt={`${title} – ${type}`}
                    fill
                    sizes="(max-width:700px) 100vw,40vw"
                  />
                </span>
                <div>
                  <small>
                    0{index + 1} · {type}
                  </small>
                  <h3>{title}</h3>
                  <Link href="/lien-he">
                    Tư vấn cho công trình <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="aka-contact aka-section" id="contact">
        <div>
          <Sparkles size={20} /> TƯ VẤN MẪU MIỄN PHÍ
        </div>
        <h2>
          Làm mới không gian sống
          <br />
          bằng hiệu ứng <em>độc bản.</em>
        </h2>
        <p>
          Chia sẻ với chúng tôi về không gian của bạn. Đội ngũ AKACONS sẽ tư vấn
          màu sắc, hiệu ứng và gửi mẫu phù hợp.
        </p>
        <section>
          <a className="aka-primary light" href="tel:0945555017">
            <Phone size={18} /> Gọi tư vấn ngay
          </a>
          <a href="mailto:lienhe.aka@gmail.com">
            Gửi yêu cầu tư vấn <ArrowRight size={18} />
          </a>
        </section>
      </section>
      <footer className="aka-footer-new">
        <div className="aka-footer-contact">
          <h3>AKACONS Surface Studio</h3>
          <p>
            Tư vấn và thi công sơn hiệu ứng thủ công, kiến tạo bề mặt độc bản
            cho mọi không gian.
          </p>
          <address>
            <MapPin />
            <span>
              Tầng 2, BT4, Số 1 bán đảo Linh Đàm,
              <br />
              Hoàng Liệt, Hoàng Mai, Hà Nội
            </span>
          </address>
          <a href="mailto:lienhe.aka@gmail.com">
            <Mail /> lienhe.aka@gmail.com
          </a>
          <a href="tel:0945555017">
            <Phone /> 0945 555 017
          </a>
        </div>
        <section>
          <h4>Thương hiệu</h4>
          <Link href="/gioi-thieu">Về chúng tôi</Link>
          <button onClick={() => go("collections")}>Lĩnh vực hoạt động</button>
          <button onClick={() => go("projects")}>Dự án</button>
          <span>Tin tức</span>
          <span>Tuyển dụng</span>
        </section>
        <section>
          <h4>Liên hệ</h4>
          <span>FAQ – Hỏi đáp</span>
          <button onClick={() => go("collections")}>Lĩnh vực hoạt động</button>
          <Link href="/lien-he">Liên hệ</Link>
        </section>
        <section className="aka-newsletter">
          <h4>Đăng ký nhận tin</h4>
          <form onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              aria-label="Địa chỉ email"
              placeholder="Địa chỉ email"
              required
            />
            <button type="submit">Gửi</button>
          </form>
          <div className="aka-socials">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="YouTube">
              ▶
            </a>
            <a href="#" aria-label="Zalo">
              Zalo
            </a>
          </div>
        </section>
        <aside>© All Right Reserved by AKACONS</aside>
      </footer>
      {selected && (
        <div className="aka-backdrop" onClick={() => setSelected(null)}>
          <div className="aka-modal" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)}>
              <X />
            </button>
            <span>
              <Image
                src={selected.image}
                alt={`Mẫu sơn ${selected.code}`}
                fill
                sizes="(max-width:700px) 90vw,55vw"
              />
            </span>
            <section>
              <small>{selected.category}</small>
              <h3>{selected.name}</h3>
              <b>{selected.code}</b>
              <p>
                Ảnh mẫu bề mặt thực tế giúp bạn cảm nhận rõ sắc độ và cấu trúc
                hoàn thiện.
              </p>
              <ul>
                <li>
                  <Check /> Có mẫu thử thực tế
                </li>
                <li>
                  <Paintbrush /> Tư vấn phối màu theo không gian
                </li>
              </ul>
              <button
                className="aka-primary"
                onClick={() => {
                  setSelected(null);
                  go("contact");
                }}
              >
                Nhận tư vấn mã {selected.code} <ArrowRight size={18} />
              </button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
function Logo() {
  return (
    <Image
      className="aka-logo-image"
      src="/brand/akacons-logo.png"
      alt="AKACONS"
      width={1680}
      height={645}
      priority
    />
  );
}
function Heading({
  no,
  eyebrow,
  title,
  text,
}: {
  no: string;
  eyebrow: string;
  title: React.ReactNode;
  text: string;
}) {
  return (
    <div className="aka-heading">
      <div>
        <span>{no}</span>
        <p>{eyebrow}</p>
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
