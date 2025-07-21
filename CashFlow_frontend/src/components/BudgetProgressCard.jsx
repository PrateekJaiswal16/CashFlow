import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function BudgetProgressCard({ budget, monthlyExpenses }) {
    // This logic now lives inside the component that needs it
    const budgetProgress = useMemo(() => {
        if (!budget || !budget.amount || budget.amount === 0) return 0;
        const percentage = (monthlyExpenses / budget.amount) * 100;
        return Math.min(Math.round(percentage), 100); // Cap at 100 for the progress bar
    }, [monthlyExpenses, budget]);

    return (
        <Card className="border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Budget Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-slate-900">Total Spending</span>
                        <span className="text-xs text-slate-600">
                            ₹{monthlyExpenses.toLocaleString()}/{budget.amount ? budget.amount.toLocaleString() : 'N/A'}
                        </span>
                    </div>
                    <Progress value={budgetProgress} className="h-2" />
                    
                    {/* Dynamic message */}
                    <div className="text-xs text-right mt-1 h-4"> {/* Added h-4 for consistent height */}
                        {budgetProgress >= 100 && (
                            <span className="text-red-600 font-medium">
                                Warning: Budget exceeded!
                            </span>
                        )}
                        {budgetProgress >= 80 && budgetProgress < 100 && (
                            <span className="text-orange-500 font-medium">
                                Nearing your limit. Save now!
                            </span>
                        )}
                        {budgetProgress < 80 && (
                            <span className="text-green-600 font-medium">
                                You're on track. Keep it up!
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}