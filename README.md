# Living the Charge Studio

A lightweight internal publishing tool for **Living the Charge** that makes it easy to create consistent, professional documents without requiring design expertise.

Living the Charge Studio provides reusable templates for creating **one-page briefs** and **editorial newsletters**, allowing team members to write content, upload photography, preview their documents, and export them as print-ready PDFs.

> **Content changes. Design does not.**

The goal is to give the Living the Charge team a consistent visual language across recurring communications while keeping the publishing process simple.

---

## Overview

Living the Charge is a growing organization whose work involves projects, partnerships, opportunities, community updates, fundraising, education, and storytelling.

As communications grow, repeatedly designing every document from scratch can introduce inconsistency and unnecessary work.

Living the Charge Studio addresses this by separating **content creation from visual design**.

Team members provide the content.

The system handles:

* Typography
* Spacing
* Layout
* Grid
* Branding
* Photography placement
* Page structure
* PDF formatting

The core workflow is:

**Choose → Write → Add Photos → Preview → Export**

---

## Features

### One-Page Briefs

Create concise, editorially structured documents for:

* Opportunities
* Partnerships
* Workshops
* Proposals
* Organizational initiatives
* Announcements
* Internal briefs

Briefs use a structured A4 layout with predefined sections, metadata, calls to action, and Living the Charge branding.

---

### Newsletters

Create recurring Living the Charge newsletters without redesigning each issue from scratch.

Newsletter content can include:

* Lead stories
* Text sections
* Photography
* Photo + text layouts
* Full-width images
* Quotes
* Statistics and highlights
* Community updates
* Closing messages

Content blocks can be reordered to create different stories while maintaining the same underlying design language.

---

### Photography

The newsletter system is designed around visual storytelling.

Supported image formats:

* JPG
* JPEG
* PNG
* WebP

Images maintain their aspect ratio and can be positioned using predefined layout options.

The application intentionally avoids image editing and filters. It is a publishing tool rather than a photo editor.

---

### Live Preview

The editor and document preview work side by side on desktop.

Users can see how their content will appear on the final A4 document before exporting.

On smaller screens, the editor appears first followed by the preview.

---

### PDF Export

Documents can be exported as high-quality A4 PDFs suitable for:

* WhatsApp
* Email
* Printing
* Internal sharing
* External communications

Generated filenames follow a consistent convention:

```text
LTC_Brief_[Title].pdf
LTC_Newsletter_[Date].pdf
```

---

### Reusable Templates

Newsletter structures are reusable.

Instead of rebuilding an issue from scratch, users can create a new newsletter from the existing template and replace the previous content.

This keeps recurring publications visually consistent over time.

---

### Draft Persistence

Drafts can be saved locally in the browser using `localStorage`.

No account or server is required.

Draft content remains within the user's browser and is not sent to a backend.

---

## Design Philosophy

Living the Charge Studio follows an **editorial publishing approach** rather than a traditional SaaS dashboard.

The visual language emphasizes:

* Clarity
* Humanity
* Optimism
* Credibility
* Education
* Community
* Long-term impact

The interface uses generous whitespace, strong typography, subtle borders, restrained controls, and large document previews.

The document design is inspired by the existing Living the Charge identity and website without attempting to reproduce the website directly.

Website:

https://livingthecharge.org/

---

## Design System

The application uses a restrained visual system built around:

* Warm/off-white backgrounds
* Near-black typography
* Muted secondary text
* Subtle dividers
* A restrained accent color
* Editorial typography
* Asymmetric layouts
* Generous margins
* A 12-column conceptual grid
* An 8px spacing system

The system is designed so that documents created months apart still feel like part of the same publication.

---

## Technology

Built with:

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**

PDF generation is handled entirely on the client side using browser-based rendering tools such as:

* `html2canvas`
* `jsPDF`

The application does not require:

* A backend
* A database
* Authentication
* User accounts
* External APIs

---

## Architecture

