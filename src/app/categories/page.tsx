"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  getCategories,
  createCategory,
  type Category,
} from "@/services/assetService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const [role, setRole] = useState("");
  const [roleLoaded, setRoleLoaded] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN";

  // Load logged-in user's role.
  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => {
      if (!active) return;

      const savedRole = (
        localStorage.getItem("role") || ""
      ).toUpperCase();

      setRole(savedRole);
      setRoleLoaded(true);
    });

    return () => {
      active = false;
    };
  }, []);

  // Load categories.
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load categories."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load categories after the role has been checked.
  useEffect(() => {
    if (!roleLoaded) return;

    let active = true;

    Promise.resolve().then(() => {
      if (active) {
        void loadCategories();
      }
    });

    return () => {
      active = false;
    };
  }, [roleLoaded, loadCategories]);

  // Search categories.
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    );
  }, [categories, search]);

  // Create category.
  async function handleCreate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!isAdmin) {
      setError("Only administrators can create categories.");
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a category name.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await createCategory({ name: trimmedName });

      setName("");
      setMessage("Category created successfully!");

      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create category."
      );
    } finally {
      setSaving(false);
    }
  }

  // Refresh.
  async function handleRefresh() {
    setMessage("");
    await loadCategories();
  }

  if (!roleLoaded) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        Loading your account...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17233f]">
            Categories
          </h1>

          <p className="mt-1 text-gray-500">
            Organize and manage your organization&apos;s IT equipment.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* SUMMARY CARD */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Categories
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#17233f]">
            {categories.length}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Registered equipment categories
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Your Access
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#17233f]">
            {isAdmin ? "Administrator" : "Staff"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {isAdmin
              ? "You can create and view categories."
              : "You have read-only category access."}
          </p>
        </div>
      </div>

      {/* CREATE CATEGORY */}
      {isAdmin && (
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#17233f]">
            Add New Category
          </h2>

          <form
            onSubmit={handleCreate}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
                setMessage("");
              }}
              placeholder="Enter category name"
              required
              maxLength={100}
              disabled={saving}
              className="flex-1 rounded-lg border px-4 py-3 outline-none focus:border-blue-500 disabled:bg-gray-100"
            />

            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Category"}
            </button>
          </form>
        </section>
      )}

      {/* MESSAGES */}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {message && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-4 text-sm text-green-700"
        >
          {message}
        </p>
      )}

      {/* CATEGORY LIST */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#17233f]">
              All Categories
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredCategories.length} categories displayed
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            aria-label="Search categories"
            className="rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
          />
        </div>

        {loading ? (
          <p className="py-6 text-gray-500">
            Loading categories...
          </p>
        ) : error && categories.length === 0 ? (
          <p className="py-6 text-gray-500">
            Category information could not be loaded.
          </p>
        ) : filteredCategories.length === 0 ? (
          <p className="py-6 text-gray-500">
            {search
              ? "No matching categories found."
              : "No categories have been created yet."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="rounded-xl border border-gray-200 p-5 transition hover:border-blue-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl">
                    <span aria-hidden="true">📦</span>
                  </div>

                  <span className="text-xs text-gray-400">
                    #{category.id}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-[#17233f]">
                  {category.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  IT equipment category
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}