// // components/TransactionTable.jsx
import { useState, useEffect } from "react";
import { useApiClient } from "@/lib/apiClient";
import { useTransactionStore } from "@/store/useTransactionStore";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Pencil, X, ChevronUp, ChevronDown } from "lucide-react";


const categories = {
    income: ["Salary", "Freelance", "Investment", "Bonus", "Other"],
    expense: ["Food", "Transportation", "Housing", "Bills", "Entertainment", "Health", "Shopping", "Other"],
};

export function TransactionTable({ onEdit }) {
    const apiClient = useApiClient();
    const { 
        transactions, getTransactions, deleteTransaction, setFilters, setPage,
        loading, totalPages, currentPage, filters 
    } = useTransactionStore();

    const [localSearch, setLocalSearch] = useState(filters.search)

    useEffect(() => {
        getTransactions(apiClient);
    }, [currentPage, filters, getTransactions, apiClient]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localSearch !== filters.search) {
                setFilters({ search: localSearch });
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [localSearch, filters.search, setFilters]);
    

    const handleFilterChange = (key, value) => {
        const newFilters = { [key]: value };
        // If the user changes the type, we should reset the category
        if (key === 'type') {
            newFilters.category = '';
        }
        setFilters(newFilters);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleDeleteRow = (id) => {
        if (window.confirm("Are you sure?")) {
            deleteTransaction(apiClient, id);
        }
    };
    
    return (
        <div className="space-y-4">
            {/* Filter Controls */}
            <div className="flex flex-col justify-center sm:flex-row gap-2">
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                    <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)} disabled={!filters.type}>
                    <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
                    <SelectContent>
                        {filters.type && categories[filters.type].map(cat => (
                            <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* ✅ A SINGLE CLEAR BUTTON */}
                {(filters.type || filters.category || filters.search) && (
                    <Button variant="ghost" onClick={() => {
                        setFilters({ type: '', category: '', search: '' });
                        setLocalSearch('');
                    }}>
                        <X className="h-4 w-4 mr-2" /> Clear Filters
                    </Button>
                )}
            </div>
            
            <div className="rounded-md border">
                <Table>
                    
                    <TableHeader>
                         <TableRow>
                             <TableHead className="cursor-pointer" >
                                 <div className="flex items-center">Date </div>
                             </TableHead>
                             <TableHead>Description</TableHead>
                             <TableHead>Category</TableHead>
                             <TableHead className="text-right cursor-pointer" >
                                 <div className="flex items-center justify-end">Amount </div>
                             </TableHead>
                             <TableHead className="w-[50px] text-center">Actions</TableHead>
                         </TableRow>
                     </TableHeader>
                    <TableBody>
                        {loading && <TableRow><TableCell colSpan={5} className="text-center h-24">Loading...</TableCell></TableRow>}
                        {!loading && transactions.length === 0 && <TableRow><TableCell colSpan={5} className="text-center h-24">No transactions found.</TableCell></TableRow>}
                        {!loading && transactions.map((t) => (
                            <TableRow key={t._id}>
                                <TableCell>{format(new Date(t.date), "PP")}</TableCell>
                                <TableCell className="font-medium">{t.description}</TableCell>
                                <TableCell className="capitalize">{t.category}</TableCell>
                                <TableCell className={`text-right font-medium ${t.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                                    {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onEdit(t)}>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteRow(t._id)}>
                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 py-4">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>Previous</Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</Button>
                </div>
            )}
        </div>
    );
}
