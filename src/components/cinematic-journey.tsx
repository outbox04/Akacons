"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import paints from "@/lib/data/generated-paints.json";
import "./cinematic-journey.css";

gsap.registerPlugin(ScrollTrigger);

const story = [
  "Mở đầu",
  "Thương hiệu",
  "Vật liệu",
  "Quy trình",
  "Thư viện",
  "Công trình",
  "Liên hệ",
];
const imageCodes = ["XT-301", "XV-180", "XM-03", "MP-06"];

export default function CinematicJourney() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const context = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>(".journey-scene");
      const images = gsap.utils.toArray<HTMLElement>(".journey-media img");
      gsap.set(scenes, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(scenes[0], { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(images, { opacity: 0, scale: 1.12 });
      gsap.set(images[0], { opacity: 1, scale: 1.02 });

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 901px)",
          mobile: "(max-width: 900px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (match) => {
          if (match.conditions?.reduce) {
            gsap.set(scenes, {
              clearProps: "all",
              autoAlpha: 1,
              pointerEvents: "auto",
            });
            return;
          }
          const mobile = Boolean(match.conditions?.mobile);
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: ".journey-track",
              start: "top top",
              end: "bottom bottom",
              scrub: mobile ? 0.45 : 0.9,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const index = Math.min(
                  story.length - 1,
                  Math.round(self.progress * (story.length - 1)),
                );
                root.current?.style.setProperty(
                  "--journey-progress",
                  String(self.progress),
                );
                root.current?.style.setProperty(
                  "--journey-index",
                  String(index),
                );
                const digit = root.current?.querySelector<HTMLElement>(
                  ".journey-progress span",
                );
                if (digit) digit.textContent = String(index + 1);
                root.current
                  ?.querySelectorAll(".journey-dots button")
                  .forEach((button, buttonIndex) =>
                    button.classList.toggle("active", buttonIndex === index),
                  );
              },
            },
          });
          const colors = [
            "#f4f7f5",
            "#e7efed",
            "#dce9e6",
            "#173957",
            "#edf3f1",
            "#dfe8e5",
            "#078e8d",
          ];
          scenes.slice(1).forEach((next, i) => {
            const previous = scenes[i];
            const start = i;
            const imageIndex = (i + 1) % images.length;
            timeline
              .to(
                previous,
                { autoAlpha: 0, yPercent: -14, scale: 0.94, duration: 0.82 },
                start,
              )
              .fromTo(
                next,
                { autoAlpha: 0, yPercent: 16, scale: 1.035 },
                { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.92 },
                start + 0.18,
              )
              .set(previous, { pointerEvents: "none" }, start + 0.55)
              .set(next, { pointerEvents: "auto" }, start + 0.45)
              .to(
                ".journey-stage",
                { backgroundColor: colors[i + 1], duration: 0.9 },
                start + 0.08,
              )
              .to(
                ".journey-shade",
                {
                  opacity: i + 1 === 3 || i + 1 === 6 ? 0.08 : 1,
                  duration: 0.72,
                },
                start + 0.08,
              )
              .to(
                ".journey-media",
                {
                  xPercent: mobile ? 0 : i % 2 ? -22 : 20,
                  yPercent: mobile ? 12 : i % 3 ? 5 : -5,
                  scale: mobile ? 0.86 : i === 2 ? 0.64 : 0.82,
                  clipPath: mobile
                    ? "inset(8% 5% 8% 5% round 18px)"
                    : i === 2
                      ? "inset(10% 5% 10% 48% round 24px)"
                      : "inset(5% 7% 5% 7% round 22px)",
                  duration: 0.95,
                },
                start,
              )
              .to(images, { opacity: 0, duration: 0.42 }, start)
              .to(
                images[imageIndex],
                { opacity: 1, scale: 1.01, duration: 0.72 },
                start + 0.2,
              )
              .fromTo(
                next.querySelectorAll("[data-line]"),
                { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.62 },
                start + 0.3,
              );
          });
          return () => timeline.kill();
        },
      );
      return () => mm.revert();
    }, root);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => {
      window.clearTimeout(refresh);
      context.revert();
    };
  }, []);

  const jump = (index: number) => {
    const track = root.current?.querySelector<HTMLElement>(".journey-track");
    if (!track) return;
    window.scrollTo({
      top:
        track.offsetTop +
        (track.offsetHeight - window.innerHeight) *
          (index / (story.length - 1)),
      behavior: "smooth",
    });
  };

  return (
    <div className="journey" ref={root}>
      <header className="journey-header">
        <Link href="/">
          <Image
            src="/brand/akacons-logo.png"
            alt="AKACONS"
            width={1680}
            height={645}
            priority
          />
        </Link>
        <nav>
          <Link href="/gioi-thieu">Về AKACONS</Link>
          <Link href="/bo-suu-tap">Bộ sưu tập</Link>
          <Link href="/ma-son">Bảng màu</Link>
          <Link href="/cong-cu">Công cụ AI</Link>
        </nav>
        <Link className="journey-cta" href="/lien-he">
          Nhận tư vấn <ArrowRight size={17} />
        </Link>
      </header>
      <main className="journey-track">
        <div className="journey-stage">
          <div className="journey-media">
            {imageCodes.map((code) => {
              const paint = paints.find((item) => item.code === code)!;
              return (
                <Image
                  key={code}
                  src={paint.image}
                  alt=""
                  fill
                  priority={code === "XT-301"}
                  sizes="100vw"
                />
              );
            })}
          </div>
          <div className="journey-shade" />
          <section className="journey-scene scene-hero">
            <div>
              <small data-line>NGHỆ THUẬT BỀ MẶT</small>
              <h1 data-line>
                Kiến tạo không gian
                <br />
                <em>đậm chất riêng.</em>
              </h1>
              <p data-line>
                AKACONS tư vấn và thi công sơn hiệu ứng thủ công, tạo nên những
                bề mặt độc bản cho không gian sống.
              </p>
              <Link data-line href="/ma-son">
                Khám phá bảng màu <ArrowRight />
              </Link>
            </div>
          </section>
          <section className="journey-scene scene-manifesto">
            <div>
              <small data-line>01 · SƠN HIỆU ỨNG</small>
              <h2 data-line>
                Dấu ấn <em>độc bản</em>
                <br />
                cho không gian sống đẳng cấp.
              </h2>
            </div>
          </section>
          <section className="journey-scene scene-material">
            <div>
              <small data-line>02 · VẬT LIỆU</small>
              <h2 data-line>
                Chạm vào từng
                <br />
                <em>sắc độ.</em>
              </h2>
              <p data-line>
                Bê tông, Limewash, gỉ sét và ngọc trai được hoàn thiện thủ công
                để mỗi bề mặt mang một cá tính riêng.
              </p>
            </div>
          </section>
          <section className="journey-scene scene-process">
            <div>
              <small data-line>03 · QUY TRÌNH AKACONS</small>
              <h2 data-line>
                Đồng hành từ ý tưởng
                <br />
                <em>đến sau khi hoàn thiện.</em>
              </h2>
              <ol data-line>
                <li>Lắng nghe không gian</li>
                <li>Chọn mẫu và phối cảnh</li>
                <li>Thi công thủ công</li>
                <li>Nghiệm thu và bảo hành</li>
              </ol>
            </div>
          </section>
          <section className="journey-scene scene-library">
            <div>
              <small data-line>04 · THƯ VIỆN VẬT LIỆU</small>
              <h2 data-line>
                Hơn 218 mẫu & màu độc bản
                <br />
                <em>cho mọi phong cách không gian.</em>
              </h2>
              <div className="journey-stats" data-line>
                <span>
                  <b>218+</b>Mẫu màu
                </span>
                <span>
                  <b>04</b>Dòng hiệu ứng
                </span>
                <span>
                  <b>100%</b>Thủ công
                </span>
              </div>
              <Link data-line href="/ma-son">
                Xem toàn bộ bảng màu <ArrowRight />
              </Link>
            </div>
          </section>
          <section className="journey-scene scene-project">
            <div>
              <small data-line>05 · CÔNG TRÌNH TIÊU BIỂU</small>
              <h2 data-line>
                Dấu ấn riêng
                <br />
                <em>trong từng không gian.</em>
              </h2>
              <p data-line>
                Từ nhà ở đương đại tới không gian nghỉ dưỡng, vật liệu được lựa
                chọn để trở thành một phần của kiến trúc.
              </p>
              <Link data-line href="/lien-he">
                Tư vấn cho công trình <ArrowRight />
              </Link>
            </div>
          </section>
          <section className="journey-scene scene-contact">
            <div>
              <small data-line>06 · BẮT ĐẦU HÀNH TRÌNH</small>
              <h2 data-line>
                Làm mới không gian sống
                <br />
                bằng hiệu ứng <em>độc bản.</em>
              </h2>
              <p data-line>Chia sẻ với AKACONS về không gian của bạn.</p>
              <Link data-line href="/lien-he">
                Gửi yêu cầu tư vấn <ArrowRight />
              </Link>
            </div>
          </section>
          <aside className="journey-progress">
            <b>
              0<span>1</span>
            </b>
            <i />
            <small>Hành trình AKACONS</small>
          </aside>
          <nav className="journey-dots" aria-label="Các cảnh">
            {story.map((label, index) => (
              <button
                key={label}
                onClick={() => jump(index)}
                aria-label={label}
              >
                <i />
              </button>
            ))}
          </nav>
        </div>
      </main>
      <footer className="journey-footer">
        <div>
          <h3>AKACONS Surface Studio</h3>
          <p>
            Tư vấn và thi công sơn hiệu ứng thủ công, kiến tạo bề mặt độc bản
            cho mọi không gian.
          </p>
        </div>
        <address>
          <MapPin /> Tầng 2, BT4, Số 1 bán đảo Linh Đàm, Hoàng Liệt, Hoàng Mai,
          Hà Nội
        </address>
        <a href="mailto:lienhe.aka@gmail.com">
          <Mail /> lienhe.aka@gmail.com
        </a>
        <a href="tel:0945555017">
          <Phone /> 0945 555 017
        </a>
      </footer>
    </div>
  );
}
