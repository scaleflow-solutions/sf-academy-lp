"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type ProofItem = {
  id: number;
  type: "image" | "video";
  src: string;
  caption: string;
  icon: string;
};

const VOICE =
  "شوف رأي الناس في المفاهيم اللي زياد هيشرحها في الكورس وإزاي ساعدتهم";
const MONEY = "دي مكاسب جيجات من شغل يوم واحد";

// Center starts on the 10,500 EGP transfer — strong money proof on first paint.
const PROOF: ProofItem[] = [
  { id: 0, type: "image", src: "/testimonials/testimonial_1.png", caption: VOICE, icon: "forum" },
  { id: 1, type: "image", src: "/testimonials/2-trans.png", caption: MONEY, icon: "payments" },
  { id: 2, type: "image", src: "/testimonials/3-trans.png", caption: MONEY, icon: "payments" },
  { id: 3, type: "video", src: "/testimonials/vid_testimonial.mp4", caption: VOICE, icon: "videocam" },
  { id: 4, type: "image", src: "/testimonials/transfer-instapay.png", caption: MONEY, icon: "payments" },
  { id: 5, type: "image", src: "/testimonials/4-trans.png", caption: MONEY, icon: "payments" },
  { id: 6, type: "image", src: "/testimonials/5-trans.png", caption: MONEY, icon: "payments" },
  { id: 7, type: "image", src: "/testimonials/transfer-2.png", caption: MONEY, icon: "payments" },
  { id: 8, type: "image", src: "/testimonials/third-transfer.png", caption: MONEY, icon: "payments" },
];

type CardItem = ProofItem & { key: number };

const CARD_DESKTOP = { w: 300, h: 472 };
const CARD_MOBILE = { w: 224, h: 392 };

function ProofVideo({ src, isCenter }: { src: string; isCenter: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <video
        ref={ref}
        src={src}
        controls={isCenter}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`h-full w-full object-contain ${
          isCenter ? "" : "pointer-events-none"
        }`}
      />
      {!playing && (
        <button
          type="button"
          tabIndex={isCenter ? 0 : -1}
          aria-label="شغّل الفيديو"
          onClick={
            isCenter
              ? (e) => {
                  e.stopPropagation();
                  ref.current?.play();
                }
              : undefined
          }
          className={`absolute inset-0 flex items-center justify-center ${
            isCenter ? "cursor-pointer" : "pointer-events-none"
          }`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-black bg-primary text-on-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-[40px]">
              play_arrow
            </span>
          </span>
        </button>
      )}
    </>
  );
}

function ProofCard({
  item,
  position,
  card,
  onMove,
}: {
  item: CardItem;
  position: number;
  card: { w: number; h: number };
  onMove: (steps: number) => void;
}) {
  const isCenter = position === 0;
  const offset = card.w * 0.62;
  const tiltUp = position % 2 === 0;

  return (
    <div
      onClick={() => onMove(position)}
      onKeyDown={(e) => {
        if (!isCenter && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onMove(position);
        }
      }}
      role={isCenter ? undefined : "button"}
      tabIndex={isCenter ? -1 : 0}
      aria-label={isCenter ? undefined : "اعرض الدليل ده"}
      className={`absolute left-1/2 top-1/2 flex flex-col overflow-hidden rounded-xl border-2 border-black bg-black transition-all duration-500 ease-in-out motion-reduce:transition-none ${
        isCenter ? "cursor-default" : "cursor-pointer"
      }`}
      style={{
        width: card.w,
        height: card.h,
        zIndex: 20 - Math.abs(position),
        opacity: 1 - Math.min(Math.abs(position), 3) * 0.22,
        boxShadow: isCenter
          ? "8px 8px 0px 0px rgba(0,0,0,1)"
          : "3px 3px 0px 0px rgba(0,0,0,1)",
        transform: `translate(-50%, -50%) translateX(${offset * position}px) translateY(${
          isCenter ? 0 : tiltUp ? -22 : 22
        }px) rotate(${isCenter ? 0 : tiltUp ? -3 : 3}deg) scale(${
          isCenter ? 1 : 0.88
        })`,
      }}
    >
      <div className="relative flex-1 bg-black">
        {item.type === "image" ? (
          <Image
            src={item.src}
            alt={item.caption}
            fill
            className="object-contain"
            sizes="(min-width: 640px) 300px, 224px"
          />
        ) : (
          <ProofVideo src={item.src} isCenter={isCenter} />
        )}
      </div>
      <div
        className={`flex h-[92px] shrink-0 items-center justify-center gap-2 overflow-hidden border-t-2 border-black px-3 text-center font-label-md text-label-sm font-bold leading-tight ${
          isCenter ? "bg-primary text-on-primary" : "bg-surface text-on-surface"
        }`}
      >
        <span className="material-symbols-outlined shrink-0 text-base">
          {item.icon}
        </span>
        {item.caption}
      </div>
    </div>
  );
}

export default function ProofCarousel() {
  const [list, setList] = useState<CardItem[]>(() =>
    PROOF.map((it) => ({ ...it, key: it.id })),
  );
  const [card, setCard] = useState(CARD_DESKTOP);
  const [paused, setPaused] = useState(false);

  const move = useCallback((steps: number) => {
    setList((prev) => {
      const next = [...prev];
      if (steps > 0) {
        for (let i = 0; i < steps; i++) {
          const it = next.shift();
          if (it) next.push({ ...it, key: Math.random() });
        }
      } else {
        for (let i = 0; i < -steps; i++) {
          const it = next.pop();
          if (it) next.unshift({ ...it, key: Math.random() });
        }
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const update = () =>
      setCard(
        window.matchMedia("(min-width: 640px)").matches
          ? CARD_DESKTOP
          : CARD_MOBILE,
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const centerIndex = Math.floor(list.length / 2);
  const centerIsVideo = list[centerIndex]?.type === "video";

  // Auto-advance, but never interrupt a centered video or a hovering visitor.
  useEffect(() => {
    if (paused || centerIsVideo) return;
    const timer = setInterval(() => move(1), 5000);
    return () => clearInterval(timer);
  }, [paused, centerIsVideo, move]);

  return (
    <div
      role="region"
      aria-label="آراء ونتائج المشتركين"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") move(-1);
        if (e.key === "ArrowLeft") move(1);
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ height: card.h + 72 }}
      >
        {list.map((item, index) => (
          <ProofCard
            key={item.key}
            item={item}
            position={index - centerIndex}
            card={card}
            onMove={move}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="السابق"
          className="neo-button flex h-14 w-14 items-center justify-center rounded-lg border-2 border-black bg-surface text-on-surface hover:bg-primary hover:text-on-primary"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="التالي"
          className="neo-button flex h-14 w-14 items-center justify-center rounded-lg border-2 border-black bg-surface text-on-surface hover:bg-primary hover:text-on-primary"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
      </div>
    </div>
  );
}
