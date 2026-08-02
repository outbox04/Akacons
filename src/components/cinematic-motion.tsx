"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function buildHomeMaster(home: Element) {
  const page = home as HTMLElement;
  const maxScroll = Math.max(1, page.scrollHeight - window.innerHeight);
  const positionOf = (selector: string) => {
    const element = page.querySelector<HTMLElement>(selector);
    return element
      ? gsap.utils.clamp(0, 0.98, element.offsetTop / maxScroll)
      : 0;
  };
  const positions = {
    about: 0,
    manifesto: positionOf(".aka-manifesto"),
    collections: positionOf("#collections"),
    process: positionOf("#process"),
    catalog: positionOf("#catalog"),
    projects: positionOf("#projects"),
    contact: positionOf("#contact"),
    footer: positionOf(".aka-footer-new"),
  };
  const master = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: page,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.85,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });
  const layers = gsap.utils.toArray<HTMLElement>(".aka-cinema-images > img");
  const chapterEls = gsap.utils.toArray<HTMLElement>(".aka-cinema-chapter");
  gsap.set(layers, { opacity: 0, scale: 1.12 });
  gsap.set(layers[0], { opacity: 0.2 });
  gsap.set(chapterEls, { opacity: 0, yPercent: 70 });
  gsap.set(chapterEls[0], { opacity: 1, yPercent: 0 });

  const scenes = [
    { key: "about", color: "#f5f8f7", layer: 0 },
    { key: "collections", color: "#edf3f1", layer: 1 },
    { key: "process", color: "#163756", layer: 2 },
    { key: "catalog", color: "#f1f5f4", layer: 3 },
    { key: "projects", color: "#e5edeb", layer: 0 },
    { key: "contact", color: "#078d8c", layer: 3 },
  ] as const;
  scenes.forEach((scene, index) => {
    const at = positions[scene.key];
    const previousAt = index ? positions[scenes[index - 1].key] : 0;
    const transition = Math.min(
      0.075,
      Math.max(0.035, (at - previousAt) * 0.22),
    );
    const start = Math.max(0, at - transition * 0.25);
    master.to(
      ".aka-cinema-canvas",
      { backgroundColor: scene.color, duration: transition },
      start,
    );
    layers.forEach((layer, layerIndex) => {
      master.to(
        layer,
        {
          opacity:
            layerIndex === scene.layer
              ? scene.key === "process"
                ? 0.1
                : 0.18
              : 0,
          scale: layerIndex === scene.layer ? 1.02 : 1.12,
          duration: transition,
        },
        start,
      );
    });
    if (index > 0) {
      master.to(
        chapterEls[index - 1],
        { opacity: 0, yPercent: -70, duration: transition * 0.48 },
        start,
      );
      master.fromTo(
        chapterEls[index],
        { opacity: 0, yPercent: 70 },
        { opacity: 1, yPercent: 0, duration: transition * 0.62 },
        start + transition * 0.28,
      );
    }
  });
  master.to(
    ".aka-cinema-canvas",
    { backgroundColor: "#112c4c", duration: 0.045 },
    positions.footer - 0.015,
  );

  master
    .to(
      ".aka-hero-copy",
      { yPercent: -12, opacity: 0.1, duration: 0.075 },
      0.01,
    )
    .to(
      ".aka-hero-visual",
      { scale: 0.82, clipPath: "inset(8% 7% 10% 7%)", duration: 0.085 },
      0.005,
    )
    .to(
      ".aka-material-stack",
      { y: -45, scale: 0.86, opacity: 0, duration: 0.065 },
      0.018,
    )
    .fromTo(
      ".aka-manifesto h2",
      { opacity: 0.08, y: 75, scale: 0.93 },
      { opacity: 1, y: 0, scale: 1, duration: 0.07 },
      Math.max(0.01, positions.manifesto - 0.035),
    );

  const addSceneReveal = (
    selector: string,
    at: number,
    from: gsap.TweenVars,
    duration = 0.065,
  ) => {
    master.fromTo(
      selector,
      from,
      {
        x: 0,
        y: 0,
        xPercent: 0,
        opacity: 1,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        stagger: 0.006,
        duration,
      },
      Math.max(0, at - duration * 0.28),
    );
  };
  addSceneReveal("#collections .aka-heading > *", positions.collections, {
    y: 44,
    opacity: 0,
  });
  addSceneReveal(
    ".aka-feature",
    positions.collections + 0.018,
    { y: 80, opacity: 0, scale: 0.96, clipPath: "inset(14% 8% 14% 8%)" },
    0.085,
  );
  addSceneReveal(".aka-process-title", positions.process, {
    x: -65,
    opacity: 0.1,
  });
  addSceneReveal(
    ".aka-process-list > div",
    positions.process + 0.012,
    { x: 90, opacity: 0 },
    0.08,
  );
  addSceneReveal("#catalog .aka-heading > *", positions.catalog, {
    y: 44,
    opacity: 0,
  });
  addSceneReveal(
    ".aka-paint",
    positions.catalog + 0.015,
    { y: 65, opacity: 0, scale: 0.95 },
    0.11,
  );
  addSceneReveal("#projects .aka-heading > *", positions.projects, {
    y: 44,
    opacity: 0,
  });
  addSceneReveal(
    ".aka-project-grid article",
    positions.projects + 0.012,
    { xPercent: 20, opacity: 0, clipPath: "inset(0 0 0 28%)" },
    0.08,
  );
  addSceneReveal(
    ".aka-contact > *",
    positions.contact,
    { y: 48, opacity: 0 },
    0.07,
  );

  document
    .querySelectorAll<HTMLElement>(".aka-proof strong")
    .forEach((element) => {
      const original = element.textContent ?? "0";
      const target = Number(original.replace(/\D/g, ""));
      const prefix = original.startsWith("0") ? "0" : "";
      const suffix = original.replace(/[\d]/g, "");
      const counter = { value: 0 };
      master.to(
        counter,
        {
          value: target,
          duration: 0.045,
          snap: { value: 1 },
          onUpdate: () => {
            const value = Math.round(counter.value);
            element.textContent = `${prefix && value < 10 ? prefix : ""}${value}${suffix}`;
          },
        },
        0.005,
      );
    });
}

