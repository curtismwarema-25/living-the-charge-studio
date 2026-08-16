import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="ltc-caption mt-1.5 block">{hint}</span> : null}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className="field-input"
      value={value}
      placeholder={placeholder ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 5,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      className="field-input resize-y leading-relaxed"
      rows={rows}
      value={value}
      placeholder={placeholder ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function EditorSection({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-ltc-line pt-7">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="ltc-eyebrow">{step}</span>
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function StudioButton({
  onClick,
  children,
  variant = "ghost",
  disabled,
}: {
  onClick: () => void;
  children: ReactNode;
  variant?: "solid" | "ghost" | "quiet";
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2 text-[12.5px] font-medium tracking-wide transition-colors disabled:opacity-50";
  const styles = {
    solid: "bg-ltc-text text-ltc-paper hover:bg-ltc-accent",
    ghost: "border border-ltc-line text-ltc-text hover:border-ltc-text",
    quiet: "text-ltc-muted hover:text-ltc-text",
  }[variant];
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
