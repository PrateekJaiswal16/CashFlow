import { useEffect } from 'react';
import { useApiClient } from '../lib/apiClient';
import { useBudgetStore } from '../store/useBudgetStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { useSummaryStore } from '../store/useSummary';

export const useHomePageData = () => {
    const apiClient = useApiClient();
    const { getBudget, budget, loading: budgetLoading } = useBudgetStore();
    const { recentTransactions, fetchRecentTransactions,fetchDashboardSummary, monthlyIncome, monthlyExpenses, loading: transactionsLoading } = useTransactionStore();
    const { categorySummary } = useSummaryStore();

    // This effect handles all initial data fetching for the homepage
    useEffect(() => {
        getBudget(apiClient);
        fetchRecentTransactions(apiClient);
        fetchDashboardSummary(apiClient);
    }, [getBudget, fetchRecentTransactions, fetchDashboardSummary, apiClient]);

    const isLoading = budgetLoading || transactionsLoading

    // Return all the data and loading states the page needs
    return {
        isLoading,
        budget,
        monthlyIncome,
        monthlyExpenses,
        recentTransactions,
        categorySummary
    };
};