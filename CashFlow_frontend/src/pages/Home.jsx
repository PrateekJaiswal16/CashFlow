import { useState } from "react";

// Import Shandcn and Lucide Components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { PieChart, Receipt, Target } from "lucide-react";
import { Loader } from 'lucide-react'

// Import Hooks and Components
import { useHomePageData } from "../hooks/useHomePageData";
import QuickStats from "../components/QuickStats";
import RecentTransactions from "../components/RecentTransactions";
import TransactionDialog from "../components/TransactionDialog";
import BudgetDialog from "../components/BudgetDialog";
import { ExpensePieChart } from "../components/Charts";
import BudgetProgressCard from "../components/BudgetProgressCard";

const HomePage = () => {
    // 1. Get all data from our custom hook
    const { isLoading, budget, monthlyIncome, monthlyExpenses, recentTransactions, categorySummary,dashboardLoading } = useHomePageData();

    // 2. State for page's UI
    const [isTransactionDialogOpen, setTransactionDialogOpen] = useState(false);
    const [isBudgetDialogOpen, setBudgetDialogOpen] = useState(false);
    const [isReportDialogOpen, setReportDialogOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);

    // 3. Handlers for UI interactions
    const handleEditTransaction = (transaction) => {
        setTransactionToEdit(transaction);
        setTransactionDialogOpen(true);
    };

    const handleAddTransaction = () => {
        setTransactionToEdit(null);
        setTransactionDialogOpen(true);
    };

    const handleCloseTransactionDialog = () => {
        setTransactionDialogOpen(false);
        setTransactionToEdit(null);
    };

    // Main loading state for the entire page
    if (isLoading || !budget || dashboardLoading) {
        return(
            <div className='flex items-center justify-center h-screen'>
            <Loader className='size-10 animate-spin'/>
            </div>)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-900">
                        Welcome to Your
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block mt-1">
                            Financial Dashboard
                        </span>
                    </h1>
                </div>

                {/* --- Section: Summary --- */}
                <h2 className="text-lg font-semibold text-slate-800 mb-3">Monthly Overview</h2>
                <QuickStats 
                    budget={budget} 
                    income={monthlyIncome} 
                    expenses={monthlyExpenses} 
                    onSetBudgetClick={() => setBudgetDialogOpen(true)} 
                />

                <div className="grid lg:grid-cols-3 gap-6 mt-6">
                    {/* --- Section: Recent Activity --- */}
                    <div className="lg:col-span-2">
                         <h2 className="text-lg font-semibold text-slate-800 mb-3">Recent Activity</h2>
                        <RecentTransactions transactions={recentTransactions} onEdit={handleEditTransaction} />
                    </div>
                    
                    {/* --- Section: Actions & Progress --- */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 mb-3">Actions & Progress</h2>
                            <div className="space-y-4">
                                <Card className="border-slate-200">
                                    <CardHeader className="pb-2"><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
                                    <CardContent className="space-y-2">
                                        <Button onClick={handleAddTransaction} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm">
                                            <Receipt className="h-4 w-4 mr-2" /> Add Transaction
                                        </Button>
                                        <Button variant="outline" className="w-full text-sm" onClick={() => setReportDialogOpen(true)}>
                                            <PieChart className="h-4 w-4 mr-2" /> View Reports
                                        </Button>
                                        <Button variant="outline" className="w-full text-sm" onClick={() => setBudgetDialogOpen(true)}>
                                            <Target className="h-4 w-4 mr-2" /> Set Budget Goals
                                        </Button>
                                    </CardContent>
                                </Card>
                                <BudgetProgressCard budget={budget} monthlyExpenses={monthlyExpenses} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Section: Dialogs --- */}
            {isTransactionDialogOpen && (
                <TransactionDialog 
                    open={isTransactionDialogOpen} 
                    onClose={handleCloseTransactionDialog}
                    transactionToEdit={transactionToEdit}
                />
            )}
            {isBudgetDialogOpen && (
                <BudgetDialog 
                    open={isBudgetDialogOpen} 
                    onClose={() => setBudgetDialogOpen(false)} 
                    initialAmount={budget?.isDefault ? '' : budget?.amount}
                />
            )}
            {isReportDialogOpen && (
                <Dialog open={isReportDialogOpen} onOpenChange={setReportDialogOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>Monthly Expense Breakdown</DialogTitle></DialogHeader>
                        <ExpensePieChart data={categorySummary} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default HomePage;