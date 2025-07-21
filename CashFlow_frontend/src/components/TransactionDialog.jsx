// components/TransactionDialog.jsx
import { useState, useRef, useEffect } from "react";
import { useApiClient } from "@/lib/apiClient"; // 1. Import hooks
import { useTransactionStore } from "@/store/useTransactionStore";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";

const categories = {
    income: ["Salary", "Freelance", "Investment", "Bonus", "Other"],
    expense: ["Food", "Transportation", "Housing", "Bills", "Entertainment", "Health", "Shopping", "Other"],
};


export default function TransactionDialog({ open, onClose ,transactionToEdit }) {
    
    const { addTransaction,updateTransaction, loading } = useTransactionStore();
    const apiClient = useApiClient();
    const [type, setType] = useState("expense");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date());
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (transactionToEdit) {
            setType(transactionToEdit.type);
            setAmount(String(transactionToEdit.amount));
            setDescription(transactionToEdit.description);
            setCategory(transactionToEdit.category);
            setDate(new Date(transactionToEdit.date));
        }
    }, [transactionToEdit]);

    const handleReceiptUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsScanning(true);
        const formData = new FormData();
        formData.append('receipt', file);

        try {
            const res = await apiClient.post('/receipts/scan', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const data = res.data;

            // --- AUTO-FILL LOGIC --- 
            // This now populates every field from the AI response
            if (data.type) setType(data.type);
            if (data.amount) setAmount(String(data.amount));
            if (data.description) setDescription(data.description);
            // Ensure category is lowercase to match the SelectItem value
            if (data.category) setCategory(data.category.toLowerCase());
            // The date needs to be handled carefully because of timezones.
            // Adding a 'T00:00:00' ensures it's parsed as local time.
            if (data.date) setDate(new Date(`${data.date}T00:00:00`));


        } catch (error) {
            console.error("Receipt scan failed", error);
            alert("Sorry, we couldn't read the receipt. Please enter the details manually.");
        } finally {
            setIsScanning(false);
        }
    };

    
    const handleSave = async () => {
        const transactionData = {
            type,
            amount: parseFloat(amount),
            description,
            category,
            date,
        };
        
        if (transactionData.amount > 0 && transactionData.category) {
            if (transactionToEdit) {
                // We need the update action from the store
                await updateTransaction(apiClient, transactionToEdit._id, transactionData);
            } else {
                await addTransaction(apiClient, transactionData);
            }

            onClose();
        } else {
            alert("Please fill in amount and category.");
        }
    };

    const handleTypeChange = (newType) => {
        setType(newType);
        setCategory("");
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* ... Your form fields JSX remains exactly the same ... */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Tabs value={type} onValueChange={handleTypeChange} className="col-span-3">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="expense">Expense</TabsTrigger>
                                <TabsTrigger value="income">Income</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Amount */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="$0.00" className="col-span-3" />
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Groceries" className="col-span-3" />
                    </div>

                    {/* Category */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories[type].map((cat) => (
                                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className="col-span-3 font-normal justify-start">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Receipt Upload Placeholder */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Receipt</Label>

                        {/* Hidden file input controlled by the button */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleReceiptUpload}
                            className="hidden"
                            accept="image/*"
                        />
                        
                        {/* AI Scan */}
                        <Button
                            variant="outline"
                            className="col-span-3 font-normal justify-start bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                            onClick={() => fileInputRef.current.click()}
                            disabled={isScanning}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {isScanning ? "Scanning..." : "Upload Receipt"}
                        </Button>
                        
                        <div className="col-start-2 col-span-3 text-xs text-slate-500">
                            *Please confirm the details after scanning.
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    {/* 4. The save button now shows a loading state */}
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving…" : "Save Transaction"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

