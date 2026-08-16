export function sanitizeFilename(input: string) {
  return (
    input
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 60) || "Untitled"
  );
}

/** Renders each A4 page element into a single multi-page PDF. */
export async function exportPagesToPdf(pages: HTMLElement[], filename: string) {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas-pro"),
  ]);

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = 210;
  const pageH = 297;

  for (let i = 0; i < pages.length; i++) {
    const el = pages[i]!;
    await Promise.all(
      Array.from(el.querySelectorAll<HTMLImageElement>("img")).map(async (image) => {
        if (image.complete) return;
        try {
          await image.decode();
        } catch {
          // html2canvas can still render a failed/unsupported image normally.
        }
      }),
    );
    const canvas = await html2canvas(el, {
      scale: 2,
      width: el.scrollWidth,
      height: el.scrollHeight,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
    const img = canvas.toDataURL("image/jpeg", 0.94);
    if (i > 0) pdf.addPage();
    pdf.addImage(img, "JPEG", 0, 0, pageW, pageH, undefined, "FAST");

    // html2canvas renders links into the page image, but images cannot be
    // clicked. Re-add each anchor as a native PDF link annotation.
    const pageRect = el.getBoundingClientRect();
    if (pageRect.width && pageRect.height) {
      for (const anchor of Array.from(el.querySelectorAll<HTMLAnchorElement>("a[href]"))) {
        const rect = anchor.getBoundingClientRect();
        const x = ((rect.left - pageRect.left) / pageRect.width) * pageW;
        const y = ((rect.top - pageRect.top) / pageRect.height) * pageH;
        const width = (rect.width / pageRect.width) * pageW;
        const height = (rect.height / pageRect.height) * pageH;
        if (width > 0 && height > 0) {
          pdf.link(x, y, width, height, { url: anchor.href });
        }
      }
    }
  }

  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

/** Downscale an uploaded image in the browser and return a data URL. */
export function readAndOptimizeImage(file: File, maxEdge = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const src = String(reader.result);
      const image = new Image();
      image.onerror = () => resolve(src);
      image.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
        if (scale === 1 && file.size < 700_000) return resolve(src);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(src);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      image.src = src;
    };
    reader.readAsDataURL(file);
  });
}
