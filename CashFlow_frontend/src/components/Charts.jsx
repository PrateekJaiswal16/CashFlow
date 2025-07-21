
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { useMemo } from "react";
import { format } from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-sm bg-white p-2 shadow-md border">
                <p className="text-sm font-medium capitalize">{label || payload[0].name}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="text-xs capitalize">
                        {`${entry.name}: ₹${entry.value.toLocaleString()}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Income vs. Expense Chart 
export const IncomeExpenseChart = ({ data = [] }) => {
    const chartData = useMemo(() => {
        return data.map((item) => ({
            date: format(new Date(item._id), "MMM d"),
            Income: item.income,
            Expense: item.expense,
        }));
    }, [data]);
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value.toLocaleString()}`} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};


// Pie Chart with labels
export const ExpensePieChart = ({ data = [] }) => {
    const COLORS = ["#ef4444", "#3b82f6", "#8b5cf6", "#14b8a6", "#f97316", "#ec4899"];
    
    const pieData = useMemo(() => {
        return data.map((item) => ({
            name: item._id.charAt(0).toUpperCase() + item._id.slice(1), // Capitalize category
            value: item.total,
        }));
    }, [data]);

    if (pieData.length === 0) {
        return <div className="flex items-center justify-center h-[300px] text-slate-500">No expense data for this period.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    fill="#8884d8"
                    labelLine={false}
                    label={({ name, percent }) => (percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : '')}
                >
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                {/* The Tooltip and Legend will always show the name and value */}
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
