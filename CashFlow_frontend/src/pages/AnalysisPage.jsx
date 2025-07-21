import { useEffect, useState } from 'react';
import { useApiClient } from '../lib/apiClient';
import { useTransactionStore } from '../store/useTransactionStore';
import { useSummaryStore } from '../store/useSummary';
import { TransactionTable } from '@/components/TransactionTable';
import { IncomeExpenseChart, ExpensePieChart } from '@/components/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import TransactionDialog from '../components/TransactionDialog';

const AnalysisPage = () => {
    const apiClient = useApiClient();
    
    // State and actions from stores
    const { getTransactions } = useTransactionStore();
    const { 
        dailySummary, 
        categorySummary, 
        period, 
        setPeriod, 
        fetchSummary, 
        loading: summaryLoading 
    } = useSummaryStore();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);

    //Fetch data for the paginated table ONCE on mount.
    useEffect(() => {
        getTransactions(apiClient);
    }, [getTransactions, apiClient]);
    
    //Fetch data for the charts, and re-fetch ONLY when the period changes.
    useEffect(() => {
        fetchSummary(apiClient, period);
    }, [period, fetchSummary, apiClient]);

    const handleEdit = (transaction) => {
        setTransactionToEdit(transaction);
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setTransactionToEdit(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold">Financial Analysis</h1>
                    <p className="text-slate-500">An overview of your spending habits.</p>
                </div>
                
                <ToggleGroup 
                    type="single" 
                    value={period} 
                    onValueChange={(value) => value && setPeriod(value)} 
                    defaultValue="all"
                >
                    <ToggleGroupItem value="7d">7 Days</ToggleGroupItem>
                    <ToggleGroupItem value="30d">30 Days</ToggleGroupItem>
                    <ToggleGroupItem value="90d">3 Months</ToggleGroupItem>
                    <ToggleGroupItem value="all">All Time</ToggleGroupItem>
                </ToggleGroup>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Income vs. Expenses</CardTitle></CardHeader>
                    <CardContent>
                        {summaryLoading 
                            ? <div className="h-[300px] flex justify-center items-center">Loading Chart...</div> 
                            : <IncomeExpenseChart data={dailySummary} />
                        }
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Category Expense Breakdown</CardTitle></CardHeader>
                    <CardContent>
                        {summaryLoading 
                            ? <div className="h-[300px] flex justify-center items-center">Loading Chart...</div> 
                            : <ExpensePieChart data={categorySummary} />
                        }
                    </CardContent>
                </Card>
            </div>
            
            {/* DATA TABLE SECTION */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionTable onEdit={handleEdit} />
                </CardContent>
            </Card>

            {isDialogOpen && (
                <TransactionDialog 
                    open={isDialogOpen} 
                    onClose={handleClose}
                    transactionToEdit={transactionToEdit}
                />
            )}
        </div>
    );
};

export default AnalysisPage;