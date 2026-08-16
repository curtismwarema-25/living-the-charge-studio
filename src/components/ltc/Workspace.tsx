import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Scales the fixed 794px A4 pages down to fit the preview column. */
export function PagesViewport({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useIso(() => {
    const wrapEl = wrap.current;
    const innerEl = inner.current;
    if (!wrapEl || !innerEl) return;
    const update = () => {
      const s = Math.min(1, (wrapEl.clientWidth - 8) / 794);
      setScale(s);
      setHeight(innerEl.scrollHeight * s);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrapEl);
    ro.observe(innerEl);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div ref={wrap} className="w-full" style={{ height }}>
      <div
        ref={inner}
        className="flex w-[794px] flex-col items-center gap-8"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}

export function A4Page({
  children,
  innerRef,
}: {
  children: ReactNode;
  innerRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={innerRef} className="ltc-page shadow-[0_2px_28px_rgba(0,0,0,0.10)]">
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
