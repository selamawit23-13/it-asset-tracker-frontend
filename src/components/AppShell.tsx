
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Laptop,
  Tags,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserCircle,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUIStore } from "@/store/uiStore";

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Assets", href: "/assets", icon: Laptop },
  { label: "Categories", href: "/categories", icon: Tags },
  { label: "Employees", href: "/employees", icon: Users, adminOnly: true },
  {
    label: "Assignments",
    href: "/assignments",
    icon: ClipboardList,
    adminOnly: true,
  },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { username, role, logout, isLoading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const sidebarCollapsed = useUIStore(
    (state) => state.sidebarCollapsed
  );
  const toggleSidebar = useUIStore(
    (state) => state.toggleSidebar
  );

  const isAdmin =
    role?.toUpperCase() === "ROLE_ADMIN" ||
    role?.toUpperCase() === "ADMIN";

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading your account...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">

      {/* Mobile overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden bg-[#101d36] text-white shadow-2xl transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-72"
        } ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >

        {/* Brand */}
        <div
          className={`flex h-20 shrink-0 items-center border-b border-white/10 ${
            sidebarCollapsed
              ? "justify-center px-3"
              : "justify-between px-6"
          }`}
        >
          <Link
            href="/"
            title="AssetTracker"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20">
              <Laptop size={23} />
            </div>

            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  AssetTracker
                </h1>
                <p className="text-xs text-slate-400">
                  Equipment Management
                </p>
              </div>
            )}
          </Link>

          {!sidebarCollapsed && (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X size={21} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-7">
          {!sidebarCollapsed && (
            <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Main Menu
            </p>
          )}

          <nav className="space-y-2">
            {navigation
              .filter((item) => !item.adminOnly || isAdmin)
              .map((item) => {
                const Icon = item.icon;

                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`group flex items-center rounded-xl py-3.5 transition-all duration-200 ${
                      sidebarCollapsed
                        ? "justify-center px-2"
                        : "justify-between px-4"
                    } ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={20} />
                      {!sidebarCollapsed && (
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </span>

                    {active && !sidebarCollapsed && (
                      <ChevronRight size={17} />
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* Account information */}
          <div className="mt-10">
            {!sidebarCollapsed && (
              <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Account
              </p>
            )}

            <div
              className={`rounded-xl border border-white/10 bg-white/5 ${
                sidebarCollapsed
                  ? "flex justify-center p-3"
                  : "p-4"
              }`}
              title={sidebarCollapsed ? username || "User" : undefined}
            >
              <div
                className={`flex items-center ${
                  sidebarCollapsed ? "justify-center" : "gap-3"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                  <UserCircle size={24} />
                </div>

                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {username || "User"}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {isAdmin ? "Administrator" : "Staff Member"}
                    </p>
                  </div>
                )}
              </div>

              {!sidebarCollapsed && (
                <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-xs text-slate-400">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <span>Account access enabled</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="shrink-0 border-t border-white/10 p-4">
          <button
            type="button"
            title={sidebarCollapsed ? "Sign out" : undefined}
            onClick={handleLogout}
            className={`flex w-full items-center rounded-xl py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-300 ${
              sidebarCollapsed
                ? "justify-center px-2"
                : "gap-3 px-4"
            }`}
          >
            <LogOut size={19} />
            {!sidebarCollapsed && "Sign out"}
          </button>

          {!sidebarCollapsed && (
            <p className="mt-4 text-center text-[11px] text-slate-500">
              IT Asset Tracker · v1.0
            </p>
          )}
        </div>
      </aside>

      {/* Main application */}
      <main
        className={`min-h-screen min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >

        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">

            {/* Mobile menu */}
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMenuOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
            >
              <Menu size={21} />
            </button>

            {/* Desktop collapse button */}
            <button
              type="button"
              aria-label={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              title={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              onClick={toggleSidebar}
              className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-600 transition-colors hover:bg-slate-100 lg:block"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>

            <div>
              <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                IT Asset Management
              </h2>

              <p className="hidden text-xs text-slate-500 sm:block">
                Manage and monitor your equipment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {username || "User"}
              </p>

              <p className="text-xs text-slate-500">
                {isAdmin ? "Administrator" : "Staff"}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <UserCircle size={23} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="w-full min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
          IT Asset Tracker · Equipment Management System
        </footer>
      </main>
    </div>
  );
}
