import type { Brief, Newsletter, StoryBlock } from "./types";
import { uid } from "./types";

const now = () => new Date().toISOString();

export function sampleBrief(): Brief {
  return {
    id: uid(),
    type: "brief",
    category: "OPPORTUNITY",
    title: "Living the Charge × Atlassian",
    subtitle: "Exploring better systems for how the organization works",
    introduction:
      "Atlassian has invited Living the Charge to a hands-on workshop exploring how small, mission-driven teams organise their work. It is a rare chance to look closely at how we plan, track and share the work we do for students — and to leave with practical systems we can actually use.",
    sections: [
      {
        id: uid(),
        title: "WHY THIS MATTERS",
        content:
          "Living the Charge runs on the energy of a small team and a wide community of volunteers. As programmes grow, coordination becomes the quiet bottleneck: who is doing what, what is next, and what has already been promised. Better internal systems mean less time spent chasing updates and more time spent with students.",
      },
      {
        id: uid(),
        title: "THE OPPORTUNITY",
        content:
          "The workshop covers project planning, shared documentation and lightweight tracking for teams that do not have dedicated operations staff. Participation is free, facilitated by practitioners, and designed around real organisational cases rather than abstract theory.",
      },
      {
        id: uid(),
        title: "WHAT LTC COULD EXPLORE",
        content:
          "A single shared home for programme plans. A simple, repeatable intake for opportunities and partnerships. Clear ownership for each initiative. A termly rhythm of review so that nothing important quietly falls away between cohorts.",
      },
    ],
    nextStepTitle: "NEXT STEP",
    nextStep:
      "Confirm two team members to attend, prepare one current programme as a working example, and share a short summary with the wider team within a week of the workshop.",
    meta: {
      date: "12 September 2026",
      time: "09:30 — 15:00",
      location: "Nairobi",
      website: "livingthecharge.org",
      contact: "hello@livingthecharge.org",
      registration: "",
    },
    createdAt: now(),
    updatedAt: now(),
  };
}

export function templateBlocks(): StoryBlock[] {
  return [
    { id: uid(), kind: "text", label: "THE STORY", heading: "", body: "" },
    {
      id: uid(),
      kind: "imageText",
      label: "WHAT WE'RE BUILDING",
      heading: "",
      body: "",
      imagePosition: "right",
    },
    { id: uid(), kind: "quote", label: "FROM THE COMMUNITY", quote: "", person: "", role: "" },
    { id: uid(), kind: "text", label: "COMMUNITY UPDATE", heading: "", body: "" },
    { id: uid(), kind: "fullImage", label: "IN PICTURES", text: "" },
    { id: uid(), kind: "highlight", label: "BY THE NUMBERS", value: "", description: "" },
  ];
}

export function sampleNewsletter(): Newsletter {
  return {
    id: uid(),
    type: "newsletter",
    issue: "MONTHLY UPDATE",
    date: "August 2026",
    title: "Building Opportunities, One Student at a Time",
    introduction:
      "This month brought new partnerships, a fuller mentorship cohort and a reminder of why the work matters: a student who thought university was out of reach is now preparing for her first semester. Here is what the community built together in August.",
    blocks: [
      {
        id: uid(),
        kind: "text",
        label: "THE STORY",
        heading: "A cohort that keeps growing",
        body: "Twenty-five students joined the August mentorship cohort, the largest group we have supported in a single month. Each of them is paired with a mentor for weekly check-ins covering applications, study habits and the practical questions that rarely appear in a syllabus.\n\nWhat stands out is not the number, but the consistency. Attendance across sessions held above ninety percent — a sign that the rhythm we set at the start of the year is working.",
        quote: "The first time someone asked me what I wanted to study, I did not have an answer. Now I do.",
        quoteAuthor: "Cohort participant",
      },
      {
        id: uid(),
        kind: "imageText",
        label: "WHAT WE'RE BUILDING",
        heading: "Learning spaces that stay open",
        body: "The community study space now runs six evenings a week, staffed by volunteers who studied in the same classrooms a few years earlier. Small improvements — better lighting, reliable power, a shelf of reference books — have made it the default place to work after school.",
        imagePosition: "right",
      },
      {
        id: uid(),
        kind: "quote",
        label: "FROM THE COMMUNITY",
        quote: "Living the Charge did not hand me a plan. It helped me build one I could carry myself.",
        person: "Faith N.",
        role: "2025 cohort, now studying public health",
      },
      {
        id: uid(),
        kind: "highlight",
        label: "BY THE NUMBERS",
        value: "25",
        description: "Students supported through the August mentorship cohort",
      },
      {
        id: uid(),
        kind: "text",
        label: "PARTNERSHIPS",
        heading: "New conversations, practical outcomes",
        body: "Two organisations joined us this month to explore shared work: one offering workshop facilitation, the other supporting travel costs for students attending university interviews. Both partnerships begin small and deliberately, with a single cohort as the pilot.",
      },
    ],
    closingTitle: "GET INVOLVED",
    closingMessage:
      "Every cohort is made possible by people who give an hour a week, a skill, or a small monthly contribution. If any of this resonates, there is a place for you in the next chapter.",
    callToAction: "Write to us at hello@livingthecharge.org to volunteer, mentor or partner.",
    website: "livingthecharge.org",
    socials: "@livingthecharge",
    createdAt: now(),
    updatedAt: now(),
  };
}