function buildHomeMobileMaster(home: Element) {
  const page = home as HTMLElement;
  const maxScroll = Math.max(1, page.scrollHeight - window.innerHeight);
  const positionOf = (selector: string) => {
    const element = page.querySelector<HTMLElement>(selector);
    return element
      ? gsap.utils.clamp(0, 0.98, element.offsetTop / maxScroll)
      : 0;
  };
  const master = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: page,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.45,
      invalidateOnRefresh: true,
    },
  });
  const layers = gsap.utils.toArray<HTMLElement>(".aka-cinema-images > img");
  gsap.set(layers, { opacity: 0, scale: 1.04 });
  const scenes = [
    [".aka-hero", "#f5f8f7", 0],
    ["#collections", "#edf3f1", 1],
    ["#process", "#163756", 2],
    ["#catalog", "#f1f5f4", 3],
    ["#projects", "#e5edeb", 0],
    ["#contact", "#078d8c", 3],
    [".aka-footer-new", "#112c4c", -1],
  ] as const;
  scenes.forEach(([selector, color, activeLayer], index) => {
    const at = positionOf(selector);
    const duration = index ? 0.035 : 0.01;
    master.to(
      ".aka-cinema-canvas",
      { backgroundColor: color, duration },
      Math.max(0, at - 0.01),
    );
    layers.forEach((layer, layerIndex) => {
      master.to(
        layer,
        { opacity: layerIndex === activeLayer ? 0.07 : 0, duration },
        Math.max(0, at - 0.01),
      );
    });
  });
}

