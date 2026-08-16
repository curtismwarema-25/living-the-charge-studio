import type { DocImage, Newsletter, StoryBlock } from "@/lib/ltc/types";
import { A4Page, PageFooter } from "./Workspace";

const CONTENT_HEIGHT = 900; // usable px per continuation page

function shapeRatio(shape: DocImage["shape"]) {
  return shape === "portrait" ? "3 / 4" : shape === "square" ? "1 / 1" : "16 / 10";
}

function estimateHeight(b: StoryBlock): number {
  switch (b.kind) {
    case "text":
      return 90 + Math.ceil(b.body.length / 92) * 22 + (b.quote ? 110 : 0);
    case "imageText":
      return Math.max(300, 120 + Math.ceil(b.body.length / 55) * 22);
    case "fullImage":
      return 400 + (b.text ? 60 : 0);
    case "quote":
      return 210 + Math.ceil(b.quote.length / 60) * 20;
    case "highlight":
      return 190;
  }
}

function Figure({ image, ratio }: { image: DocImage; ratio?: string }) {
  return (
    <figure className="m-0">
      <div
        className="w-full overflow-hidden bg-ltc-workspace"
        style={{ aspectRatio: ratio ?? shapeRatio(image.shape) }}
      >
        <img
          src={image.dataUrl}
          alt={image.caption ?? ""}
          className="h-full w-full"
          style={{ objectFit: image.fit }}
        />
      </div>
      {image.caption ? <figcaption className="ltc-caption mt-2">{image.caption}</figcaption> : null}
    </figure>
  );
}

