import Budget from "../models/budget.model.js";
import User from "../models/user.model.js";

// Set Budget
export const setBudget = async (req, res) => {
	try {
		
		const numericAmount = parseFloat(req.body.amount);
		
		if (isNaN(numericAmount) || numericAmount <= 0) {
			return res
				.status(400)
				.json({
					message: "Invalid amount provided. Amount must be a positive number.",
				});
		}

		const userExists = await User.findOne({ clerkUserId: req.userId });
		if (!userExists) {
			return res.status(404).json({ message: "User not found in DB" });
		}

		const budget = await Budget.findOneAndUpdate(
			{ userId: req.userId },
			{ amount: numericAmount },
			{ new: true, upsert: true }
		);

		res.status(201).json({ message: "Budget saved", budget });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

//Get Budget
export const getBudget = async (req, res) => {
	try {
		let budget = await Budget.findOne({ userId: req.userId }); 
		if (!budget) {
			return res.status(200).json({
				amount: 1000,
				isDefault: true, 
			});
		} 
		res.status(200).json({ amount: budget.amount, isDefault: false });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};


