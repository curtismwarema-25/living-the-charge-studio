import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { BriefPreview } from "./BriefPreview";
import { EditorSection, Field, StudioButton, TextArea, TextInput } from "./Fields";
import { NewsletterPreview } from "./NewsletterPreview";
import { PagesViewport } from "./Workspace";
import { ImageUploader } from "./ImageUploader";
import { StoryBlockEditor } from "./StoryBlockEditor";
import { sampleBrief, sampleNewsletter, templateBlocks } from "@/lib/ltc/samples";
import { exportPagesToPdf } from "@/lib/ltc/pdf";
import { clearBrief, clearNewsletter, loadBrief, loadNewsletter, saveBrief, saveNewsletter } from "@/lib/ltc/storage";
import type { Brief, Newsletter, StoryBlock, StoryBlockKind } from "@/lib/ltc/types";

type Kind = "brief" | "newsletter";

export function Studio({ kind }: { kind: Kind }) {
  const isBrief = kind === "brief";
  const [brief, setBrief] = useState<Brief>(() => loadBrief() ?? sampleBrief());
  const [newsletter, setNewsletter] = useState<Newsletter>(() => loadNewsletter() ?? sampleNewsletter());
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const pageRefs = useRef<HTMLElement[]>([]);
  const navigate = useNavigate();
  const doc = isBrief ? brief : newsletter;
  const warnings = useMemo(() => {
    const values = isBrief
      ? [brief.title, brief.introduction, ...brief.sections.map((s) => s.content)]
      : [newsletter.title, newsletter.introduction, newsletter.closingMessage];
    const result: string[] = [];
    if (!doc.title.trim()) result.push("Add a title before exporting.");
    if (isBrief && values.join(" ").length > 2600) result.push("This brief may be too long for a balanced one-page layout.");
    if (!isBrief && !newsletter.closingMessage.trim()) result.push("Add a closing message to complete the newsletter.");
    return result;
  }, [brief, doc.title, isBrief, newsletter]);

  useEffect(() => {
    pageRefs.current = [];
  }, [doc]);

  function updateBrief(next: Brief) { setBrief({ ...next, updatedAt: new Date().toISOString() }); }
  function updateNewsletter(next: Newsletter) { setNewsletter({ ...next, updatedAt: new Date().toISOString() }); }
  function save() {
    if (isBrief) saveBrief(brief); else saveNewsletter(newsletter);
    setSaved(true); window.setTimeout(() => setSaved(false), 1800);
  }
  function clear() {
    if (isBrief) { clearBrief(); setBrief(sampleBrief()); } else { clearNewsletter(); setNewsletter(sampleNewsletter()); }
  }
  async function download() {
    if (!pageRefs.current.length) return;
    setExporting(true);
    try { await exportPagesToPdf(pageRefs.current, isBrief ? `LTC_Brief_${brief.title}` : `LTC_Newsletter_${newsletter.date}`); }
    finally { setExporting(false); }
  }

  return <div className="min-h-screen bg-ltc-workspace">
    <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><Link to="/" className="ltc-meta hover:text-ltc-text">← Documents</Link><h1 className="ltc-display mt-3 text-[34px]">{isBrief ? "One-page brief" : "Newsletter"}</h1><p className="mt-2 text-sm text-ltc-muted">Write, arrange, preview and export.</p></div>
        <div className="flex flex-wrap gap-2"><StudioButton variant="ghost" onClick={clear}>Clear draft</StudioButton><StudioButton onClick={save}>{saved ? "Saved" : "Save draft"}</StudioButton><StudioButton variant="solid" onClick={() => void download()} disabled={exporting || warnings.length > 0}>{exporting ? "Preparing PDF…" : "Download PDF"}</StudioButton></div>
      </div>
      {warnings.length > 0 && <div className="mb-6 border-l-2 border-ltc-accent bg-ltc-accent-soft px-4 py-3 text-sm text-ltc-text">{warnings.map((w) => <p key={w}>{w}</p>)}</div>}
      <div className="grid items-start gap-10 xl:grid-cols-[minmax(360px,520px)_1fr]">
        <div className="space-y-8 bg-ltc-background p-6 lg:p-8">
          {isBrief ? <BriefForm value={brief} onChange={updateBrief} /> : <NewsletterForm value={newsletter} onChange={updateNewsletter} />}
          <p className="ltc-caption">Drafts are stored locally in this browser. Nothing is uploaded.</p>
        </div>
        <div className="min-w-0"><div className="mb-3 flex items-center justify-between"><span className="ltc-meta">Live preview</span><span className="ltc-caption">A4 portrait</span></div><PagesViewport>{isBrief ? <BriefPreview brief={brief} pageRef={(el) => { if (el) pageRefs.current[0] = el; }} /> : <NewsletterPreview newsletter={newsletter} pageRefs={(el, i) => { if (el) pageRefs.current[i] = el; }} />}</PagesViewport></div>
      </div>
    </div>
  </div>;
}

