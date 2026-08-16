import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ltc-background font-sans text-ltc-text">
      <header className="border-b border-ltc-line bg-ltc-background/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-10 gap-y-3 px-4 py-4 sm:items-baseline sm:px-6 lg:px-10">
          <Link to="/" className="group">
            <span className="ltc-display block text-[19px] leading-none">Living the Charge</span>
            <span className="ltc-meta mt-1 block">Document Studio</span>
          </Link>
          <nav className="flex w-full items-center justify-between gap-3 text-[13px] sm:ml-auto sm:w-auto sm:gap-7">
            <NavLink to="/brief">New Brief</NavLink>
            <NavLink to="/newsletter">New Newsletter</NavLink>
            <NavLink to="/drafts">Drafts</NavLink>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="text-ltc-muted transition-colors hover:text-ltc-text"
      activeProps={{ className: "text-ltc-text underline underline-offset-[6px]" }}
    >
      {children}
    </Link>
  );
}
