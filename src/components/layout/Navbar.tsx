"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Menu, X } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
              <Users className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg">GradConnect</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/groups"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Browse Teams
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              How It Works
            </Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden items-center gap-3 md:flex">
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded-md bg-zinc-800" />
            ) : session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-300 hover:text-white"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-amber-600/40 transition-all hover:ring-amber-600">
                        <AvatarImage
                          src={session.user.image ?? ""}
                          alt={session.user.name ?? ""}
                        />
                        <AvatarFallback className="bg-amber-700 text-white text-xs">
                          {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/groups/new">Create Team</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-red-400 focus:text-red-400"
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-300 hover:text-white"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-500 text-white"
                  >
                    Join Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex items-center justify-center rounded-md p-2 text-zinc-400 hover:text-white md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-zinc-950 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/groups"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              Browse Teams
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              How It Works
            </Link>
            {!loading && session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  Profile
                </Link>
                <Link
                  href="/groups/new"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  Create Team
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5"
                >
                  Sign out
                </button>
              </>
            ) : !loading ? (
              <div className="mt-2 flex gap-2 px-3">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/15 text-zinc-300"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1"
                >
                  <Button
                    size="sm"
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white"
                  >
                    Join Free
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