function BlockView({ block, index }: { block: StoryBlock; index: number }) {
  const num = String(index + 1).padStart(2, "0");

  const header = (
    <div className="mb-4 flex items-baseline gap-3">
      <span className="ltc-display text-[20px] text-ltc-accent">{num}</span>
      <span className="ltc-eyebrow">{block.label}</span>
      <span className="h-px flex-1 bg-ltc-line" />
    </div>
  );

  if (block.kind === "text") {
    return (
      <section>
        {header}
        <div className="grid grid-cols-12 gap-8">
          <h2 className="ltc-display col-span-5 text-[26px]">{block.heading}</h2>
          <div className="col-span-7">
            <p className="ltc-body-text whitespace-pre-line">{block.body}</p>
            {block.quote ? (
              <blockquote className="mt-5 border-l-2 border-ltc-accent pl-4">
                <p className="ltc-display text-[16px] leading-snug">“{block.quote}”</p>
                {block.quoteAuthor ? (
                  <cite className="ltc-meta mt-2 block not-italic">{block.quoteAuthor}</cite>
                ) : null}
              </blockquote>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (block.kind === "imageText") {
    const img = block.image ? <Figure image={block.image} /> : null;
    const text = (
      <div>
        <h2 className="ltc-display text-[24px]">{block.heading}</h2>
        <p className="ltc-body-text mt-3 whitespace-pre-line">{block.body}</p>
      </div>
    );
    return (
      <section>
        {header}
        <div className="grid grid-cols-12 items-start gap-8">
          {block.imagePosition === "left" ? (
            <>
              <div className="col-span-6">{img}</div>
              <div className="col-span-6">{text}</div>
            </>
          ) : (
            <>
              <div className="col-span-6">{text}</div>
              <div className="col-span-6">{img}</div>
            </>
          )}
        </div>
      </section>
    );
  }

  if (block.kind === "fullImage") {
    return (
      <section>
        {header}
        {block.image ? <Figure image={block.image} ratio="16 / 9" /> : null}
        {block.text ? <p className="ltc-body-text mt-4 max-w-[70%]">{block.text}</p> : null}
      </section>
    );
  }

  if (block.kind === "quote") {
    return (
      <section>
        {header}
        <blockquote className="border-y border-ltc-line py-8">
          <p className="ltc-display text-[28px] leading-[1.18]">“{block.quote}”</p>
          <cite className="ltc-meta mt-4 block not-italic">
            {block.person}
            {block.role ? ` — ${block.role}` : ""}
          </cite>
        </blockquote>
      </section>
    );
  }

  return (
    <section>
      {header}
      <div className="flex items-end gap-6 bg-ltc-accent-soft/60 px-7 py-6">
        <span className="ltc-display text-[58px] leading-none text-ltc-accent">{block.value}</span>
        <span className="ltc-body-text pb-2 text-[13px]">{block.description}</span>
      </div>
    </section>
  );
}

export function paginateBlocks(blocks: StoryBlock[]) {
  const pages: { block: StoryBlock; index: number }[][] = [];
  let current: { block: StoryBlock; index: number }[] = [];
  let used = 0;
  blocks.forEach((block, index) => {
    const h = estimateHeight(block);
    if (current.length && used + h > CONTENT_HEIGHT) {
      pages.push(current);
      current = [];
      used = 0;
    }
    current.push({ block, index });
    used += h + 44;
  });
  if (current.length) pages.push(current);
  return pages;
}

export function NewsletterPreview({
  newsletter: n,
  pageRefs,
}: {
  newsletter: Newsletter;
  pageRefs?: (el: HTMLDivElement | null, i: number) => void;
}) {
  const pages = paginateBlocks(n.blocks);
  let pageIndex = 0;
  const ref = (i: number) => (pageRefs ? { innerRef: (el: HTMLDivElement | null) => pageRefs(el, i) } : {});

  const cover = (
    <A4Page key="cover" {...ref(pageIndex++)}>
      <div className="flex items-baseline justify-between">
        <span className="ltc-display text-[15px]">Living the Charge</span>
        <span className="ltc-meta">{n.date}</span>
      </div>
      <hr className="ltc-rule mt-3" />
      <span className="ltc-eyebrow mt-12 block">{n.issue}</span>
      <h1 className="ltc-display mt-4 text-[52px]">{n.title || "Untitled newsletter"}</h1>
      <div className="mt-7 grid grid-cols-12 gap-8">
        <p className="ltc-body-text col-span-8 text-[13.5px]">{n.introduction}</p>
        <div className="col-span-4 border-l border-ltc-line pl-5">
          <span className="ltc-meta">In this issue</span>
          <ul className="mt-3 space-y-1.5">
            {n.blocks.slice(0, 6).map((b, i) => (
              <li key={b.id} className="ltc-caption">
                {String(i + 1).padStart(2, "0")} — {b.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {n.hero ? (
        <div className="mt-8">
          <Figure image={n.hero} ratio="16 / 9" />
        </div>
      ) : null}
      <PageFooter right={n.website} />
    </A4Page>
  );

  const storyPages = pages.map((items, i) => (
    <A4Page key={`p${i}`} {...ref(pageIndex++)}>
      <div className="flex items-baseline justify-between">
        <span className="ltc-meta">Living the Charge — {n.issue}</span>
        <span className="ltc-meta">{n.date}</span>
      </div>
      <hr className="ltc-rule mt-3 mb-9" />
      <div className="space-y-11">
        {items.map(({ block, index }) => (
          <BlockView key={block.id} block={block} index={index} />
        ))}
      </div>
      <PageFooter right={n.website} />
    </A4Page>
  ));

  const closing = (
    <A4Page key="closing" {...ref(pageIndex++)}>
      <div className="flex items-baseline justify-between">
        <span className="ltc-meta">Living the Charge — {n.issue}</span>
        <span className="ltc-meta">{n.date}</span>
      </div>
      <hr className="ltc-rule mt-3" />
      <div className="my-auto">
        <span className="ltc-eyebrow">{n.closingTitle || "CLOSING"}</span>
        <p className="ltc-display mt-5 max-w-[85%] text-[30px] leading-[1.15]">
          {n.closingMessage}
        </p>
        {n.callToAction ? (
          <p className="ltc-body-text mt-7 max-w-[70%] text-[14px]">{n.callToAction}</p>
        ) : null}
        <hr className="ltc-rule my-9" />
        <div className="grid grid-cols-3">
          <div>
            <span className="ltc-meta">Website</span>
            <p className="mt-1 text-[13px]">{n.website}</p>
          </div>
          <div>
            <span className="ltc-meta">Social</span>
            <p className="mt-1 text-[13px]">{n.socials}</p>
          </div>
          <div>
            <span className="ltc-meta">Publication</span>
            <p className="mt-1 text-[13px]">Living the Charge</p>
          </div>
        </div>
      </div>
      <PageFooter right={n.website} />
    </A4Page>
  );

  return (
    <>
      {cover}
      {storyPages}
      {closing}
    </>
  );
}
