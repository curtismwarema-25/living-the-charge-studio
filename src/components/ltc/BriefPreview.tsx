import type { Brief } from "@/lib/ltc/types";
import { A4Page, PageFooter } from "./Workspace";

export function BriefPreview({
  brief,
  pageRef,
}: {
  brief: Brief;
  pageRef?: (el: HTMLDivElement | null) => void;
}) {
  const meta = Object.entries({
    Date: brief.meta.date,
    Time: brief.meta.time,
    Location: brief.meta.location,
    Website: brief.meta.website,
    Contact: brief.meta.contact,
    Register: brief.meta.registration,
  }).filter(([, v]) => v && v.trim().length > 0) as [string, string][];

  return (
    <A4Page {...(pageRef ? { innerRef: pageRef } : {})}>
      <header>
        <div className="flex items-baseline justify-between">
          <span className="ltc-display text-[15px]">Living the Charge</span>
          <span className="ltc-eyebrow">{brief.category || "BRIEF"}</span>
        </div>
        <h1 className="ltc-display mt-10 text-[42px]">{brief.title || "Untitled brief"}</h1>
        {brief.subtitle ? (
          <p className="mt-4 max-w-[80%] text-[15px] leading-snug text-ltc-muted">
            {brief.subtitle}
          </p>
        ) : null}
        <hr className="ltc-rule mt-8" />
      </header>

      {brief.introduction ? (
        <p className="ltc-body-text mt-8 text-[13.5px] leading-[1.75] first-letter:float-left first-letter:mr-2 first-letter:font-[Fraunces] first-letter:text-[42px] first-letter:leading-[0.9]">
          {brief.introduction}
        </p>
      ) : null}

      <div className="mt-10 grid grid-cols-3 gap-x-8">
        {brief.sections.map((s, i) => (
          <article key={s.id}>
            <div className="ltc-display text-[26px] text-ltc-accent">
              {String(i + 1).padStart(2, "0")}
            </div>
            <hr className="ltc-rule my-3" />
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em]">{s.title}</h3>
            <p className="ltc-body-text mt-3 whitespace-pre-line text-[11.5px]">{s.content}</p>
          </article>
        ))}
      </div>

      {brief.nextStep ? (
        <section className="mt-10 border-l-2 border-ltc-accent bg-ltc-accent-soft/60 px-6 py-5">
          <span className="ltc-eyebrow">{brief.nextStepTitle || "NEXT STEP"}</span>
          <p className="ltc-body-text mt-2 whitespace-pre-line text-[13px]">{brief.nextStep}</p>
        </section>
      ) : null}

      {meta.length > 0 ? (
        <section className="mt-8">
          <hr className="ltc-rule mb-4" />
          <dl className="grid grid-cols-3 gap-y-4">
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt className="ltc-meta">{k}</dt>
                <dd className="mt-1 text-[12px]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <PageFooter />
    </A4Page>
  );
}
