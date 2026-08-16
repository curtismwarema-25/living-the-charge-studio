import { useEffect, useRef, useState, type ReactNode } from "react";

/** Scales the fixed 794px A4 page down to fit the preview column. */
export function PagesViewport({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, (el.clientWidth - 8) / 794));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className="w-full">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          height: 0,
        }}
        className="flex flex-col items-center gap-8"
      >
        <div className="flex flex-col items-center gap-8" ref={undefined}>
          {children}
        </div>
      </div>
      <ScaleSpacer scale={scale} />
    </div>
  );
}

/** Reserves the vertical space consumed by the scaled pages. */
function ScaleSpacer({ scale }: { scale: number }) {
  const [h, setH] = useState(0);
  useEffect(() => {
    const measure = () => {
      const inner = document.querySelector("[data-pages-root]") as HTMLElement | null;
      if (inner) setH(inner.scrollHeight * scale);
    };
    measure();
    const t = window.setInterval(measure, 400);
    return () => window.clearInterval(t);
  }, [scale]);
  return <div style={{ height: h }} />;
}

export function A4Page({
  children,
  innerRef,
}: {
  children: ReactNode;
  innerRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={innerRef}
      className="ltc-page shadow-[0_2px_28px_rgba(0,0,0,0.10)]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {children}
    </div>
  );
}

export function PageFooter({ right }: { right?: string }) {
  return (
    <div className="mt-auto pt-8">
      <hr className="ltc-rule mb-3" />
      <div className="flex items-baseline justify-between">
        <span className="ltc-meta">Living the Charge</span>
        <span className="ltc-meta">{right ?? "livingthecharge.org"}</span>
      </div>
    </div>
  );
}