The application separates the **editing interface** from the **document rendering system**.

The same document model drives both the live preview and PDF output.

Core components include:

```text
AppShell
├── DocumentSelector
├── BriefEditor
├── NewsletterEditor
│   └── StoryBlockEditor
├── ImageUploader
├── DocumentPreview
│   ├── BriefPreview
│   └── NewsletterPreview
├── PageRenderer
├── ExportControls
└── DraftManager
```

This separation makes it possible to modify the editing experience without changing the underlying document rendering system.

---

## Document Model

The application uses TypeScript models to represent documents.

### Document

```text
id
type
title
createdAt
updatedAt
```

### Brief

```text
category
title
subtitle
introduction
sections
nextStep
metadata
```

### Newsletter

```text
issue
date
title
introduction
blocks
closingMessage
```

### Story Blocks

```text
text
imageText
fullImage
quote
highlight
```

The architecture is intentionally extensible so additional document types or content blocks can be introduced later.

---

## Project Structure

A typical project structure can follow:

```text
src/
├── components/
│   ├── AppShell
│   ├── DocumentSelector
│   ├── BriefEditor
│   ├── NewsletterEditor
│   ├── StoryBlockEditor
│   ├── ImageUploader
│   ├── DocumentPreview
│   ├── BriefPreview
│   ├── NewsletterPreview
│   ├── PageRenderer
│   ├── TypographyControls
│   ├── ExportControls
│   └── DraftManager
│
├── models/
│   └── documentTypes.ts
│
├── templates/
│   ├── briefTemplate.ts
│   └── newsletterTemplate.ts
│
├── utils/
│   ├── pdfExport.ts
│   ├── imageProcessing.ts
│   └── storage.ts
│
└── App.tsx
```

---

## Getting Started

### Prerequisites

You need:

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone <this-repository-url>
```

Navigate into the project:

```bash
cd <repository-name>
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local development URL provided by Vite.

---

## Development

The application is designed to work both locally and through Lovable.

Changes made through Lovable can be synchronized with the GitHub repository, allowing the project to continue being developed locally.

For local development:

```bash
npm run dev
```

For a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

## Usage

### Creating a Brief

1. Select **New Brief**
2. Enter the category
3. Add the title and subtitle
4. Write the introduction
5. Add the required sections
6. Add a call to action or next step
7. Add optional event or reference information
8. Preview the document
9. Export the PDF

---

### Creating a Newsletter

1. Select **New Newsletter**
2. Enter the issue and date
3. Add the newsletter title
4. Write the introduction
5. Add story blocks
6. Upload photographs
7. Reorder the content where necessary
8. Preview the newsletter
9. Export the final PDF

The design system automatically handles the visual presentation.

---

## Design Principle

The most important principle behind the project is:

> **The team should write the publication, not design the publication.**

The tool exists to remove repetitive design decisions from the publishing process.

A team member should be able to focus on:

**Writing → Photography → Storytelling**

while the system maintains:

**Brand → Typography → Layout → Spacing → Structure → Export**

---

## Scope

Living the Charge Studio is intentionally small.

It is not intended to become:

* A CMS
* A CRM
* A project management platform
* An email marketing platform
* A social media management platform
* A photo editor
* A collaborative publishing platform

Its purpose is focused:

> **Provide Living the Charge with a simple, repeatable system for producing consistent branded documents.**

---

## Future Possibilities

Potential future improvements include:

* Additional document templates
* More newsletter layouts
* Saved template variations
* Improved PDF pagination
* Additional image layout options
* Brand asset management
* Export presets for different platforms
* More advanced draft management

These should only be introduced where they improve the core publishing workflow without adding unnecessary complexity.

---

## Project Status

**Status:** Active development

The current focus is establishing the core document generation system, newsletter workflow, visual language, and reliable PDF export.

---

## Credits

Built for **Living the Charge**.

Developed as an internal publishing and communications tool.

Living the Charge:

https://livingthecharge.org/
