import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  assetSearch: string;
  assetStatusFilter: string;

  toggleSidebar: () => void;
  setAssetSearch: (search: string) => void;
  setAssetStatusFilter: (status: string) => void;
  resetAssetFilters: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  assetSearch: "",
  assetStatusFilter: "ALL",

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  setAssetSearch: (search) =>
    set({ assetSearch: search }),

  setAssetStatusFilter: (status) =>
    set({ assetStatusFilter: status }),

  resetAssetFilters: () =>
    set({
      assetSearch: "",
      assetStatusFilter: "ALL",
    }),
}));
