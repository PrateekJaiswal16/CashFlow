import Transaction from "../models/transaction.model.js";
import { subDays } from 'date-fns';
import redisClient from "../lib/redisClient.js";

// Helper function to clear all cache for a specific user
const clearUserCache = async (userId) => {

    console.log(userId);
    if (!redisClient.isReady) return;
    
    const keys = await redisClient.keys(`cache:${userId}:*`);
    if (keys.length > 0) {
        console.log(`CACHE INVALIDATION: Deleting ${keys.length} keys for user ${userId}`);
        await redisClient.del(keys);
    }
};

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, description, category, date, receiptUrl} = req.body;

    const transaction = await Transaction.create({
      type,
      amount,
      description,
      category,
      date,
      receiptUrl,
      userId: req.userId,
    });

    console.log(req.userId)

    await clearUserCache(req.userId);

    res.status(201).json({ message: "Transaction created", transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        //dynamic query object based on filters
        const query = { userId: req.userId };
        
        if (req.query.type) {
            query.type = req.query.type;
        }
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Fetch data and total count using the same query
        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
            
        const totalTransactions = await Transaction.countDocuments(query);

        res.status(200).json({
            transactions,
            totalPages: Math.ceil(totalTransactions / limit),
            currentPage: page,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await clearUserCache(req.userId)

    res.json({ message: "Transaction updated", transaction: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Transaction.findOneAndDelete({ _id: id, userId: req.userId });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await clearUserCache(req.userId)
    
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTransactionSummary = async (req, res) => {
    try {
        const { period } = req.query; // e.g., '7d', '30d', '90d'
        const userId = req.userId;

        
        let startDate = new Date();
        if (period === '7d') startDate = subDays(new Date(), 6);
        else if (period === '30d') startDate = subDays(new Date(), 29);
        else if (period === '90d') startDate = subDays(new Date(), 89);
        else startDate = new Date(0); 

        // Get daily income vs. expense for the bar chart
        const dailySummary = await Transaction.aggregate([
            { $match: { userId, date: { $gte: startDate } } },
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date",timezone: "Asia/Kolkata" } },
                income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
            }},
            { $sort: { _id: 1 } }
        ]);

        

        // Get expense breakdown for the pie chart
        const categorySummary = await Transaction.aggregate([
            { $match: { userId, type: 'expense', date: { $gte: startDate } } },
            { $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }},
            { $sort: { total: -1 } }
        ]);


        res.status(200).json({ dailySummary, categorySummary });

    } catch (err) {
        console.error("Error fetching summary:", err);
        res.status(500).json({ message: "Server error" });
    }
};
