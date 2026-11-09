
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Clock3,
  Laptop,
  Monitor,
  Package,
  Plus,
  RefreshCw,
  Router,
  ShieldCheck,
  Tags,
  TrendingUp,
  Users,
  AlertCircle,
  BriefcaseBusiness,
  Search,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import {
  getAssets,
  getMyAssets,
  getEmployees,
  type Asset,
  type Employee,
} from "@/services/assetService";

type DashboardRole = "ROLE_ADMIN" | "ROLE_STAFF" | "ADMIN" | "";

const iconForCategory = (name: string) => {
  const value = name.toLowerCase();

  if (value.includes("laptop")) return Laptop;
  if (value.includes("monitor")) return Monitor;
  if (value.includes("router")) return Router;

  return Package;
};

const formatDate = (date: string) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [role, setRole] = useState<DashboardRole>("");
  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN";

  const loadDashboard = useCallback(async () => {
    const storedRole = (
      localStorage.getItem("role") || ""
    ).toUpperCase() as DashboardRole;

    setRole(storedRole);
    setUsername(localStorage.getItem("username") || "User");

    try {
      setLoading(true);
      setError("");

      if (storedRole === "ROLE_ADMIN" || storedRole === "ADMIN") {
        const [assetData, employeeData] = await Promise.all([
          getAssets(),
          getEmployees(),
        ]);

        setAssets(assetData);
        setEmployees(employeeData);
      } else {
        const myAssets = await getMyAssets();

        setAssets(myAssets);
        setEmployees([]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  const totalAssets = assets.length;

  const availableAssets = assets.filter(
    (asset) => asset.status === "AVAILABLE"
  ).length;

  const assignedAssets = assets.filter(
    (asset) => asset.status === "ASSIGNED"
  ).length;

  const utilization = totalAssets
    ? Math.round((assignedAssets / totalAssets) * 100)
    : 0;

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};

    assets.forEach((asset) => {
      const category = asset.categoryName || "Uncategorized";
      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalAssets
          ? Math.round((count / totalAssets) * 100)
          : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [assets, totalAssets]);

  const recentAssets = useMemo(() => {
    return [...assets]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 6);
  }, [assets]);

  const stats = [
    {
      label: isAdmin ? "Total Assets" : "My Assets",
      value: totalAssets,
      detail: "Registered equipment",
      icon: Boxes,
      color: "blue",
      trend: "Equipment inventory",
    },
    {
      label: "Available Assets",
      value: availableAssets,
      detail: "Ready for assignment",
      icon: CheckCircle2,
      color: "emerald",
      trend: "Ready to use",
    },
    {
      label: "Assigned Assets",
      value: assignedAssets,
      detail: "Currently in use",
      icon: BriefcaseBusiness,
      color: "violet",
      trend: "Active assignments",
    },
    {
      label: isAdmin ? "Employees" : "Utilization",
      value: isAdmin ? employees.length : `${utilization}%`,
      detail: isAdmin ? "Registered system users" : "Your assigned assets",
      icon: Users,
      color: "orange",
      trend: isAdmin ? "System accounts" : "Asset usage",
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    orange: "bg-orange-50 text-orange-700 ring-orange-100",
  };

  return (
    <div className="w-full space-y-8 pb-6">

      {/* PAGE HEADING */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Overview
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor and manage your organization&apos;s IT equipment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadDashboard()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh data
        </button>
      </section>

      {/* WELCOME BANNER */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#101d36] via-[#17396b] to-[#2563eb] p-7 text-white shadow-xl shadow-blue-950/10 sm:p-9">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-8 -top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 right-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-blue-100 backdrop-blur-sm">
              <Sparkles size={14} />
              IT ASSET MANAGEMENT
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {username}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              Here&apos;s your equipment overview. Keep track of assets,
              monitor availability and manage assignments from one place.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {isAdmin && (
                <Link
                  href="/assets"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <Plus size={17} />
                  Manage assets
                  <ArrowRight size={16} />
                </Link>
              )}

              <Link
                href="/assignments"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                View assignments
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>

          <div className="hidden h-40 w-40 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 shadow-inner backdrop-blur-md md:flex">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck size={76} strokeWidth={1.2} />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 flex items-center gap-2 border-t border-white/15 pt-5 text-xs font-medium text-blue-100">
          <ShieldCheck size={15} />
          Secure equipment management workspace
        </div>
      </section>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <AlertCircle className="mt-0.5 shrink-0" size={19} />
          <div>
            <p className="font-bold">Could not load dashboard data</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* KPI CARDS */}
      <section>
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Asset overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Key performance indicators for your equipment.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live data
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${colorClasses[stat.color]}`}
                  >
                    <Icon size={23} strokeWidth={1.9} />
                  </div>

                  <div className="rounded-full bg-slate-50 p-2 text-slate-300 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                    <TrendingUp size={17} />
                  </div>
                </div>

                <p className="mt-6 text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <div className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
                  {loading ? "—" : stat.value}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400">
                    {stat.detail}
                  </p>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {stat.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ANALYTICS */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Equipment analytics
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Understand your equipment distribution and usage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* CATEGORY DISTRIBUTION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Equipment by category
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Distribution of registered assets
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <Tags size={21} />
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-slate-400">
                Loading category information...
              </div>
            ) : categoryStats.length === 0 ? (
              <div className="py-16 text-center">
                <Package size={38} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  No equipment categories yet
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Add equipment to see category analytics.
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-7">
                {categoryStats.map((category) => {
                  const Icon = iconForCategory(category.name);

                  return (
                    <div key={category.name}>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                            <Icon size={19} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {category.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              Equipment category
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-base font-bold text-slate-900">
                            {category.count}
                          </p>
                          <p className="text-xs text-slate-400">
                            {category.percentage}%
                          </p>
                        </div>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
                          style={{
                            width: `${category.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
              <p className="text-xs text-slate-400">
                Showing up to five categories
              </p>

              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
              >
                View categories
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* UTILIZATION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Asset utilization
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Assigned equipment ratio
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
                <Activity size={21} />
              </div>
            </div>

            <div className="flex flex-col items-center py-8">
              <div
                className="relative flex h-48 w-48 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#2563eb ${utilization}%, #e2e8f0 ${utilization}% 100%)`,
                }}
              >
                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">
                    {loading ? "—" : `${utilization}%`}
                  </span>
                  <span className="mt-1 text-xs font-medium text-slate-400">
                    Utilization
                  </span>
                </div>
              </div>

              <div className="mt-8 grid w-full grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                    Assigned
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {loading ? "—" : assignedAssets}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    Available
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {loading ? "—" : availableAssets}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT EQUIPMENT */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Recent equipment
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest assets registered in your system.
            </p>
          </div>

          <Link
            href="/assets"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            View all assets
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading equipment...
          </div>
        ) : recentAssets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Package size={30} />
            </div>

            <p className="mt-4 font-bold text-slate-800">
              No equipment found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Equipment will appear here when it is registered.
            </p>

            {isAdmin && (
              <Link
                href="/assets"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <Plus size={17} />
                Add equipment
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Equipment</th>
                  <th className="px-5 py-4">Serial number</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Assigned to</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Added</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentAssets.map((asset) => {
                  const Icon = iconForCategory(
                    asset.categoryName || ""
                  );

                  return (
                    <tr
                      key={asset.id}
                      className="transition hover:bg-blue-50/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <Icon size={19} />
                          </div>

                          <span className="text-sm font-bold text-slate-800">
                            {asset.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {asset.serialNumber || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {asset.categoryName || "Uncategorized"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {asset.assignedToUsername || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                            asset.status === "AVAILABLE"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              asset.status === "AVAILABLE"
                                ? "bg-emerald-500"
                                : "bg-blue-500"
                            }`}
                          />
                          {asset.status === "AVAILABLE"
                            ? "Available"
                            : "Assigned"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(asset.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <p className="text-xs text-slate-400">
            Showing {loading ? "—" : recentAssets.length} recent records
          </p>

          <Link
            href="/assets"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            Open inventory
            <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      {isAdmin && (
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Quick actions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Shortcuts to your most important management tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              href="/assets"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Plus size={22} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Manage assets
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Add and update equipment
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={19}
                className="text-slate-400 transition group-hover:text-blue-600"
              />
            </Link>

            <Link
              href="/employees"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                  <Users size={22} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Employees
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    View registered users
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={19}
                className="text-slate-400 transition group-hover:text-violet-600"
              />
            </Link>

            <Link
              href="/categories"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <Tags size={22} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Categories
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Organize equipment types
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={19}
                className="text-slate-400 transition group-hover:text-emerald-600"
              />
            </Link>
          </div>
        </section>
      )}

      {/* DASHBOARD FOOTER */}
      <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 py-6 text-xs text-slate-400 sm:flex-row">
        <p>IT Asset Tracker · Equipment Management System</p>

        <p className="flex items-center gap-2">
          <Clock3 size={14} />
          Dashboard overview
        </p>
      </footer>
    </div>
  );
}
