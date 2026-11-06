"use client";
import { useState } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function NavMenu({ links, loggedIn }: { links: { href: string; label: string }[]; loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* desktop */}
      <div className="hidden items-center gap-5 text-sm md:flex">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-gray-700 hover:text-black">{l.label}</Link>
        ))}
        {loggedIn ? <LogoutButton /> : <Link href="/register" className="rounded bg-brand-600 hover:bg-brand-700 px-3 py-1.5 text-white">Sign up</Link>}
      </div>

      {/* mobile */}
      <button onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded border text-lg md:hidden">
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b bg-white shadow-lg md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={close} className="border-b py-3">{l.label}</Link>
            ))}
            <div className="py-3">
              {loggedIn ? (
                <span onClick={close}><LogoutButton /></span>
              ) : (
                <Link href="/register" onClick={close} className="block rounded bg-brand-600 hover:bg-brand-700 py-2 text-center text-white">Sign up</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}