function BriefForm({ value: b, onChange }: { value: Brief; onChange: (b: Brief) => void }) {
  const set = <K extends keyof Brief>(key: K, val: Brief[K]) => onChange({ ...b, [key]: val });
  return <>
    <EditorSection step="01" title="Document information"><Field label="Eyebrow / category"><TextInput value={b.category} onChange={(v) => set("category", v)} /></Field><Field label="Title"><TextInput value={b.title} onChange={(v) => set("title", v)} /></Field><Field label="Subtitle"><TextInput value={b.subtitle} onChange={(v) => set("subtitle", v)} /></Field></EditorSection>
    <EditorSection step="02" title="Introduction"><Field label="Introductory paragraph"><TextArea value={b.introduction} onChange={(v) => set("introduction", v)} rows={5} /></Field></EditorSection>
    <EditorSection step="03" title="Sections">{b.sections.map((s, i) => <div key={s.id} className="space-y-4"><Field label={`Section ${String(i + 1).padStart(2, "0")} title`}><TextInput value={s.title} onChange={(v) => set("sections", b.sections.map((x) => x.id === s.id ? { ...x, title: v } : x))} /></Field><Field label="Section content"><TextArea value={s.content} onChange={(v) => set("sections", b.sections.map((x) => x.id === s.id ? { ...x, content: v } : x))} rows={5} /></Field></div>)}</EditorSection>
    <EditorSection step="04" title="Next step"><Field label="Label"><TextInput value={b.nextStepTitle} onChange={(v) => set("nextStepTitle", v)} /></Field><Field label="Supporting text"><TextArea value={b.nextStep} onChange={(v) => set("nextStep", v)} rows={4} /></Field></EditorSection>
    <EditorSection step="05" title="Event / reference information"><div className="grid gap-4 sm:grid-cols-2">{(["date", "time", "location", "website", "contact", "registration"] as const).map((key) => <Field key={key} label={key}><TextInput value={b.meta[key] ?? ""} onChange={(v) => onChange({ ...b, meta: { ...b.meta, [key]: v } })} /></Field>)}</div></EditorSection>
  </>;
}

