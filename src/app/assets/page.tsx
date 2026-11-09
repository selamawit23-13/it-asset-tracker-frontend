"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import { useUIStore } from "@/store/uiStore";

import {
  getAssets,
  getMyAssets,
  getCategories,
  createAsset,
  deleteAsset,
  type Asset,
  type Category,
} from "@/services/assetService";

function getFriendlyError(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(error.message);

    if (parsed.message) {
      return parsed.message;
    }
  } catch {
    // Keep the original error message.
  }

  return error.message || fallback;
}

export default function AssetsPage() {
  const queryClient = useQueryClient();

  const {
    role,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  const assetSearch = useUIStore((state) => state.assetSearch);
  const setAssetSearch = useUIStore((state) => state.setAssetSearch);
  const assetStatusFilter = useUIStore((state) => state.assetStatusFilter);
  const setAssetStatusFilter = useUIStore(
    (state) => state.setAssetStatusFilter
  );
  const resetAssetFilters = useUIStore(
    (state) => state.resetAssetFilters
  );

  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isAdmin =
    role?.toUpperCase() === "ROLE_ADMIN" ||
    role?.toUpperCase() === "ADMIN";

  // Fetch assets and cache them.
  const assetsQuery = useQuery<Asset[], Error>({
    queryKey: ["assets", isAdmin ? "all" : "mine"],
    queryFn: () => (isAdmin ? getAssets() : getMyAssets()),
    enabled: isAuthenticated && !authLoading,
  });

  // Fetch categories for administrators only.
  const categoriesQuery = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: isAuthenticated && !authLoading && isAdmin,
  });

  const assets = assetsQuery.data ?? [];
  const categories = isAdmin ? categoriesQuery.data ?? [] : [];

  const loading =
    authLoading ||
    assetsQuery.isPending ||
    (isAdmin && categoriesQuery.isPending);

  // Create asset mutation.
  const createMutation = useMutation({
    mutationFn: createAsset,

    onSuccess: async () => {
      setName("");
      setSerialNumber("");
      setCategoryId("");

      setError("");
      setMessage("Asset created successfully!");

      await queryClient.invalidateQueries({
        queryKey: ["assets"],
      });
    },

    onError: (err: Error) => {
      setError(
        getFriendlyError(
          err,
          "Could not create asset. Please try again."
        )
      );
    },
  });

  // Delete asset mutation.
  const deleteMutation = useMutation({
    mutationFn: deleteAsset,

    onSuccess: async () => {
      setError("");
      setMessage("Asset deleted successfully!");

      await queryClient.invalidateQueries({
        queryKey: ["assets"],
      });
    },

    onError: (err: Error) => {
      setError(
        getFriendlyError(
          err,
          "Could not delete asset. Please try again."
        )
      );
    },

    onSettled: () => {
      setDeletingId(null);
    },
  });

  // Create a new asset.
  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAdmin) {
      setError("Only administrators can create assets.");
      return;
    }

    setError("");
    setMessage("");

    createMutation.mutate({
      name: name.trim(),
      serialNumber: serialNumber.trim(),
      categoryId: Number(categoryId),
    });
  }

  // Delete an asset.
  function handleDelete(id: number) {
    if (!isAdmin) {
      setError("Only administrators can delete assets.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this asset?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setMessage("");

    deleteMutation.mutate(id);
  }

  // Refresh the asset and category queries.
  async function handleRefresh() {
    setError("");
    setMessage("");

    await assetsQuery.refetch();

    if (isAdmin) {
      await categoriesQuery.refetch();
    }
  }

  const filteredAssets = assets.filter((asset) => {
    const search = assetSearch.trim().toLowerCase();

    const matchesSearch =
      !search ||
      asset.name.toLowerCase().includes(search) ||
      asset.serialNumber.toLowerCase().includes(search) ||
      asset.categoryName.toLowerCase().includes(search) ||
      (asset.assignedToUsername || "").toLowerCase().includes(search);

    const matchesStatus =
      assetStatusFilter === "ALL" ||
      asset.status === assetStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const queryError =
    assetsQuery.error ??
    (isAdmin ? categoriesQuery.error : null);

  if (authLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        Loading your account...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17233f]">
            Assets
          </h1>

          <p className="mt-1 text-gray-500">
            {isAdmin
              ? "Manage your organization's IT equipment."
              : "View the IT equipment assigned to your account."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || assetsQuery.isFetching}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {assetsQuery.isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ADMIN-ONLY ADD ASSET FORM */}
      {isAdmin && (
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#17233f]">
            Add New Asset
          </h2>

          <form
            onSubmit={handleCreate}
            className="grid gap-4 md:grid-cols-3"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Asset name"
              required
              maxLength={150}
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="Serial number"
              required
              maxLength={100}
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={
                createMutation.isPending ||
                loading ||
                categories.length === 0
              }
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-3"
            >
              {createMutation.isPending
                ? "Adding asset..."
                : "Add Asset"}
            </button>
          </form>

          {categories.length === 0 && !loading && (
            <p className="mt-3 text-sm text-gray-500">
              Add a category before creating an asset.
            </p>
          )}
        </section>
      )}

      {/* STAFF INFORMATION */}
      {!isAdmin && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          You can view only the IT equipment assigned to your account.
          Asset creation and deletion are restricted to administrators.
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {message && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-4 text-sm text-green-700"
        >
          {message}
        </p>
      )}

      {/* ERROR MESSAGE */}
      {(error || queryError) && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {error ||
            getFriendlyError(
              queryError,
              "Could not load asset information. Please try again."
            )}
        </p>
      )}

      {/* ASSET TABLE */}
      <section className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-[#17233f]">
            {isAdmin ? "All Assets" : "My Assigned Assets"} (
            {filteredAssets.length})
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {isAdmin
              ? "Complete organizational asset inventory."
              : "Equipment currently assigned to your account."}
          </p>
        </div>

        <div className="flex flex-col gap-3 border-b p-6 sm:flex-row">
          <input
            type="search"
            value={assetSearch}
            onChange={(e) => setAssetSearch(e.target.value)}
            placeholder="Search by name, serial number, category..."
            className="min-w-0 flex-1 rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            value={assetStatusFilter}
            onChange={(e) => setAssetStatusFilter(e.target.value)}
            className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="ALL">All statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ASSIGNED">Assigned</option>
          </select>

          <button
            type="button"
            onClick={resetAssetFilters}
            className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear filters
          </button>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">
            Loading assets...
          </p>
        ) : queryError && assets.length === 0 ? (
          <p className="p-6 text-gray-500">
            Asset information could not be loaded.
          </p>
        ) : filteredAssets.length === 0 ? (
          <p className="p-6 text-gray-500">
            {isAdmin
              ? "No assets found."
              : "No equipment has been assigned to your account yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Serial Number</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Assigned To</th>

                  {isAdmin && (
                    <th className="px-6 py-4">Action</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {asset.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {asset.serialNumber}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {asset.categoryName}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          asset.status === "AVAILABLE"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {asset.assignedToUsername || "Not assigned"}
                    </td>

                    {isAdmin && (
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(asset.id)}
                          disabled={deleteMutation.isPending}
                          className="font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === asset.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t px-6 py-4 text-xs text-gray-500">
          Showing {filteredAssets.length} assets
        </div>
      </section>
    </div>
  );
}


