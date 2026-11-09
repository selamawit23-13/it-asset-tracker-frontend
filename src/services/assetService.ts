
const API_URL = "http://localhost:8081/api";

// ---------- TYPES ----------

export interface Asset {
  id: number;
  name: string;
  serialNumber: string;
  status: "AVAILABLE" | "ASSIGNED";
  categoryId: number;
  categoryName: string;
  assignedToId: number | null;
  assignedToUsername: string | null;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  username: string;
  role: "ROLE_ADMIN" | "ROLE_STAFF";
}

// ---------- AUTHENTICATED API REQUEST ----------

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  // Check whether the user is logged in
  if (!token) {
    throw new Error("Please log in again.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Handle expired or invalid JWT token
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("loginTime");

    throw new Error(
      "Your session has expired. Please log in again."
    );
  }

  // Handle other API errors
  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Request failed with status ${response.status}`
    );
  }

  // Handle empty responses
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ---------- ASSETS ----------

// Get all registered assets (Admin and authorized users)
export function getAssets(): Promise<Asset[]> {
  return apiRequest<Asset[]>("/assets");
}

// Get assets assigned to the currently logged-in staff member
export function getMyAssets(): Promise<Asset[]> {
  return apiRequest<Asset[]>("/assets/my-assets");
}

// Create a new asset
export function createAsset(data: {
  name: string;
  serialNumber: string;
  categoryId: number;
}): Promise<Asset> {
  return apiRequest<Asset>("/assets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Delete an asset
export function deleteAsset(id: number): Promise<void> {
  return apiRequest<void>(`/assets/${id}`, {
    method: "DELETE",
  });
}

// Assign an asset to an employee
export function assignAsset(
  assetId: number,
  userId: number
): Promise<Asset> {
  return apiRequest<Asset>(
    `/assets/${assetId}/assign/${userId}`,
    {
      method: "PATCH",
    }
  );
}

// Return an assigned asset
export function returnAsset(assetId: number): Promise<Asset> {
  return apiRequest<Asset>(`/assets/${assetId}/return`, {
    method: "PATCH",
  });
}

// ---------- CATEGORIES ----------

// Get all categories
export function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/categories");
}

// Create a new category
export function createCategory(data: {
  name: string;
}): Promise<Category> {
  return apiRequest<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ---------- EMPLOYEES ----------

// Get all registered employees and system users
export function getEmployees(): Promise<Employee[]> {
  return apiRequest<Employee[]>("/users");
}
