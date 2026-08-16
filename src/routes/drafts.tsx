import { createFileRoute } from "@tanstack/react-router";
import { Drafts } from "@/components/ltc/Studio";
export const Route = createFileRoute("/drafts")({ component: Drafts });
