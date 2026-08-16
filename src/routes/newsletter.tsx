import { createFileRoute } from "@tanstack/react-router";
import { Studio } from "@/components/ltc/Studio";
export const Route = createFileRoute("/newsletter")({ component: () => <Studio kind="newsletter" /> });
