"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Users,
  ShoppingCart,
  ClipboardCheck,
  Bot,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/mall" },
  { icon: Users, label: "Staff Deployment", path: "/mall/staff" },
  { icon: MapPin, label: "Zones", path: "/mall/zones" },
  { icon: ShoppingCart, label: "Procurement", path: "/mall/procurement" },
  { icon: ClipboardCheck, label: "Inspections", path: "/mall/inspections" },
  { icon: Bot, label: "AI Assistant", path: "/mall/ai-assistant" },
];

function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <div className="hidden md:block w-[260px] bg-slate-950 border-r border-slate-700/50">
        <div className="p-4 space-y-4">
          <div className="h-8 bg-slate-800 rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-800 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-64 bg-slate-800 rounded animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MallDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 blueprint-grid">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-100">
                Mall Ops
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-center text-slate-100">
              Sign in to continue
            </h1>
            <p className="text-sm text-slate-400 text-center max-w-sm">
              Access the Retail Mall Operations & Asset Intelligence System
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  const activeMenuItem = menuItems.find((item) => item.path === pathname);
  const userInitial = user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-slate-950 border-r border-slate-700/50 transition-all duration-200 ${
          sidebarOpen ? "w-[260px]" : "w-[60px]"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center border-b border-slate-700/30 px-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8 flex items-center justify-center hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            aria-label="Toggle navigation"
          >
            <PanelLeft className="h-4 w-4 text-slate-400" />
          </button>
          {sidebarOpen && (
            <span className="ml-3 font-bold tracking-tight text-blue-400">
              MALL OPS
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-2 space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                title={item.label}
                className={`flex items-center gap-3 w-full h-10 px-3 rounded-lg transition-all text-sm ${
                  isActive
                    ? "bg-blue-600/10 border border-blue-500/20 text-blue-400 font-medium"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-400" : ""}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-slate-700/30 relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 w-full px-1 py-1 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-medium text-blue-400">{userInitial}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-slate-200 truncate leading-none">
                  {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-slate-500 truncate mt-1">
                  {user.email || "-"}
                </p>
              </div>
            )}
          </button>
          {showUserMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between bg-slate-900/95 backdrop-blur border-b border-slate-700/50 px-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-slate-800"
          >
            <Menu className="h-5 w-5 text-slate-400" />
          </button>
          <span className="font-semibold tracking-tight text-blue-400 text-sm">
            {activeMenuItem?.label ?? "Mall Ops"}
          </span>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-slate-950 border-r border-slate-700/50 flex flex-col">
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-700/30">
              <span className="font-bold tracking-tight text-blue-400">MALL OPS</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-800"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-2 space-y-0.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      router.push(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full h-10 px-3 rounded-lg transition-all text-sm ${
                      isActive
                        ? "bg-blue-600/10 border border-blue-500/20 text-blue-400 font-medium"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? "text-blue-400" : ""}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t border-slate-700/30">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:pt-0 pt-14">
        <div className="p-4 md:p-6 blueprint-grid min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
