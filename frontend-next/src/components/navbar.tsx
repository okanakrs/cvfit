"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, LogOut, Sparkles, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Navbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const { user, profile, loading, login, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = user?.full_name ? getInitials(user.full_name) : "";
  const isPro = profile?.plan === "pro";

  return (
    <header
      className={`sticky top-0 z-50 h-16 transition-all duration-200 ${
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        {/* Logo — sol */}
        <a href="/" className="flex items-center shrink-0" aria-label="CVFit ana sayfa">
          <img src="/cvfit-logo-light.svg" alt="CVFit" className="h-11 md:h-12 w-auto dark:hidden" />
          <img src="/cvfit-logo-dark.svg" alt="CVFit" className="hidden h-11 md:h-12 w-auto dark:block" />
        </a>

        {/* Nav links — orta */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <a href="/builder" className="nav-link">CV Oluştur</a>
          <a href="/how-it-works" className="nav-link">Nasıl Çalışır</a>
          <a href="/pricing" className="nav-link">Fiyatlandırma</a>
          <a href="/blog" className="nav-link">Blog</a>
          {isPro && (
            <a href="/ats" className="nav-link flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-purple-500" />
              ATS Analizi
            </a>
          )}
        </nav>

        {/* Sağ taraf */}
        <div className="flex items-center gap-2 shrink-0">
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              aria-label="Tema değiştir"
            >
              {resolvedTheme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>
          )}

          {!loading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border bg-muted/40 hover:bg-muted transition-all">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs bg-foreground text-background font-bold">
                    {initials || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground font-medium max-w-[100px] truncate hidden sm:block">
                  {user.full_name?.split(" ")[0] || "Hesabım"}
                </span>
                {isPro && (
                  <span className="text-[10px] font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1.5 py-0.5 rounded-full hidden sm:block">
                    PRO
                  </span>
                )}
                <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium truncate">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !loading ? (
            <button
              onClick={login}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Giriş Yap
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
