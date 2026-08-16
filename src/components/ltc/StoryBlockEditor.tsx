import type { StoryBlock, StoryBlockKind } from "@/lib/ltc/types";
import { Field, TextArea, TextInput } from "./Fields";
import { ImageUploader } from "./ImageUploader";

export function StoryBlockEditor({
  block,
  index,
  total,
  onChange,
  onMove,
  onRemove,
  onAddAfter,
  onDragStart,
  onDrop,
  selected,
  onSelect,
}: {
  block: StoryBlock;
  index: number;
  total: number;
  onChange: (b: StoryBlock) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  onAddAfter: (kind: StoryBlockKind) => void;
  onDragStart?: () => void;
  onDrop?: () => void;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const kindLabel = {
    text: "Text story",
    imageText: "Photo + text",
    fullImage: "Full-width photo",
    quote: "Quote",
    highlight: "Highlight",
  }[block.kind];

  return (
    <div
      className={`border p-5 ${selected ? "border-ltc-accent" : "border-ltc-line"}`}
      draggable
      onClick={onSelect}
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="ltc-display text-[16px] text-ltc-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="ltc-meta">{kindLabel}</span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect?.();
          }}
          className={`border px-2 py-1 text-[11px] ${selected ? "border-ltc-accent bg-ltc-accent-soft text-ltc-accent" : "border-ltc-line text-ltc-muted hover:border-ltc-text"}`}
        >
          {selected ? "Selected" : "Select"}
        </button>
        <div className="ml-auto flex items-center gap-1">
          <IconBtn label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            ↑
          </IconBtn>
          <IconBtn label="Move down" disabled={index === total - 1} onClick={() => onMove(1)}>
            ↓
          </IconBtn>
          <IconBtn label="Remove" onClick={onRemove}>
            ×
          </IconBtn>
        </div>
      </div>

      <div className="space-y-4">
        <Field label="Section label">
          <TextInput
            value={block.label}
            onChange={(v) => onChange({ ...block, label: v })}
            placeholder="THE STORY"
          />
        </Field>
        <label className="block">
          <span className="field-label">Text color</span>
          <select
            value={block.color ?? "default"}
            onChange={(event) => onChange({ ...block, color: event.target.value as typeof block.color })}
            className="field-input py-1.5 text-[12px]"
          >
            <option value="default">Default</option>
            <option value="accent">Cobalt accent</option>
            <option value="muted">Muted</option>
          </select>
        </label>

        {block.kind === "text" ? (
          <>
            <Field label="Heading">
              <TextInput
                value={block.heading}
                onChange={(v) => onChange({ ...block, heading: v })}
              />
            </Field>
            <Field label="Body text">
              <TextArea value={block.body} onChange={(v) => onChange({ ...block, body: v })} />
            </Field>
            <ImageUploader
              image={block.image}
              onChange={(img) => onChange({ ...block, image: img })}
            />
            {block.image ? (
              <div>
                <span className="field-label">Image position</span>
                <div className="flex border border-ltc-line">
                  {(["left", "right"] as const).map((position) => (
                    <button
                      key={position}
                      type="button"
                      onClick={() => onChange({ ...block, imagePosition: position })}
                      className={`px-3 py-1.5 text-[12px] capitalize ${
                        (block.imagePosition ?? "right") === position
                          ? "bg-ltc-text text-ltc-paper"
                          : "text-ltc-muted hover:text-ltc-text"
                      }`}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Quote (optional)">
                <TextInput
                  value={block.quote ?? ""}
                  onChange={(v) => onChange({ ...block, quote: v })}
                />
              </Field>
              <Field label="Quote author (optional)">
                <TextInput
                  value={block.quoteAuthor ?? ""}
                  onChange={(v) => onChange({ ...block, quoteAuthor: v })}
                />
              </Field>
            </div>
          </>
        ) : null}

        {block.kind === "imageText" ? (
          <>
            <Field label="Heading">
              <TextInput
                value={block.heading}
                onChange={(v) => onChange({ ...block, heading: v })}
              />
            </Field>
            <Field label="Body text">
              <TextArea value={block.body} onChange={(v) => onChange({ ...block, body: v })} />
            </Field>
            <ImageUploader
              image={block.image}
              onChange={(img) => onChange({ ...block, image: img })}
            />
            <div>
              <span className="field-label">Image position</span>
              <div className="flex border border-ltc-line">
                {(["left", "right"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onChange({ ...block, imagePosition: p })}
                    className={`px-3 py-1.5 text-[12px] capitalize ${
                      block.imagePosition === p
                        ? "bg-ltc-text text-ltc-paper"
                        : "text-ltc-muted hover:text-ltc-text"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {block.kind === "fullImage" ? (
          <>
            <ImageUploader
              image={block.image}
              onChange={(img) => onChange({ ...block, image: img })}
              showShape={false}
            />
            <Field label="Short text (optional)">
              <TextArea
                rows={3}
                value={block.text ?? ""}
                onChange={(v) => onChange({ ...block, text: v })}
              />
            </Field>
          </>
        ) : null}

        {block.kind === "quote" ? (
          <>
            <Field label="Quote">
              <TextArea rows={3} value={block.quote} onChange={(v) => onChange({ ...block, quote: v })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Person">
                <TextInput value={block.person} onChange={(v) => onChange({ ...block, person: v })} />
              </Field>
              <Field label="Role">
                <TextInput value={block.role} onChange={(v) => onChange({ ...block, role: v })} />
              </Field>
            </div>
          </>
        ) : null}

        {block.kind === "highlight" ? (
          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <Field label="Number">
              <TextInput value={block.value} onChange={(v) => onChange({ ...block, value: v })} />
            </Field>
            <Field label="Description">
              <TextInput
                value={block.description}
                onChange={(v) => onChange({ ...block, description: v })}
              />
            </Field>
          </div>
        ) : null}
      </div>
      <div className="mt-5 border-t border-ltc-line pt-4">
        <label className="flex items-center gap-2">
          <span className="ltc-caption whitespace-nowrap">Add section below</span>
          <select
            defaultValue=""
            aria-label={`Add a section below ${kindLabel}`}
            onChange={(event) => {
              const kind = event.target.value as StoryBlockKind;
              if (kind) {
                onAddAfter(kind);
                event.target.value = "";
              }
            }}
            className="field-input py-1.5 text-[12px]"
          >
            <option value="">Choose element…</option>
            <option value="text">Text story</option>
            <option value="imageText">Photo + text</option>
            <option value="fullImage">Full-width photo</option>
            <option value="quote">Quote</option>
            <option value="highlight">Highlight</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled ?? false}
      onClick={onClick}
      className="h-7 w-7 border border-ltc-line text-[13px] text-ltc-muted transition-colors hover:border-ltc-text hover:text-ltc-text disabled:opacity-30"
    >
      {children}
    </button>
  );
}
