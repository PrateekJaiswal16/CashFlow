
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["income", "expense"],
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
		},
		category: {
			type: String,
			required: true, 
		},
		date: {
			type: Date,
			required: true,
		},
		receiptUrl: {
			type: String,
		},
		
		userId: {
			type: String, 
            ref: "User", 
            required: true,
		}
	},
	{
		timestamps: true,
	}
);
const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;

