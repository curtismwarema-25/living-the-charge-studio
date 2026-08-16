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
import type { Brief, ImageAlign, ImageFit, Newsletter, StoryBlock, StoryBlockKind, TextColor } from "@/lib/ltc/types";

type Kind = "brief" | "newsletter";

export function Studio({ kind }: { kind: Kind }) {
  const isBrief = kind === "brief";
  const [brief, setBrief] = useState<Brief>(() => loadBrief() ?? sampleBrief());
  const [newsletter, setNewsletter] = useState<Newsletter>(() => loadNewsletter() ?? sampleNewsletter());
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const pageRefs = useRef<HTMLElement[]>([]);
  const hasMounted = useRef(false);
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

  useEffect(() => {
    // Let the initial sample/loaded draft render without rewriting localStorage.
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (isBrief) saveBrief(brief); else saveNewsletter(newsletter);
    setSaved(true);
    const timeout = window.setTimeout(() => setSaved(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [brief, isBrief, newsletter]);

  function updateBrief(next: Brief) { setBrief({ ...next, updatedAt: new Date().toISOString() }); }
  function updateNewsletter(next: Newsletter) { setNewsletter({ ...next, updatedAt: new Date().toISOString() }); }
  function save() {
    if (isBrief) saveBrief(brief); else saveNewsletter(newsletter);
    setSaved(true); window.setTimeout(() => setSaved(false), 1800);
  }
  function clear() {
    if (isBrief) { clearBrief(); setBrief(sampleBrief()); } else { clearNewsletter(); setNewsletter(sampleNewsletter()); }
  }
  function updateSelectedBlock(update: (block: StoryBlock) => StoryBlock) {
    if (selectedBlockIndex === null) return;
    updateNewsletter({
      ...newsletter,
      blocks: newsletter.blocks.map((block, index) => index === selectedBlockIndex ? update(block) : block),
    });
  }
  async function download() {
    if (!pageRefs.current.length) return;
    setExporting(true);
    try { await exportPagesToPdf(pageRefs.current, isBrief ? `LTC_Brief_${brief.title}` : `LTC_Newsletter_${newsletter.date}`); }
    finally { setExporting(false); }
  }

  return <div className="min-h-screen bg-ltc-workspace">
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-5 sm:py-8 lg:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><Link to="/" className="ltc-meta hover:text-ltc-text">← Documents</Link><h1 className="ltc-display mt-3 text-[30px] sm:text-[34px]">{isBrief ? "One-page brief" : "Newsletter"}</h1><p className="mt-2 text-sm text-ltc-muted">Write, arrange, preview and export.</p></div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto"><StudioButton variant="ghost" onClick={clear}>Clear draft</StudioButton><StudioButton onClick={save}>{saved ? "Saved" : "Save draft"}</StudioButton><span className="col-span-2 sm:col-span-1"><StudioButton variant="solid" onClick={() => void download()} disabled={exporting || warnings.length > 0}>{exporting ? "Preparing PDF…" : "Download PDF"}</StudioButton></span></div>
      </div>
      {warnings.length > 0 && <div className="mb-6 border-l-2 border-ltc-accent bg-ltc-accent-soft px-4 py-3 text-sm text-ltc-text">{warnings.map((w) => <p key={w}>{w}</p>)}</div>}
      {!isBrief ? <FormattingBar block={selectedBlockIndex === null ? undefined : newsletter.blocks[selectedBlockIndex]} onChange={updateSelectedBlock} onMove={(direction) => { if (selectedBlockIndex !== null) { moveNewsletterBlock(newsletter, selectedBlockIndex, direction, updateNewsletter); setSelectedBlockIndex(selectedBlockIndex + direction); } }} /> : null}
      <div className="grid items-start gap-6 sm:gap-10 xl:grid-cols-[minmax(360px,520px)_1fr]">
        <div className="space-y-8 bg-ltc-background p-4 sm:p-6 lg:p-8">
          {isBrief ? <BriefForm value={brief} onChange={updateBrief} /> : <NewsletterForm value={newsletter} onChange={updateNewsletter} selectedBlockIndex={selectedBlockIndex} onSelectBlock={setSelectedBlockIndex} />}
          <p className="ltc-caption">Drafts are stored locally in this browser. Nothing is uploaded.</p>
        </div>
        <div className="min-w-0"><div className="mb-3 flex items-center justify-between"><span className="ltc-meta">Live preview</span><span className="ltc-caption">A4 portrait</span></div><PagesViewport>{isBrief ? <BriefPreview brief={brief} pageRef={(el) => { if (el) pageRefs.current[0] = el; }} /> : <NewsletterPreview newsletter={newsletter} pageRefs={(el, i) => { if (el) pageRefs.current[i] = el; }} />}</PagesViewport></div>
      </div>
    </div>
  </div>;
}

function moveNewsletterBlock(n: Newsletter, index: number, direction: -1 | 1, onChange: (n: Newsletter) => void) {
  const target = index + direction;
  if (target < 0 || target >= n.blocks.length) return;
  const blocks = [...n.blocks];
  [blocks[index], blocks[target]] = [blocks[target]!, blocks[index]!];
  onChange({ ...n, blocks });
}

function FormattingBar({ block, onChange, onMove }: { block?: StoryBlock | undefined; onChange: (update: (block: StoryBlock) => StoryBlock) => void; onMove: (direction: -1 | 1) => void }) {
  const image = block && "image" in block ? block.image : undefined;
  const updateImage = (update: Partial<NonNullable<typeof image>>) => onChange((current) => "image" in current && current.image ? { ...current, image: { ...current.image, ...update } } : current);
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 border border-ltc-line bg-ltc-background px-3 py-2">
      <span className="ltc-meta mr-2">Format</span>
      <select aria-label="Text color" value={block?.color ?? "default"} onChange={(event) => onChange((current) => ({ ...current, color: event.target.value as TextColor }))} className="field-input w-auto py-1.5 text-[12px]">
        <option value="default">Text color</option><option value="accent">Cobalt accent</option><option value="muted">Muted</option>
      </select>
      <select aria-label="Image fit" value={image?.fit ?? "contain"} disabled={!image} onChange={(event) => updateImage({ fit: event.target.value as ImageFit })} className="field-input w-auto py-1.5 text-[12px]">
        <option value="contain">Image: contain</option><option value="cover">Image: cover</option>
      </select>
      <select aria-label="Image alignment" value={image?.align ?? "center"} disabled={!image} onChange={(event) => updateImage({ align: event.target.value as ImageAlign })} className="field-input w-auto py-1.5 text-[12px]">
        <option value="left">Image: left</option><option value="center">Image: center</option><option value="right">Image: right</option>
      </select>
      <button type="button" disabled={!block} onClick={() => onMove(-1)} className="border border-ltc-line px-3 py-1.5 text-[12px] disabled:opacity-40">Move up</button>
      <button type="button" disabled={!block} onClick={() => onMove(1)} className="border border-ltc-line px-3 py-1.5 text-[12px] disabled:opacity-40">Move down</button>
      {!block ? <span className="ltc-caption ml-1">Select a story block to edit it.</span> : null}
    </div>
  );
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

function NewsletterForm({ value: n, onChange, selectedBlockIndex, onSelectBlock }: { value: Newsletter; onChange: (n: Newsletter) => void; selectedBlockIndex: number | null; onSelectBlock: (index: number) => void }) {
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [draggedBlockKind, setDraggedBlockKind] = useState<StoryBlockKind | null>(null);
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
  function moveTo(from: number, to: number) {
    const next = [...n.blocks];
    const [item] = next.splice(from, 1);
    if (item) next.splice(to, 0, item);
    replaceBlocks(next);
  }
  function dropAt(index: number) {
    if (draggedBlockKind) {
      const next = [...n.blocks];
      next.splice(index, 0, createBlock(draggedBlockKind));
      replaceBlocks(next);
    } else if (draggedBlockIndex !== null) {
      moveTo(draggedBlockIndex, index);
    }
    setDraggedBlockIndex(null);
    setDraggedBlockKind(null);
  }
  function addButton(kind: StoryBlockKind, label: string) {
    return <span draggable onDragStart={() => { setDraggedBlockKind(kind); setDraggedBlockIndex(null); }} onDragEnd={() => { setDraggedBlockKind(null); setDraggedBlockIndex(null); }}><StudioButton onClick={() => addBlock(kind)}>{label}</StudioButton></span>;
  }
  return <>
    <EditorSection step="01" title="Newsletter header"><Field label="Issue / category"><TextInput value={n.issue} onChange={(v) => set("issue", v)} /></Field><Field label="Date"><TextInput value={n.date} onChange={(v) => set("date", v)} /></Field><Field label="Title"><TextInput value={n.title} onChange={(v) => set("title", v)} /></Field><Field label="Intro / lead"><TextArea value={n.introduction} onChange={(v) => set("introduction", v)} rows={5} /></Field><Field label="Table of contents color"><select value={n.tocColor ?? "accent"} onChange={(e) => set("tocColor", e.target.value as TextColor)} className="field-input py-1.5 text-[12px]"><option value="accent">Automatic cobalt accent</option><option value="default">Default text</option><option value="muted">Muted</option></select></Field><ImageUploader image={n.hero} onChange={(image) => set("hero", image)} showShape={false} /></EditorSection>
    <EditorSection step="02" title="Story blocks"><div className="space-y-2"><div className="h-3 border border-dashed border-transparent transition-colors hover:border-ltc-accent" onDragOver={(event) => event.preventDefault()} onDrop={() => dropAt(0)} aria-label="Drop element at start" />{n.blocks.map((block, index) => <div key={block.id}><StoryBlockEditor block={block} index={index} total={n.blocks.length} selected={selectedBlockIndex === index} onSelect={() => onSelectBlock(index)} onChange={(next) => replaceBlocks(n.blocks.map((x) => x.id === block.id ? next : x))} onMove={(dir) => move(index, dir)} onRemove={() => replaceBlocks(n.blocks.filter((x) => x.id !== block.id))} onAddAfter={(kind) => addBlock(kind, index)} onDragStart={() => { setDraggedBlockIndex(index); setDraggedBlockKind(null); }} onDrop={() => dropAt(index)} /><div className="h-3 border border-dashed border-transparent transition-colors hover:border-ltc-accent" onDragOver={(event) => event.preventDefault()} onDrop={() => dropAt(index + 1)} aria-label={`Drop element after section ${index + 1}`} /></div>)}</div><div className="border-t border-ltc-line pt-5"><span className="field-label">Add an element</span><p className="ltc-caption mb-3">Drag an element into a dashed gap to place it precisely.</p><div className="flex flex-wrap gap-2">{addButton("text", "Text story")}{addButton("imageText", "Photo + text")}{addButton("fullImage", "Full photo")}{addButton("quote", "Quote")}{addButton("highlight", "Highlight")}<StudioButton onClick={() => replaceBlocks(templateBlocks())}>Use previous template</StudioButton></div></div></EditorSection>
    <EditorSection step="03" title="Closing message"><Field label="Heading"><TextInput value={n.closingTitle} onChange={(v) => set("closingTitle", v)} /></Field><Field label="Closing message"><TextArea value={n.closingMessage} onChange={(v) => set("closingMessage", v)} rows={5} /></Field><Field label="Call to action"><TextArea value={n.callToAction} onChange={(v) => set("callToAction", v)} rows={3} /></Field><div className="mt-6 border-t border-ltc-line pt-5"><span className="field-label">Who we are & donation banner</span><div className="mt-3 space-y-4"><Field label="Profile heading"><TextInput value={n.profileTitle ?? "WHO WE ARE"} onChange={(v) => set("profileTitle", v)} /></Field><Field label="Profile text"><TextArea value={n.profileText ?? ""} onChange={(v) => set("profileText", v)} rows={3} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Button label"><TextInput value={n.donateLabel ?? "Support the work"} onChange={(v) => set("donateLabel", v)} /></Field><Field label="Donation page URL"><TextInput value={n.donateUrl ?? "https://livingthecharge.org/fundraising-campaign/"} onChange={(v) => set("donateUrl", v)} /></Field></div></div></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Website"><TextInput value={n.website} onChange={(v) => set("website", v)} /></Field><Field label="Socials"><TextInput value={n.socials} onChange={(v) => set("socials", v)} /></Field></div></EditorSection>
  </>;
}

export function Drafts() {
  const navigate = useNavigate(); const brief = loadBrief(); const newsletter = loadNewsletter();
  return <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6 sm:py-20"><Link to="/" className="ltc-meta">← Documents</Link><h1 className="ltc-display mt-5 text-[38px] sm:text-[46px]">Drafts</h1><p className="mt-3 text-ltc-muted">Saved locally in this browser.</p><div className="mt-10 grid gap-px bg-ltc-line sm:mt-12 sm:grid-cols-2">{([brief && { label: "One-page brief", title: brief.title, to: "/brief" }, newsletter && { label: "Newsletter", title: newsletter.title, to: "/newsletter" }].filter(Boolean) as { label: string; title: string; to: "/brief" | "/newsletter" }[]).map((item) => <button key={item.to} className="bg-ltc-background p-6 text-left hover:bg-ltc-paper sm:p-7" onClick={() => void navigate({ to: item.to })}><span className="ltc-eyebrow">{item.label}</span><h2 className="ltc-display mt-3 text-2xl">{item.title}</h2><span className="ltc-caption mt-5 block">Open draft →</span></button>)}</div></div>;
}
