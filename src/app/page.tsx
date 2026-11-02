
import {
  LayoutDashboard,
  Laptop,
  Tags,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  Monitor,
  Router,
  Package,
  CheckCircle2,
  Clock,
  MoreHorizontal,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Assets", icon: Laptop },
  { label: "Categories", icon: Tags },
  { label: "Employees", icon: Users },
  { label: "Assignments", icon: ClipboardList },
];

const stats = [
  {
    title: "Total Assets",
    value: "12",
    description: "All registered equipment",
    icon: Laptop,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    title: "Available Assets",
    value: "7",
    description: "Ready to be assigned",
    icon: CheckCircle2,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },
  {
    title: "Assigned Assets",
    value: "5",
    description: "Currently in use",
    icon: ClipboardList,
    iconColor: "text-blue-700",
    iconBg: "bg-blue-100",
  },
  {
    title: "Categories",
    value: "4",
    description: "Equipment categories",
    icon: Tags,
    iconColor: "text-slate-700",
    iconBg: "bg-slate-200",
  },
];

const assets = [
  {
    name: "Test Laptop",
    serial: "LAPTOP-001",
    category: "Laptop",
    assignedTo: "staff_test01",
    status: "AVAILABLE",
  },
  {
    name: "Office Monitor",
    serial: "MONITOR-003",
    category: "Monitor",
    assignedTo: "staff_test03",
    status: "ASSIGNED",
  },
  {
    name: "Wireless Router",
    serial: "ROUTER-002",
    category: "Networking",
    assignedTo: "Not assigned",
    status: "AVAILABLE",
  },
  {
    name: "Office Laptop",
    serial: "LAPTOP-004",
    category: "Laptop",
    assignedTo: "staff_test02",
    status: "ASSIGNED",
  },
];

