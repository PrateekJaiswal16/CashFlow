import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiClient } from "@/lib/apiClient";
import { useBudgetStore } from "@/store/useBudgetStore";

export default function BudgetDialog({ open, onClose, initialAmount = "" }) {
    const apiClient = useApiClient();
    const { saveBudget, loading } = useBudgetStore(); 
    const [amount, setAmount] = useState(initialAmount);

    const handleSave = async () => {
        const value = parseFloat(amount);
        if (!isNaN(value) && value > 0) {
            await saveBudget(apiClient, value);
            onClose();
        } else {
            alert("Please enter a valid amount greater than zero.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Your Budget</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    <Label>Budget Amount</Label>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="$1000"
                    />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}