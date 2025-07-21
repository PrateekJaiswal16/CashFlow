import { useState } from 'react';
import BudgetDialog from './BudgetForm';
import { Plus } from 'lucide-react';

export default function SetBudgetScreen() {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
            <button
                onClick={() => setDialogOpen(true)}
                className="flex flex-col justify-center items-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition-transform"
            >
                <Plus className="w-12 h-12" />
            </button>
            <p className="mt-4 text-slate-600">Click to set your monthly budget</p>

            {dialogOpen && (
                <BudgetDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                />
            )}
        </div>
    );
}