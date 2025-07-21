import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useApiClient } from "@/lib/apiClient";
import { useTransactionStore } from "@/store/useTransactionStore";


export default function RecentTransactions({ transactions, onEdit }) {
	const apiClient = useApiClient();
	const { deleteTransaction } = useTransactionStore();

	const handleDelete = (id) => {
		if (window.confirm("Are you sure you want to delete this transaction?")) {
			deleteTransaction(apiClient, id);
		}
	};

	return (
		<Card className="lg:col-span-2 border-slate-200">
			
			<CardHeader className="pb-2">
				
				<CardTitle className="text-base">Recent Transactions</CardTitle>
				
			</CardHeader>
		
			<CardContent className="space-y-2">
			
				{transactions.length === 0 ? (
					<p className="text-sm text-slate-500 py-4 text-center">
						No transactions yet.
					</p>
				) : (
					transactions.slice(0, 5).map((t) => (
						<div
							key={t._id}
							className="flex justify-between items-center bg-slate-50 p-2 rounded-md"
						>
							
							<div className="flex-1">
								
								<p className="text-sm font-medium text-slate-900">
									{t.description}
								</p>
								
								<p className="text-xs text-slate-600">
									{t.category} • {new Date(t.date).toLocaleDateString()}
								</p>
								
							</div>
							<div className="flex items-center">
								
								<span
									className={`text-sm font-semibold mr-4 ${
										t.type === "income" ? "text-green-600" : "text-red-600"
									}`}
								>
									{t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
									
								</span>
								
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" className="h-8 w-8 p-0">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>Actions</DropdownMenuLabel>
										<DropdownMenuItem onClick={() => onEdit(t)}>
											<Pencil className="mr-2 h-4 w-4" /> Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-red-500"
											onClick={() => handleDelete(t._id)}
										>
											<Trash className="mr-2 h-4 w-4" /> Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							
						</div>
					))
				)}
				
			</CardContent>
			
		</Card>
	);
}
