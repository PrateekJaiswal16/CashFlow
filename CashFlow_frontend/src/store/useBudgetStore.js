// store/useBudgetStore.js
import { create } from 'zustand';
import { showLoadingToast, showSuccessToast, showErrorToast } from '../lib/toast.jsx';

export const useBudgetStore = create((set) => ({
    // State
    budget: null,
    loading: false,
    error: null,

    // Actions
    getBudget: async (apiClient) => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get("/budgets");
            set({ budget: res.data, loading: false });
        } catch (err) {
            showErrorToast(err);
            set({ error: err?.response?.data?.message || err.message, loading: false });
        }
    },
    
    saveBudget: async (apiClient, amount) => {
        set({ loading: true, error: null });
        const toastId = showLoadingToast("Updating Budget...");
        try {
            const res = await apiClient.post("/budgets", { amount });
            set({ budget: res.data.budget, loading: false });
            showSuccessToast("Budget saved successfully!", toastId);
            
        } catch (err) {
            showErrorToast(err);
            set({ error: err?.response?.data?.message || err.message, loading: false });
        }
    },
}));