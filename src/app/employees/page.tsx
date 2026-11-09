"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getEmployees,
  type Employee,
} from "@/services/assetService";
import {
  Users,
  ShieldCheck,
  UserRound,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

type RoleFilter = "ALL" | "ROLE_ADMIN" | "ROLE_STAFF";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [role, setRole] = useState("");
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("ALL");

  const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN";

  // Read logged-in user's role.
  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => {
      if (!active) return;

      const storedRole = localStorage.getItem("role") || "";

      setRole(storedRole.toUpperCase());
      setRoleLoaded(true);
    });

    return () => {
      active = false;
    };
  }, []);

  // Fetch employees from backend.
  const loadEmployees = useCallback(async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError("");

      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to load employees:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load employees."
      );
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Load employees after checking the user's role.
  useEffect(() => {
    if (!roleLoaded || !isAdmin) return;

    let active = true;

    Promise.resolve().then(() => {
      if (active) {
        void loadEmployees();
      }
    });

    return () => {
      active = false;
    };
  }, [roleLoaded, isAdmin, loadEmployees]);

  // Employee statistics.
  const adminCount = employees.filter(
    (employee) => employee.role === "ROLE_ADMIN"
  ).length;

  const staffCount = employees.filter(
    (employee) => employee.role === "ROLE_STAFF"
  ).length;

  // Search and role filtering.
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = employee.username
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const matchesRole =
        roleFilter === "ALL" ||
        employee.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [employees, search, roleFilter]);

  // Permission loading.
  if (!roleLoaded) {
    return (
      <div className="p-6 text-gray-500">
        Checking account permissions...
      </div>
    );
  }

  // Restrict staff accounts.
  if (!isAdmin) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">
          Employees
        </h1>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="font-semibold text-blue-900">
            Administrator Permission Required
          </h2>

          <p className="mt-2 text-sm text-blue-800">
            Only administrators can access employee management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17233f]">
            Employees
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage registered system accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={loadEmployees}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Accounts
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#17233f]">
                {employees.length}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Users size={25} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Administrators
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#17233f]">
                {adminCount}
              </h2>
            </div>

            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <ShieldCheck size={25} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Staff Members
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#17233f]">
                {staffCount}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <UserRound size={25} />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5">
          <div>
            <h2 className="text-lg font-semibold text-[#17233f]">
              Registered Employees
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredEmployees.length} of {employees.length} accounts
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search username..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-52"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as RoleFilter)
              }
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">All Roles</option>
              <option value="ROLE_ADMIN">Administrators</option>
              <option value="ROLE_STAFF">Staff</option>
            </select>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading employee records...
          </div>
        ) : error ? (
          <div className="m-5 flex items-start gap-3 rounded-lg bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} />

            <div>
              <p className="font-semibold">
                Unable to load employees
              </p>

              <p className="mt-1 text-sm">{error}</p>

              <button
                type="button"
                onClick={loadEmployees}
                className="mt-3 text-sm font-semibold underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No matching employees found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Account Type</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((employee) => {
                  const admin =
                    employee.role === "ROLE_ADMIN";

                  return (
                    <tr
                      key={employee.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-gray-500">
                        #{employee.id}
                      </td>

                      <td className="px-6 py-4 font-medium text-[#17233f]">
                        {employee.username}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {employee.role}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            admin
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {admin ? "Administrator" : "Staff"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}