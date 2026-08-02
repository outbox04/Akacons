"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicMotion() {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 901px)");
    let frame = 0;
    let lenis: Lenis | null = null;
    let media: ReturnType<typeof gsap.matchMedia> | null = null;

    if (!reduceMotion.matches) {
      lenis = new Lenis({
        duration: desktop.matches ? 1.12 : 0.82,
        smoothWheel: desktop.matches,
        syncTouch: false,
        wheelMultiplier: 0.88,
        touchMultiplier: 1,
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      lenis.on("scroll", ScrollTrigger.update);
      frame = requestAnimationFrame(raf);
    }

    const context = gsap.context(() => {
      if (curtainRef.current && !reduceMotion.matches) {
        gsap.fromTo(
          curtainRef.current,
          { scaleY: 1, transformOrigin: "top" },
          {
            scaleY: 0,
            duration: 0.75,
            ease: "power3.inOut",
            clearProps: "transform",
          },
        );
      }

      if (reduceMotion.matches) {
        gsap.set("[data-reveal], .aka-reveal", {
          clearProps: "all",
          opacity: 1,
          y: 0,
        });
        return;
      }

      media = gsap.matchMedia();
      media.add("(min-width: 901px)", () => {
        const home = document.querySelector(".aka-page-home");
        if (home) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".aka-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
              },
            })
            .to(
              ".aka-hero-copy",
              { yPercent: -10, opacity: 0.22, ease: "none" },
              0,
            )
            .to(
              ".aka-hero-visual",
              { scale: 0.94, clipPath: "inset(5% 4% 7% 4%)", ease: "none" },
              0,
            )
            .to(".aka-material-stack", { y: -42, scale: 0.9, ease: "none" }, 0);

          gsap.fromTo(
            ".aka-manifesto h2",
            { opacity: 0.08, y: 80, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".aka-manifesto",
                start: "top 88%",
                end: "center 48%",
                scrub: 0.7,
              },
            },
          );
          gsap.fromTo(
            ".aka-manifesto",
            { backgroundColor: "#f5f8f7" },
            {
              backgroundColor: "#e4efed",
              ease: "none",
              scrollTrigger: {
                trigger: ".aka-manifesto",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          gsap.utils
            .toArray<HTMLElement>(".aka-page-home .aka-heading")
            .forEach((heading) => {
              gsap.fromTo(
                heading.children,
                { opacity: 0, y: 46 },
                {
                  opacity: 1,
                  y: 0,
                  stagger: 0.08,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 82%",
                    end: "top 48%",
                    scrub: 0.55,
                  },
                },
              );
            });

          gsap.fromTo(
            ".aka-feature",
            { clipPath: "inset(14% 8% 14% 8%)", y: 90, scale: 0.96 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              scale: 1,
              stagger: 0.08,
              ease: "none",
              scrollTrigger: {
                trigger: "#collections",
                start: "top 70%",
                end: "bottom 82%",
                scrub: 0.8,
              },
            },
          );

          const process = gsap.timeline({
            scrollTrigger: {
              trigger: ".aka-process",
              start: "top 72%",
              end: "bottom 45%",
              scrub: 0.75,
            },
          });
          process
            .fromTo(
              ".aka-process-title",
              { x: -70, opacity: 0.15 },
              { x: 0, opacity: 1, ease: "none" },
              0,
            )
            .fromTo(
              ".aka-process-list > div",
              { x: 100, opacity: 0.05 },
              { x: 0, opacity: 1, stagger: 0.13, ease: "none" },
              0.08,
            );

          gsap.fromTo(
            ".aka-paint",
            { y: 75, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.025,
              ease: "power1.out",
              scrollTrigger: {
                trigger: ".aka-paints",
                start: "top 88%",
                end: "center 58%",
                scrub: 0.65,
              },
            },
          );

          gsap.fromTo(
            ".aka-project-grid article",
            { xPercent: 22, clipPath: "inset(0 0 0 30%)", opacity: 0.1 },
            {
              xPercent: 0,
              clipPath: "inset(0 0 0 0%)",
              opacity: 1,
              stagger: 0.13,
              ease: "none",
              scrollTrigger: {
                trigger: "#projects",
                start: "top 76%",
                end: "bottom 70%",
                scrub: 0.8,
              },
            },
          );

          gsap.fromTo(
            ".aka-contact > *",
            { y: 55, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: ".aka-contact",
                start: "top 80%",
                end: "center 55%",
                scrub: 0.65,
              },
            },
          );

          document
            .querySelectorAll<HTMLElement>(".aka-proof strong")
            .forEach((element) => {
              const original = element.textContent ?? "0";
              const target = Number(original.replace(/\D/g, ""));
              const prefix = original.startsWith("0") ? "0" : "";
              const suffix = original.replace(/[\d]/g, "");
              ScrollTrigger.create({
                trigger: ".aka-hero",
                start: "top top",
                end: "55% top",
                onUpdate: (self) => {
                  const value = Math.max(
                    0,
                    Math.round(target * Math.min(self.progress * 2.2, 1)),
                  );
                  element.textContent = `${prefix && value < 10 ? prefix : ""}${value}${suffix}`;
                },
              });
            });
        }

        gsap.fromTo(
          ".public-site .page-kicker, .public-site .page-hero h1, .public-site .page-hero p",
          { y: 48, opacity: 0, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            stagger: 0.1,
            duration: 0.9,
            ease: "power3.out",
          },
        );
        gsap.utils
          .toArray<HTMLElement>(".public-site [data-reveal]")
          .forEach((element) => {
            gsap.fromTo(
              element,
              { y: 55, opacity: 0, clipPath: "inset(8% 0 8% 0)" },
              {
                y: 0,
                opacity: 1,
                clipPath: "inset(0% 0 0% 0)",
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          });

        gsap.fromTo(
          ".tool-page .tool-hero > *",
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.75,
            ease: "power3.out",
          },
        );
        gsap.utils
          .toArray<HTMLElement>(".tool-page .tool-card")
          .forEach((card) => {
            gsap.fromTo(
              card,
              { y: 38, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.75,
                ease: "power2.out",
                scrollTrigger: { trigger: card, start: "top 92%", once: true },
              },
            );
          });
      });

      media.add("(max-width: 900px)", () => {
        gsap.utils
          .toArray<HTMLElement>(
            ".aka-heading, .aka-feature, .aka-process-list > div, .aka-paint, .aka-project-grid article, .public-site [data-reveal], .tool-page .tool-card",
          )
          .forEach((element) => {
            gsap.fromTo(
              element,
              { y: 28, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.65,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 92%",
                  once: true,
                },
              },
            );
          });
      });
    });

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    const refreshOnLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") refreshOnLoad();
    else window.addEventListener("load", refreshOnLoad, { once: true });
    return () => {
      window.clearTimeout(refresh);
      window.removeEventListener("load", refreshOnLoad);
      cancelAnimationFrame(frame);
      lenis?.destroy();
      media?.revert();
      context.revert();
    };
  }, [pathname]);

  return (
    <div ref={curtainRef} className="cinematic-curtain" aria-hidden="true" />
  );
}
