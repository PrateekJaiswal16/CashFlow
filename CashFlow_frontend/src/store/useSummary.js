// store/useSummary.js
import { create } from 'zustand';

export const useSummaryStore = create((set) => ({
    dailySummary: [],
    categorySummary: [],
    loading: true,
    period: '7d',

    setPeriod: (period) => set({ period }),

    fetchSummary: async (apiClient, period) => {
        set({ loading: true });
        try {
            const res = await apiClient.get(`/transactions/summary?period=${period}`);
            set({
                dailySummary: res.data.dailySummary,
                categorySummary: res.data.categorySummary,
                loading: false,
            });
        } catch (error) {
            console.error("Failed to fetch summary", error);
            set({ loading: false });
        }
    },
}));