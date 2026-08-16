# Living the Charge Studio

Build a Simple Document Studio for Living the Charge

Create a polished, lightweight web application called Living the Charge Document Studio.

The application is an internal tool for creating two types of branded documents:

One-page opportunity proposals / briefs

Living the Charge newsletters

The purpose is to maintain a consistent visual identity across documents while allowing non-technical team members to enter text, upload photographs, preview the document, and export a finished PDF ready for WhatsApp, email, printing, or other forms of sharing.

This is not a general-purpose CMS and does not need a backend, authentication, database, user accounts, or complex content management.

Build it as a frontend-only application.

1. Core Product Concept

The application should behave like a small editorial document generator.

The user selects a document type:

A. One-Page Brief

Used for things such as:

partnerships

opportunities

workshops

proposals

organizational initiatives

important announcements

internal briefs

B. Newsletter

Used repeatedly by Living the Charge to communicate updates, stories, events, achievements, opportunities, and organizational news.

The user enters content into structured fields.

The application automatically places the content into a predefined Living the Charge layout.

The user can preview the finished document and export it as a high-quality PDF.

The important principle is:

Content changes. Design does not.

The team should never have to redesign a newsletter every time they publish one.

2. Technology

Use:

React

TypeScript

Tailwind CSS

Vite

Use a client-side PDF generation solution such as:

html2canvas

jsPDF

or another reliable browser-based PDF solution if appropriate.

No backend.

No database.

No authentication.

All content can remain in browser memory during the current session.

Use local browser storage only if useful for preserving drafts.

3. Overall UI

Create a very clean editorial interface.

The application should feel closer to a small publishing tool than a generic admin dashboard.

Avoid:

excessive cards

gradients

excessive rounded corners

dashboard clutter

unnecessary charts

unnecessary animations

generic SaaS styling

Use:

generous whitespace

strong typography

subtle borders

clear hierarchy

restrained controls

editorial layouts

large previews

The interface should feel professional enough that a creative director could comfortably use it.

4. Application Structure

Use a simple three-part workflow.

STEP 1 — Choose Document

Landing screen:

Living the Charge

Document Studio

Subtitle:

Create consistent, beautifully structured documents for the Living the Charge community.

Show two large options:

One-Page Brief

Create a concise, professional document for opportunities, partnerships, proposals and organizational updates.

Button:

Create Brief

Newsletter

Create a branded newsletter using text and photography.

Button:

Create Newsletter

5. One-Page Brief Generator

Create a simple editor with fields such as:

Document Information

Eyebrow / Category

Example:

OPPORTUNITY

Title

Example:

Living the Charge × Atlassian

Subtitle

Example:

Exploring better systems for how the organization works

Introduction

A rich text field for a short introductory paragraph.

Section 01

Section Title

Section Content

Section 02

Section Title

Section Content

Section 03

Section Title

Section Content

Call to Action / Next Step

A highlighted section containing:

Next Step

and supporting text.

Event / Reference Information

Optional fields:

Date

Time

Location

Website

Contact

Registration link

Only display these in the final document when populated.

Footer

Automatically include:

Living the Charge

with website:

livingthecharge.org

Do not require the user to manually enter this every time.

6. Brief Layout

The generated one-page document should use an editorial A4 portrait layout.

Structure:

TOP:

Living the Charge logo/name

small category/eyebrow

large title

subtitle

thin divider

BODY:

Three-column or modular editorial structure where appropriate.

Use strong numbered sections:

01
WHY THIS MATTERS

02
THE OPPORTUNITY

03
WHAT THIS COULD LOOK LIKE

Then:

NEXT STEP

FOOTER:

Living the Charge
livingthecharge.org

The layout must intelligently handle different amounts of text without overflowing the page.

The design should remain visually balanced.

If the content is too long, show a warning in the editor rather than silently creating an unusable PDF.

7. Newsletter Generator

This is the more important recurring feature.

Create a newsletter editor where Mark can essentially:

Enter the newsletter title

Enter a date

Paste his text

Add photographs

Organize the story into sections