function NewsletterForm({ value: n, onChange }: { value: Newsletter; onChange: (n: Newsletter) => void }) {
  const set = <K extends keyof Newsletter>(key: K, val: Newsletter[K]) => onChange({ ...n, [key]: val });
  function replaceBlocks(blocks: StoryBlock[]) { set("blocks", blocks); }
  function createBlock(kind: StoryBlockKind): StoryBlock {
    const labels: Record<StoryBlockKind, string> = {
      text: "NEW STORY",
      imageText: "PHOTO + STORY",
      fullImage: "FULL-WIDTH PHOTO",
      quote: "FROM THE COMMUNITY",
      highlight: "BY THE NUMBERS",
    };
    const blocks: Record<StoryBlockKind, StoryBlock> = {
      text: { id: Math.random().toString(36).slice(2), kind: "text", label: labels.text, heading: "", body: "" },
      imageText: { id: Math.random().toString(36).slice(2), kind: "imageText", label: labels.imageText, heading: "", body: "", imagePosition: "right" },
      fullImage: { id: Math.random().toString(36).slice(2), kind: "fullImage", label: labels.fullImage, text: "" },
      quote: { id: Math.random().toString(36).slice(2), kind: "quote", label: labels.quote, quote: "", person: "", role: "" },
      highlight: { id: Math.random().toString(36).slice(2), kind: "highlight", label: labels.highlight, value: "", description: "" },
    };
    return blocks[kind];
  }
  function addBlock(kind: StoryBlockKind, afterIndex?: number) {
    const next = [...n.blocks];
    next.splice(afterIndex === undefined ? next.length : afterIndex + 1, 0, createBlock(kind));
    replaceBlocks(next);
  }
  function move(index: number, direction: -1 | 1) { const next = [...n.blocks]; const target = index + direction; [next[index], next[target]] = [next[target]!, next[index]!]; replaceBlocks(next); }
  return <>
    <EditorSection step="01" title="Newsletter header"><Field label="Issue / category"><TextInput value={n.issue} onChange={(v) => set("issue", v)} /></Field><Field label="Date"><TextInput value={n.date} onChange={(v) => set("date", v)} /></Field><Field label="Title"><TextInput value={n.title} onChange={(v) => set("title", v)} /></Field><Field label="Intro / lead"><TextArea value={n.introduction} onChange={(v) => set("introduction", v)} rows={5} /></Field><ImageUploader image={n.hero} onChange={(image) => set("hero", image)} showShape={false} /></EditorSection>
    <EditorSection step="02" title="Story blocks"><div className="space-y-5">{n.blocks.map((block, index) => <StoryBlockEditor key={block.id} block={block} index={index} total={n.blocks.length} onChange={(next) => replaceBlocks(n.blocks.map((x) => x.id === block.id ? next : x))} onMove={(dir) => move(index, dir)} onRemove={() => replaceBlocks(n.blocks.filter((x) => x.id !== block.id))} onAddAfter={(kind) => addBlock(kind, index)} />)}</div><div className="border-t border-ltc-line pt-5"><span className="field-label">Add an element</span><p className="ltc-caption mb-3">Each element becomes a flexible section you can edit, move or remove.</p><div className="flex flex-wrap gap-2"><StudioButton onClick={() => addBlock("text")}>Text story</StudioButton><StudioButton onClick={() => addBlock("imageText")}>Photo + text</StudioButton><StudioButton onClick={() => addBlock("fullImage")}>Full photo</StudioButton><StudioButton onClick={() => addBlock("quote")}>Quote</StudioButton><StudioButton onClick={() => addBlock("highlight")}>Highlight</StudioButton><StudioButton onClick={() => replaceBlocks(templateBlocks())}>Use previous template</StudioButton></div></div></EditorSection>
    <EditorSection step="03" title="Closing message"><Field label="Heading"><TextInput value={n.closingTitle} onChange={(v) => set("closingTitle", v)} /></Field><Field label="Closing message"><TextArea value={n.closingMessage} onChange={(v) => set("closingMessage", v)} rows={5} /></Field><Field label="Call to action"><TextArea value={n.callToAction} onChange={(v) => set("callToAction", v)} rows={3} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Website"><TextInput value={n.website} onChange={(v) => set("website", v)} /></Field><Field label="Socials"><TextInput value={n.socials} onChange={(v) => set("socials", v)} /></Field></div></EditorSection>
  </>;
}

export function Drafts() {
  const navigate = useNavigate(); const brief = loadBrief(); const newsletter = loadNewsletter();
  return <div className="mx-auto max-w-[900px] px-6 py-20"><Link to="/" className="ltc-meta">← Documents</Link><h1 className="ltc-display mt-5 text-[46px]">Drafts</h1><p className="mt-3 text-ltc-muted">Saved locally in this browser.</p><div className="mt-12 grid gap-px bg-ltc-line sm:grid-cols-2">{([brief && { label: "One-page brief", title: brief.title, to: "/brief" }, newsletter && { label: "Newsletter", title: newsletter.title, to: "/newsletter" }].filter(Boolean) as { label: string; title: string; to: "/brief" | "/newsletter" }[]).map((item) => <button key={item.to} className="bg-ltc-background p-7 text-left hover:bg-ltc-paper" onClick={() => void navigate({ to: item.to })}><span className="ltc-eyebrow">{item.label}</span><h2 className="ltc-display mt-3 text-2xl">{item.title}</h2><span className="ltc-caption mt-5 block">Open draft →</span></button>)}</div></div>;
}
