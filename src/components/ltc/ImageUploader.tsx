import { useRef, useState } from "react";
import type { DocImage, ImageFit, ImageShape } from "@/lib/ltc/types";
import { readAndOptimizeImage } from "@/lib/ltc/pdf";

const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";

export function ImageUploader({
  image,
  onChange,
  showShape = true,
}: {
  image?: DocImage | undefined;
  onChange: (img: DocImage | undefined) => void;
  showShape?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [warning, setWarning] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (!ACCEPT.includes(file.type)) {
      setWarning("Use a JPG, PNG or WebP image.");
      return;
    }
    setWarning(file.size > 6_000_000 ? "Large image — optimised for the document." : null);
    const dataUrl = await readAndOptimizeImage(file);
    onChange({
      dataUrl,
      fit: image?.fit ?? "cover",
      shape: image?.shape ?? "landscape",
      caption: image?.caption ?? "",
    });
  }

  return (
    <div className="space-y-3">
      <span className="field-label">Photograph</span>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handleFiles(e.dataTransfer.files);
        }}
        className="flex items-center gap-4 border border-dashed border-ltc-line p-3"
      >
        {image?.dataUrl ? (
          <img
            src={image.dataUrl}
            alt="Selected"
            className="h-20 w-28 object-cover"
            style={{ objectFit: image.fit }}
          />
        ) : (
          <div className="flex h-20 w-28 items-center justify-center bg-ltc-workspace">
            <span className="ltc-caption">No image</span>
          </div>
        )}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="border border-ltc-line px-3 py-1.5 text-[12px] hover:border-ltc-text"
          >
            {image ? "Replace" : "Upload image"}
          </button>
          {image ? (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-[12px] text-ltc-muted hover:text-ltc-text"
            >
              Remove
            </button>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </div>
      </div>

      {image ? (
        <div className="flex flex-wrap gap-6">
          <Choice
            label="Fit"
            value={image.fit}
            options={["cover", "contain"] as ImageFit[]}
            onChange={(v) => onChange({ ...image, fit: v })}
          />
          {showShape ? (
            <Choice
              label="Shape"
              value={image.shape}
              options={["landscape", "portrait", "square"] as ImageShape[]}
              onChange={(v) => onChange({ ...image, shape: v })}
            />
          ) : null}
          <label className="min-w-[220px] flex-1">
            <span className="field-label">Caption</span>
            <input
              className="field-input"
              value={image.caption ?? ""}
              onChange={(e) => onChange({ ...image, caption: e.target.value })}
              placeholder="Optional caption"
            />
          </label>
        </div>
      ) : null}

      {warning ? <p className="ltc-caption text-ltc-accent">{warning}</p> : null}
    </div>
  );
}

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex border border-ltc-line">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 text-[12px] capitalize ${
              value === opt ? "bg-ltc-text text-ltc-paper" : "text-ltc-muted hover:text-ltc-text"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