Preview

Download PDF

The experience should require almost no design knowledge.

8. Newsletter Fields

Start with:

Newsletter Header

Issue / Category

Example:

MONTHLY UPDATE

Date

Example:

August 2026

Title

Example:

Building Opportunities, One Student at a Time

Intro / Lead

A short introductory paragraph.

9. Newsletter Story Blocks

Allow Mark to add multiple content blocks.

Each block should support:

Text Story

Fields:

Section label

Heading

Body text

Optional quote

Optional author

Photo + Text

Fields:

Upload image

Image caption

Heading

Body text

Image position: left / right

Full-Width Photo

Fields:

Upload image

Caption

Optional short text

Quote

Fields:

Quote

Person

Role

Highlight

Fields:

Number / statistic

Short description

Example:

25

Students supported

The user should be able to reorder blocks using simple up/down controls.

Drag-and-drop reordering is welcome if easy to implement, but it is not mandatory.

10. Photography

Photography is an important part of the Living the Charge identity.

Allow users to upload:

JPG

JPEG

PNG

WebP

Automatically optimize oversized images in the browser where practical.

Images should maintain their aspect ratio.

Do not stretch images.

Allow basic positioning:

Cover

Contain

Allow the user to choose between:

portrait

landscape

square

where useful.

Do not introduce filters or image editing.

The application is a document layout tool, not a photo editor.

11. Newsletter Layout

Create a sophisticated editorial newsletter layout.

Think:

annual report + independent magazine + nonprofit journal

rather than:

corporate email newsletter

Use:

large headlines

strong typography

generous whitespace

photographic storytelling

asymmetric layouts

thin rules/dividers

numbered sections

captions

occasional large pull quotes

restrained typography

Each issue should feel like it belongs to the same publication.

12. Newsletter Page Structure

A typical newsletter could automatically use:

PAGE 01

Living the Charge

MONTHLY UPDATE

Large title

Introductory text

Hero image

Short caption

PAGE 02+

Story sections

01
THE STORY

Large heading

Body text

Supporting photography

02
WHAT WE'RE BUILDING

Text + photograph

03
FROM THE COMMUNITY

Quote or story

FINAL PAGE

Closing message

Call to action

Website

Social links

Living the Charge identity

The system should automatically create additional pages when necessary.

Do not force every newsletter into one page.

13. Design System

Use a restrained editorial visual language.

The visual identity should be inspired by the existing Living the Charge website rather than inventing a completely different brand.

Use the website as the primary reference:

https://livingthecharge.org/

Important:

Do not copy the website literally.

Instead, extract its overall visual character and translate it into a document system.

Prioritize:

clarity

humanity

optimism

credibility

education

community

long-term impact

Avoid making it look like a technology company.

14. Typography

Use a modern editorial sans-serif system.

Prefer:

Inter

for body text.

Use a stronger editorial display treatment for headlines.

If another freely available Google Font creates a better hierarchy, it can be used.

Typography should have clear levels:

Display

H1

H2

H3

Body

Caption

Metadata

Do not use more than two font families.

15. Color System

Keep the palette restrained.

Use the existing Living the Charge visual identity as reference.

Create variables for:

--ltc-background
--ltc-text
--ltc-muted
--ltc-line
--ltc-accent

Use mostly:

warm/off-white backgrounds

near-black text

muted secondary text

subtle grey dividers

one restrained accent color

Do not use gradients.

Do not use bright SaaS-style colors.

16. Editorial Grid

Use an A4 document grid.

Recommended:

generous margins

12-column conceptual grid

consistent spacing

8px base spacing system

Use asymmetric layouts where appropriate.

Whitespace should be treated as an intentional design element.

17. PDF Export

This is a critical feature.

The exported PDF should look exactly like the preview.

Requirements:

A4 size

portrait orientation

high resolution

selectable text where possible

photographs rendered at good quality

no clipped content

no accidental blank pages

correct page breaks

consistent margins

consistent footer

Filename format:

For briefs:

LTC_Brief_[Title].pdf

For newsletters:

LTC_Newsletter_[Date].pdf

Sanitize filenames automatically.

18. Preview

Create a desktop workspace:

LEFT:

Content editor

RIGHT:

Live document preview

On smaller screens:

Editor first

Preview below

Provide:

Preview

Download PDF

buttons.

The preview should visually resemble an actual A4 printed document.

Use a subtle grey workspace background with the white/off-white A4 page floating in the center.

19. Newsletter Template Reusability

This is extremely important.

Mark should not have to recreate the newsletter structure every time.

Provide:

New Newsletter

and:

Use Previous Template

The application should preserve the standard newsletter structure while clearing the actual content.

For example:

Newsletter template:

Header
↓
Lead story
↓
Photo + story
↓
Quote
↓
Community update
↓
Photo
↓
Closing message

Mark can simply replace the content.

20. Draft Persistence

Use localStorage.

When the user refreshes the page, don't immediately lose the current draft.

Provide:

Save Draft

Clear Draft

Do not create accounts.

Do not send content to a server.

Add a small note:

Drafts are stored locally in this browser.

21. Content Validation

Keep validation simple.

Warn the user when:

a required title is missing

an image is too large

content is likely to overflow a page

the newsletter has no closing section

Do not block the user unnecessarily.

22. Important UX Principle

The application must make Mark feel like:

"I am writing a newsletter."

not:

"I am designing a newsletter."

The system should make all important design decisions automatically.

Mark's job is:

Write → Upload → Arrange → Preview → Export

The application handles:

Typography → Spacing → Grid → Page structure → Branding → PDF formatting

23. Example Content

Populate the application with realistic placeholder content so the first screen doesn't look empty.

Use examples related to Living the Charge:

student opportunities

community impact

fundraising

partnerships

education

volunteer opportunities

For the One-Page Brief, use the Atlassian workshop as the initial example.

Title:

Living the Charge × Atlassian

Subtitle:

Exploring better systems for how the organization works

Sections:

01 — WHY THIS MATTERS

02 — THE OPPORTUNITY

03 — WHAT LTC COULD EXPLORE

Next Step

Use the actual Atlassian workshop information as placeholder content, but make it easy to replace.

24. Navigation

Keep navigation minimal:

Documents

New Brief

New Newsletter

Drafts

No complex sidebar is necessary.

The main navigation can simply be:

Living the Charge
Document Studio

New Brief | New Newsletter | Drafts

25. Component Architecture

Build reusable React components.

Suggested components:

AppShell

DocumentSelector

BriefEditor

NewsletterEditor

StoryBlockEditor

ImageUploader

DocumentPreview

BriefPreview

NewsletterPreview

PageRenderer

TypographyControls

ExportControls

DraftManager

Keep the document rendering system separate from the editing UI.

The same document model should drive both the preview and PDF output.

26. Data Models

Create clean TypeScript types.

For example:

Document

id

type

title

createdAt

updatedAt

Brief

category

title

subtitle

introduction

sections

nextStep

metadata

Newsletter

issue

date

title

introduction

blocks

closingMessage

StoryBlock types:

text

imageText

fullImage

quote

highlight

Keep the architecture extensible.

27. Important Constraint

Do not overbuild this.

This is a small internal publishing tool.

Do NOT add:

user authentication

backend APIs

databases

payment systems

analytics

CRM functionality

social media integrations

email sending

AI writing

complicated document management

unnecessary settings

The core experience should be extremely simple:

Choose → Write → Add Photos → Preview → Export

28. Final Quality Bar

The finished application should feel like something a small nonprofit's communications team could actually use every month.

It should be:

minimal

reliable

editorial

accessible

easy to understand

visually consistent

fast

print-ready

The most important feature is consistency.

A newsletter created today and another created six months from now should clearly look like they came from the same Living the Charge publication.

The design system should do the heavy lifting so the team can focus on the content and the mission.

Build the complete frontend application with working interactions, sample data, live previews, local draft storage, image uploads, responsive layouts, and PDF export.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/93acd1af-064d-440f-ae8b-51a01c46006a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
