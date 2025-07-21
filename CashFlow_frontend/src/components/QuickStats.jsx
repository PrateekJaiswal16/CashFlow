// components/QuickStats.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Receipt, Wallet,Pencil } from "lucide-react";

export default function QuickStats({ budget, income, expenses,onSetBudgetClick }) {
    
    const stats = [
        { title: "Your Budget", value: `₹${budget.amount}`, icon: <Target className="h-5 w-5" />, color: "from-purple-500 to-purple-600",isDefault: budget.isDefault, },
        { title: "Monthly Income", value: `₹${income.toLocaleString()}`, icon: <TrendingUp className="h-5 w-5" />, color: "from-blue-500 to-blue-600" },
        { title: "Monthly Expenses", value: `₹${expenses.toLocaleString()}`, icon: <Receipt className="h-5 w-5" />, color: "from-red-500 to-red-600" },
        { title: "Net Balance", value: `₹${(income - expenses).toLocaleString()}`, icon: <Wallet className="h-5 w-5" />, color: "from-green-500 to-green-600" },
    ];

    return (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <Card key={index} className="border-slate-200">
                    <CardContent className="flex justify-between items-center p-3">
                        <div className={`bg-gradient-to-r ${stat.color} text-white p-2 rounded-lg`}>{stat.icon}</div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                            <p className="text-xs text-slate-600">{stat.title}</p>
                        </div>
                    </CardContent>
                    
                    {stat.title === "Your Budget" && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={onSetBudgetClick}
                        >
                            <Pencil className="h-3 w-3 text-slate-500" />
                        </Button>
                    )}
                </Card>
            ))}
        </div>
    );
}