const activities = [
  {
    title: "New asset registered",
    description: "Test Laptop was added to inventory",
    time: "Recently",
    icon: Plus,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Asset assigned",
    description: "Office Monitor assigned to staff_test03",
    time: "Recently",
    icon: Laptop,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Asset returned",
    description: "An asset was returned to inventory",
    time: "Recently",
    icon: CheckCircle2,
    color: "bg-slate-200 text-slate-700",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FC] text-[#111827]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 flex-col bg-[#101F3D] text-white md:flex">
          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Laptop size={23} />
            </div>
            <div>
              <h2 className="text-lg font-bold">AssetTrack</h2>
              <p className="text-xs text-slate-400">
                Management System
              </p>
            </div>
          </div>

          <div className="px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>

            <nav className="space-y-2">
              {navigation.map((item, index) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href="#"
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                      index === 0
                        ? "bg-blue-600 font-semibold text-white shadow-lg shadow-blue-950/20"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={19} />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto px-4 pb-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Administration
            </p>

            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Settings size={19} />
              Admin Panel
            </a>

            <a
              href="#"
              className="mt-2 flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut size={19} />
              Logout
            </a>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="min-w-0 flex-1">

          {/* TOP BAR */}
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-[#101F3D]">
                IT Asset Tracker
              </h2>
              <p className="text-xs text-slate-500">
                Equipment management dashboard
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                aria-label="Search"
                className="hidden rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 sm:block"
              >
                <Search size={19} />
              </button>

              <button
                aria-label="Notifications"
                className="relative rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"
              >
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500" />
              </button>

              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#19345F] font-bold text-white">
                  A
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold">Admin</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
              </div>
            </div>
          </header>

          {/* DASHBOARD BODY */}
          <div className="space-y-7 p-5 md:p-8">

            {/* WELCOME BANNER */}
            <section className="rounded-2xl bg-gradient-to-r from-[#19345F] via-[#245BA5] to-[#397FE8] p-7 shadow-md">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">
                Workspace / Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Welcome back, Admin!
              </h1>

              <p className="mt-2 text-blue-100">
                Here&apos;s an overview of your IT assets and equipment.
              </p>
            </section>

            {/* STATISTICS */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#101F3D]">
                    Overview
                  </h2>
                  <p className="text-sm text-slate-500">
                    Summary of your equipment inventory
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`rounded-xl p-3 ${stat.iconBg} ${stat.iconColor}`}>
                          <Icon size={22} />
                        </div>
                        <ArrowUpRight size={19} className="text-slate-400" />
                      </div>

                      <h3 className="mt-5 text-sm font-medium text-slate-500">
                        {stat.title}
                      </h3>

                      <p className="mt-1 text-3xl font-bold text-[#101F3D]">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        {stat.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* CHART AND ACTIVITY */}
            <section className="grid gap-6 lg:grid-cols-2">

              {/* ASSET STATUS CHART */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-[#101F3D]">
                      Asset Overview
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Current asset availability
                    </p>
                  </div>
                  <button
                    aria-label="More asset overview options"
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center gap-8 py-8 sm:flex-row">
                  <div
                    className="relative flex h-48 w-48 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background:
                        "conic-gradient(#2563EB 0% 58.33%, #16A34A 58.33% 100%)",
                    }}
                  >
                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-3xl font-bold text-[#101F3D]">
                        12
                      </span>
                      <span className="text-xs text-slate-500">
                        Total Assets
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-[#101F3D]">
                          Available
                        </p>
                        <p className="text-xs text-slate-500">
                          7 assets · 58.3%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-[#101F3D]">
                          Assigned
                        </p>
                        <p className="text-xs text-slate-500">
                          5 assets · 41.7%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT ACTIVITY */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-[#101F3D]">
                      Recent Activity
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Latest inventory updates
                    </p>
                  </div>
                  <Clock size={20} className="text-slate-400" />
                </div>

                <div className="mt-6 space-y-6">
                  {activities.map((activity) => {
                    const Icon = activity.icon;

                    return (
                      <div
                        key={activity.title}
                        className="flex items-start gap-4"
                      >
                        <div className={`rounded-xl p-3 ${activity.color}`}>
                          <Icon size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#101F3D]">
                            {activity.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {activity.description}
                          </p>
                          <p className="mt-2 text-xs text-slate-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* RECENT ASSETS TABLE */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
                <div>
                  <h2 className="font-bold text-[#101F3D]">
                    Recent Assets
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Recently registered equipment
                  </p>
                </div>

                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                  <Plus size={17} />
                  Add Asset
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Asset</th>
                      <th className="px-6 py-4 font-semibold">Serial Number</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Assigned To</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {assets.map((asset) => (
                      <tr
                        key={asset.serial}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                              {asset.category === "Laptop" ? (
                                <Laptop size={19} />
                              ) : asset.category === "Monitor" ? (
                                <Monitor size={19} />
                              ) : (
                                <Router size={19} />
                              )}
                            </div>
                            <span className="text-sm font-semibold text-[#101F3D]">
                              {asset.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {asset.serial}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {asset.category}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {asset.assignedTo}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              asset.status === "AVAILABLE"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {asset.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                <p className="text-xs text-slate-500">
                  Showing {assets.length} sample assets
                </p>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                  View all assets
                </button>
              </div>
            </section>

            {/* QUICK ACCESS */}
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <Package size={22} />
                </div>
                <div>
                  <p className="font-semibold text-[#101F3D]">
                    Manage Assets
                  </p>
                  <p className="text-xs text-slate-500">
                    View and manage inventory
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="rounded-xl bg-green-100 p-3 text-green-600">
                  <Users size={22} />
                </div>
                <div>
                  <p className="font-semibold text-[#101F3D]">
                    Manage Employees
                  </p>
                  <p className="text-xs text-slate-500">
                    View registered employees
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="rounded-xl bg-slate-200 p-3 text-slate-700">
                  <ClipboardList size={22} />
                </div>
                <div>
                  <p className="font-semibold text-[#101F3D]">
                    Assignments
                  </p>
                  <p className="text-xs text-slate-500">
                    Track assigned equipment
                  </p>
                </div>
              </div>
            </section>

            <footer className="py-3 text-center text-xs text-slate-400">
              IT Asset Tracker · Equipment Management System
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
