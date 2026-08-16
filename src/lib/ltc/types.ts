export type DocumentType = "brief" | "newsletter";

export interface BriefSection {
  id: string;
  title: string;
  content: string;
  color?: TextColor | undefined;
  spacing?: "compact" | "comfortable" | undefined;
}

export interface BriefMeta {
  date?: string | undefined;
  time?: string | undefined;
  location?: string | undefined;
  website?: string | undefined;
  contact?: string | undefined;
  registration?: string | undefined;
}

export interface Brief {
  id: string;
  type: "brief";
  category: string;
  title: string;
  subtitle: string;
  introduction: string;
  sections: BriefSection[];
  nextStepTitle: string;
  nextStep: string;
  meta: BriefMeta;
  createdAt: string;
  updatedAt: string;
}

export type ImageFit = "cover" | "contain";
export type ImageShape = "portrait" | "landscape" | "square";
export type ImageAlign = "left" | "center" | "right";
export type TextColor = "default" | "accent" | "muted";

export interface DocImage {
  dataUrl: string;
  fit: ImageFit;
  shape: ImageShape;
  align?: ImageAlign | undefined;
  caption?: string | undefined;
}

interface BlockBase {
  id: string;
  label: string;
  color?: TextColor | undefined;
}

export interface TextBlock extends BlockBase {
  kind: "text";
  heading: string;
  body: string;
  image?: DocImage | undefined;
  imagePosition?: "left" | "right" | undefined;
  quote?: string | undefined;
  quoteAuthor?: string | undefined;
}

export interface ImageTextBlock extends BlockBase {
  kind: "imageText";
  heading: string;
  body: string;
  image?: DocImage | undefined;
  imagePosition: "left" | "right";
}

export interface FullImageBlock extends BlockBase {
  kind: "fullImage";
  image?: DocImage | undefined;
  text?: string | undefined;
}

export interface QuoteBlock extends BlockBase {
  kind: "quote";
  quote: string;
  person: string;
  role: string;
}

export interface HighlightBlock extends BlockBase {
  kind: "highlight";
  value: string;
  description: string;
}

export type StoryBlock =
  | TextBlock
  | ImageTextBlock
  | FullImageBlock
  | QuoteBlock
  | HighlightBlock;

export type StoryBlockKind = StoryBlock["kind"];

export interface Newsletter {
  id: string;
  type: "newsletter";
  issue: string;
  date: string;
  title: string;
  introduction: string;
  tocColor?: TextColor | undefined;
  hero?: DocImage | undefined;
  blocks: StoryBlock[];
  closingTitle: string;
  closingMessage: string;
  callToAction: string;
  profileTitle?: string | undefined;
  profileText?: string | undefined;
  donateLabel?: string | undefined;
  donateUrl?: string | undefined;
  website: string;
  socials: string;
  createdAt: string;
  updatedAt: string;
}

export type LTCDocument = Brief | Newsletter;

export const uid = () => Math.random().toString(36).slice(2, 10);
