// store/useTransactionStore.js
import { create } from 'zustand';
import { showLoadingToast, showSuccessToast, showErrorToast } from '../lib/toast.jsx';

// Helper function to recalculate totals from a list of transactions of last 30 days
const calculateTotals = (dailySummary) => {
    let income = 0;
    let expenses = 0;
    dailySummary.forEach(day => {
        income += day.income;
        expenses += day.expense;
    });
    return { income, expenses };
};

export const useTransactionStore = create((set, get) => ({
   
    transactions: [],
    allTransactions: [], 
    recentTransactions: [],
    totalPages: 1,      
    currentPage: 1, 
    monthlyIncome: 0,
    monthlyExpenses: 0,
    filters: {
        type: "",
        category: "",
    },
    loading: false,
    dashboardLoading: true,
    error: null,

    setFilters: (newFilters) => {
        set(state => ({
            
            filters: { ...state.filters, ...newFilters },
            currentPage: 1, 
        }));
    },

    
    setPage: (page) => {
        set({ currentPage: page });
    },
    
    // get transaction with specific page
    getTransactions: async (apiClient) => {
        set({ loading: true });
        const { filters, currentPage } = get();

        const params = new URLSearchParams({
            page: currentPage,
            limit: 10,
            ...(filters.type && { type: filters.type }),
            ...(filters.category && { category: filters.category }),
        });
        
        try {
            const res = await apiClient.get(`/transactions?${params.toString()}`);
            set({
                transactions: res.data.transactions,
                totalPages: res.data.totalPages,
                currentPage: res.data.currentPage,
            });
        } catch (err) {
            
            console.error("Failed to get transaction", err);
        } finally {
            set({ loading: false });
        }
    },

    fetchDashboardSummary: async (apiClient) => {
        set({ dashboardLoading: true });
        try {
            const res = await apiClient.get('/transactions/summary?period=30d');
            const { income, expenses } = calculateTotals(res.data.dailySummary);
            set({ monthlyIncome: income, monthlyExpenses: expenses });
        } catch (error) {
            console.error("Failed to fetch dashboard summary", error);
        } finally {
            set({ dashboardLoading: false }); 
        }
    },
    
    fetchRecentTransactions: async (apiClient) => {
        set({ dashboardLoading: true }); 
        try {
            const res = await apiClient.get('/transactions?page=1&limit=5');
            set({ recentTransactions: res.data.transactions });
        } catch (err) {
            console.error("Failed to fetch recent transactions", err);
        } finally {
            set({ dashboardLoading: false }); 
        }
    },

    deleteTransaction: async (apiClient, transactionId) => {
        const toastId = showLoadingToast("Deleting transaction...");
        try {
            await apiClient.delete(`/transactions/${transactionId}`);
            showSuccessToast("Transaction Deleted!", toastId);
            get().getTransactions(apiClient, { page: get().currentPage });
            get().fetchRecentTransactions(apiClient)
            get().fetchDashboardSummary(apiClient)
        } catch (error) {
            showErrorToast(error);
            console.error("Failed to delete transaction", error);
        }
    },

    addTransaction: async (apiClient, transactionData) => {
        const toastId = showLoadingToast("Adding transaction...");
        
        const promise = apiClient.post("/transactions", transactionData);

        try {
            
            await promise;
            showSuccessToast("Transaction added!", toastId);
            // On success, re-fetch all data to ensure consistency.
            // We re-fetch the currentPage the user is currently on.
            await Promise.all([
                get().getTransactions(apiClient, { page: 1 }), 
                get().fetchRecentTransactions(apiClient),
                get().fetchDashboardSummary(apiClient)
            ]);

        } catch (error) {
            showErrorToast(error);
            console.error(error);
        }
    },

    updateTransaction: async (apiClient, transactionId, updatedData) => {
        const toastId = showLoadingToast("Transaction Updating..");

        const promise = apiClient.put(`/transactions/${transactionId}`, updatedData);
        try {
            await promise;
            showSuccessToast("Transaction Updated!", toastId);
            // On success, re-fetch all data to ensure consistency.
            // We re-fetch the currentPage the user is currently on.
            await Promise.all([
                get().getTransactions(apiClient, { page: get().currentPage }),
                get().fetchRecentTransactions(apiClient),
                get().fetchDashboardSummary(apiClient)
            ]);
        } catch (error) {
            showErrorToast(error);
            console.error(error);
        }
    },
}));