function buildSingleStage(home: Element, mobile: boolean) {
  const track = home.querySelector<HTMLElement>(".aka-story-track");
  const scenes = gsap.utils.toArray<HTMLElement>(".aka-story-scene");
  const layers = gsap.utils.toArray<HTMLElement>(".aka-cinema-images > img");
  const chapterEls = gsap.utils.toArray<HTMLElement>(".aka-cinema-chapter");
  if (!track || !scenes.length) return;

  document.documentElement.classList.add("cinematic-ready");

  gsap.set(scenes, {
    autoAlpha: 0,
    pointerEvents: "none",
    yPercent: 10,
    scale: 1.035,
  });
  gsap.set(scenes[0], {
    autoAlpha: 1,
    pointerEvents: "auto",
    yPercent: 0,
    scale: 1,
  });
  gsap.set(layers, { opacity: 0, scale: 1.08 });
  gsap.set(layers[0], { opacity: mobile ? 0.07 : 0.18 });
  gsap.set(chapterEls, { opacity: 0, yPercent: 80 });
  gsap.set(chapterEls[0], { opacity: 1, yPercent: 0 });

  const colors = [
    "#f5f8f7",
    "#e7efed",
    "#edf3f1",
    "#163756",
    "#f1f5f4",
    "#e5edeb",
    "#078d8c",
  ];
  const activeLayers = [0, 0, 1, 2, 3, 0, 3];
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: mobile ? 0.45 : 0.9,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        document.documentElement.style.setProperty(
          "--story-progress",
          self.progress.toFixed(4),
        );
      },
    },
  });

  scenes.slice(1).forEach((next, index) => {
    const previous = scenes[index];
    const start = index * 0.92;
    const duration = mobile ? 0.82 : 1.08;
    const nextImage = activeLayers[index + 1];
    timeline
      .to(
        previous,
        {
          autoAlpha: 0,
          yPercent: -9,
          scale: 0.95,
          clipPath: "inset(7% 5% 7% 5%)",
          duration: duration * 0.78,
        },
        start,
      )
      .fromTo(
        next,
        {
          autoAlpha: 0,
          yPercent: 12,
          scale: 1.04,
          clipPath: "inset(12% 7% 12% 7%)",
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration,
        },
        start + duration * 0.18,
      )
      .set(previous, { pointerEvents: "none" }, start + duration * 0.55)
      .set(next, { pointerEvents: "auto" }, start + duration * 0.42)
      .to(
        ".aka-cinema-canvas",
        { backgroundColor: colors[index + 1], duration },
        start + duration * 0.08,
      )
      .to(
        ".aka-cinema-images",
        {
          xPercent: mobile ? 0 : index % 2 ? -8 : 7,
          yPercent: mobile ? 0 : index % 3 === 0 ? 4 : -3,
          scale: mobile ? 1.01 : index === 2 ? 0.72 : 1.03,
          clipPath: mobile
            ? "inset(0%)"
            : index === 2
              ? "inset(12% 8% 12% 48%)"
              : "inset(0%)",
          duration,
        },
        start,
      )
      .to(layers, { opacity: 0, duration: duration * 0.45 }, start)
      .to(
        layers[nextImage],
        {
          opacity: mobile ? 0.07 : index === 2 ? 0.22 : 0.16,
          scale: 1.01,
          duration: duration * 0.78,
        },
        start + duration * 0.2,
      )
      .to(
        chapterEls[index],
        { opacity: 0, yPercent: -85, duration: duration * 0.38 },
        start + duration * 0.12,
      )
      .fromTo(
        chapterEls[index + 1],
        { opacity: 0, yPercent: 85 },
        { opacity: 1, yPercent: 0, duration: duration * 0.48 },
        start + duration * 0.38,
      );

    const revealTargets = next.querySelectorAll<HTMLElement>(
      ".aka-heading, .aka-process-title, .aka-process-list>div, .aka-feature, .aka-paint, .aka-project-grid article, .aka-contact>*",
    );
    if (revealTargets.length) {
      timeline.fromTo(
        revealTargets,
        { opacity: 0, y: mobile ? 22 : 42 },
        {
          opacity: 1,
          y: 0,
          stagger: mobile ? 0.015 : 0.025,
          duration: duration * 0.62,
        },
        start + duration * 0.32,
      );
    }
  });

  const counterStart = { first: 0, second: 0, third: 0 };
  const proof = document.querySelectorAll<HTMLElement>(".aka-proof strong");
  timeline.to(
    counterStart,
    {
      first: 218,
      second: 4,
      third: 100,
      snap: { first: 1, second: 1, third: 1 },
      duration: 0.55,
      onUpdate: () => {
        if (proof[0])
          proof[0].textContent = `${Math.round(counterStart.first)}+`;
        if (proof[1])
          proof[1].textContent = String(
            Math.round(counterStart.second),
          ).padStart(2, "0");
        if (proof[2])
          proof[2].textContent = `${Math.round(counterStart.third)}%`;
      },
    },
    0,
  );
  timeline.to(
    ".aka-cinema-canvas",
    { backgroundColor: "#112c4c", duration: 0.38 },
    ">-0.08",
  );
}

export default function CinematicMotion() {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasHome = Boolean(document.querySelector(".aka-page-home"));
    const canvasMode = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );
    const syncCanvasMode = () =>
      document.documentElement.classList.toggle(
        "cinematic-active",
        hasHome && canvasMode.matches,
      );
    syncCanvasMode();
    canvasMode.addEventListener("change", syncCanvasMode);
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
          buildSingleStage(home, false);
        }
        if (home && home.hasAttribute("data-legacy-motion")) {
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
        const mobileHome = document.querySelector(".aka-page-home");
        if (mobileHome) buildSingleStage(mobileHome, true);
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
      canvasMode.removeEventListener("change", syncCanvasMode);
      document.documentElement.classList.remove("cinematic-active");
      document.documentElement.classList.remove("cinematic-ready");
    };
  }, [pathname]);

  return (
    <div ref={curtainRef} className="cinematic-curtain" aria-hidden="true" />
  );
}
