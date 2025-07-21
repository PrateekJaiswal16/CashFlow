// backend/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { subDays } from "date-fns";
import Transaction from "./models/transaction.model.js";

dotenv.config();

// ✅ PASTE YOUR CLERK USER ID HERE
const USER_ID = "user_306ISanmgBFyhk4N6day7ZffdSn";

// ✅ --- CATEGORIES UPDATED AS PER YOUR REQUEST --- ✅
const CATEGORIES = {
    income: [
        { name: "salary", range: [5000, 8000] },
        { name: "freelance", range: [500, 3000] },
        { name: "investment", range: [100, 2500] },
        { name: "bonus", range: [2000, 10000] },
        { name: "other", range: [50, 500] },
    ],
    expense: [
        { name: "food", range: [20, 150] },
        { name: "transportation", range: [50, 400] },
        { name: "housing", range: [1000, 2500] },
        { name: "bills", range: [100, 500] },
        { name: "entertainment", range: [30, 200] },
        { name: "health", range: [50, 1000] },
        { name: "shopping", range: [50, 700] },
        { name: "other", range: [20, 200] },
    ],
};
// ✅ --- END OF UPDATED CATEGORIES --- ✅

function getRandomAmount(min, max) {
    return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type) {
    const categories = CATEGORIES[type];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = getRandomAmount(category.range[0], category.range[1]);
    return { category: category.name, amount };
}

const seedTransactions = async () => {
    // if (USER_ID === "user_306ISanmgBFyhk4N6day7ZffdSn") {
    //     console.error("❌ Please replace the placeholder USER_ID in the script.");
    //     return;
    // }
    
    try {
        console.log("🌱 Connecting to database...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Database connected.");

        console.log(`🗑️ Deleting existing transactions for user: ${USER_ID}...`);
        const { deletedCount } = await Transaction.deleteMany({ userId: USER_ID });
        console.log(`✅ Deleted ${deletedCount} transactions.`);

        console.log("⚙️ Generating new transaction data...");
        const transactionsToCreate = [];
        for (let i = 90; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const transactionsPerDay = Math.floor(Math.random() * 4) + 1;

            for (let j = 0; j < transactionsPerDay; j++) {
                const type = Math.random() < 0.3 ? "income" : "expense";
                const { category, amount } = getRandomCategory(type);
                
                transactionsToCreate.push({
                    type,
                    amount,
                    description: `${type === "income" ? "Received" : "Paid for"} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                    date,
                    category,
                    userId: USER_ID,
                });
            }
        }
        console.log(`✅ Generated ${transactionsToCreate.length} new transactions.`);

        console.log("💾 Inserting new transactions into the database...");
        await Transaction.insertMany(transactionsToCreate);
        console.log("🎉 Seeding complete!");

    } catch (error) {
        console.error("❌ Error during seeding process:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Database disconnected.");
    }
};

seedTransactions();