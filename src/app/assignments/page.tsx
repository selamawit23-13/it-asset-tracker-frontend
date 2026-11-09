"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  getAssets,
  getEmployees,
  assignAsset,
  returnAsset,
  type Asset,
  type Employee,
} from "@/services/assetService";

export default function AssignmentsPage() {
  const [role, setRole] = useState("");
  const [roleLoaded, setRoleLoaded] = useState(false);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [assetId, setAssetId] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [returningId, setReturningId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN";

  // Check the logged-in user's role.
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

  // Load assignment information only for Admin.
  const loadData = useCallback(async () => {
    if (!isAdmin) return;

    setLoading(true);
    setError("");

    try {
      const [assetData, employeeData] = await Promise.all([
        getAssets(),
        getEmployees(),
      ]);

      setAssets(assetData);
      setEmployees(employeeData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load assignment data."
      );
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Load data after the user's role has been checked.
  useEffect(() => {
    if (!roleLoaded || !isAdmin) return;

    let active = true;

    Promise.resolve().then(() => {
      if (active) {
        void loadData();
      }
    });

    return () => {
      active = false;
    };
  }, [roleLoaded, isAdmin, loadData]);

  // Assign an asset.
  async function handleAssign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!assetId || !employeeId) {
      setError("Please select both an asset and an employee.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await assignAsset(Number(assetId), Number(employeeId));

      setAssetId("");
      setEmployeeId("");
      setMessage("Asset assigned successfully.");

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not assign asset."
      );
    } finally {
      setSaving(false);
    }
  }

  // Return an assigned asset.
  async function handleReturn(id: number) {
    if (returningId !== null) return;

    if (!window.confirm("Confirm that this asset is being returned?")) {
      return;
    }

    setReturningId(id);
    setError("");
    setMessage("");

    try {
      await returnAsset(id);

      setMessage("Asset returned successfully.");

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not return asset."
      );
    } finally {
      setReturningId(null);
    }
  }

  const availableAssets = assets.filter(
    (asset) => asset.status === "AVAILABLE"
  );

  const assignedAssets = assets.filter(
    (asset) => asset.status === "ASSIGNED"
  );

  const staffEmployees = employees.filter(
    (employee) => employee.role === "ROLE_STAFF"
  );

  // Check permissions before rendering the page.
  if (!roleLoaded) {
    return (
      <p className="p-6 text-gray-500">
        Checking account permissions...
      </p>
    );
  }

  // Staff cannot access assignment management.
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#17233f]">
            Assignments
          </h1>

          <p className="mt-1 text-gray-500">
            Asset assignment management
          </p>
        </div>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-lg font-semibold text-blue-900">
            Administrator Permission Required
          </h2>

          <p className="mt-2 text-sm text-blue-800">
            You do not have permission to manage asset
            assignments. Only administrators can assign
            equipment to employees and manage returns.
          </p>
        </section>
      </div>
    );
  }

  // Admin assignment management page.
  return (
    <div className="space-y-6">
      {/* PAGE HEADING */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17233f]">
            Assignments
          </h1>

          <p className="mt-1 text-gray-500">
            Assign IT equipment to employees and manage returns.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading || saving || returningId !== null}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* ASSIGN AN ASSET */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          Assign an Asset
        </h2>

        <form
          onSubmit={handleAssign}
          className="grid gap-4 md:grid-cols-2"
        >
          <select
            value={assetId}
            onChange={(event) => {
              setAssetId(event.target.value);
              setError("");
              setMessage("");
            }}
            required
            disabled={saving || loading}
            aria-label="Select available asset"
            className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select available asset</option>

            {availableAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} — {asset.serialNumber}
              </option>
            ))}
          </select>

          <select
            value={employeeId}
            onChange={(event) => {
              setEmployeeId(event.target.value);
              setError("");
              setMessage("");
            }}
            required
            disabled={saving || loading}
            aria-label="Select employee"
            className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select employee</option>

            {staffEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.username}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={
              saving ||
              loading ||
              !assetId ||
              !employeeId ||
              availableAssets.length === 0 ||
              staffEmployees.length === 0
            }
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
          >
            {saving ? "Assigning..." : "Assign Asset"}
          </button>
        </form>

        {!loading && availableAssets.length === 0 && (
          <p className="mt-3 text-sm text-gray-500">
            There are no available assets to assign.
          </p>
        )}

        {!loading && staffEmployees.length === 0 && (
          <p className="mt-3 text-sm text-gray-500">
            No staff employees are available for assignment.
          </p>
        )}
      </section>

      {/* SUCCESS AND ERROR MESSAGES */}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-red-700"
        >
          {error}
        </p>
      )}

      {message && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-4 text-green-700"
        >
          {message}
        </p>
      )}

      {/* CURRENTLY ASSIGNED ASSETS */}
      <section className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">
            Currently Assigned Assets ({assignedAssets.length})
          </h2>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">
            Loading assignments...
          </p>
        ) : assignedAssets.length === 0 ? (
          <p className="p-6 text-gray-500">
            No assets are currently assigned.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Serial Number</th>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {assignedAssets.map((asset) => (
                  <tr key={asset.id} className="border-t">
                    <td className="px-6 py-4 font-medium">
                      {asset.name}
                    </td>

                    <td className="px-6 py-4">
                      {asset.serialNumber}
                    </td>

                    <td className="px-6 py-4">
                      {asset.assignedToUsername || "Unknown"}
                    </td>

                    <td className="px-6 py-4">
                      {asset.categoryName}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleReturn(asset.id)}
                        disabled={returningId !== null}
                        className="font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        {returningId === asset.id
                          ? "Returning..."
                          : "Return"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}