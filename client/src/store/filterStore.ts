import { create } from 'zustand';

interface FilterState {
  hostFilter: string;
  typeFilter: string;
  sortBy: 'latest' | 'popular' | 'trending';
  setHostFilter: (filter: string) => void;
  setTypeFilter: (filter: string) => void;
  setSortBy: (sort: 'latest' | 'popular' | 'trending') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  hostFilter: '',
  typeFilter: '',
  sortBy: 'latest',
  setHostFilter: (filter) => set({ hostFilter: filter }),
  setTypeFilter: (filter) => set({ typeFilter: filter }),
  setSortBy: (sort) => set({ sortBy: sort }),
  resetFilters: () => set({ hostFilter: '', typeFilter: '', sortBy: 'latest' }),
}));
