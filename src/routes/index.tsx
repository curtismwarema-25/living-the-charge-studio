import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/ltc/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Living the Charge — Document Studio" },
      {
        name: "description",
        content:
          "Create consistent, beautifully structured briefs and newsletters for the Living the Charge community, then export print-ready PDFs.",
      },
      { property: "og:title", content: "Living the Charge — Document Studio" },
      {
        property: "og:description",
        content:
          "An internal publishing tool for Living the Charge briefs and newsletters. Write, add photographs, preview and export A4 PDFs.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <main className="mx-auto max-w-[1100px] px-6 py-20 lg:px-10">
        <span className="ltc-eyebrow">Document Studio</span>
        <h1 className="ltc-display mt-5 max-w-[16ch] text-[clamp(40px,6vw,68px)]">
          Living the Charge
        </h1>
        <p className="mt-6 max-w-[52ch] text-[16px] leading-relaxed text-ltc-muted">
          Create consistent, beautifully structured documents for the Living the Charge community.
        </p>

        <hr className="ltc-rule mt-14" />

        <div className="grid gap-px bg-ltc-line sm:grid-cols-2">
          <Choice
            number="01"
            title="One-Page Brief"
            body="Create a concise, professional document for opportunities, partnerships, proposals and organizational updates."
            cta="Create Brief"
            to="/brief"
          />
          <Choice
            number="02"
            title="Newsletter"
            body="Create a branded newsletter using text and photography, laid out across as many pages as the story needs."
            cta="Create Newsletter"
            to="/newsletter"
          />
        </div>

        <p className="ltc-caption mt-10">
          Drafts are stored locally in this browser. Nothing is uploaded to a server.
        </p>
      </main>
    </AppShell>
  );
}

function Choice({
  number,
  title,
  body,
  cta,
  to,
}: {
  number: string;
  title: string;
  body: string;
  cta: string;
  to: string;
}) {
  return (
    <div className="flex flex-col bg-ltc-background p-10">
      <span className="ltc-display text-[22px] text-ltc-accent">{number}</span>
      <h2 className="ltc-display mt-5 text-[30px]">{title}</h2>
      <p className="mt-4 max-w-[38ch] text-[14px] leading-relaxed text-ltc-muted">{body}</p>
      <Link
        to={to}
        className="mt-10 inline-flex w-fit items-center bg-ltc-text px-5 py-2.5 text-[13px] font-medium text-ltc-paper transition-colors hover:bg-ltc-accent"
      >
        {cta}
      </Link>
    </div>
  );
}
