import express from "express";
import dotenv from "dotenv";
dotenv.config()
import cors from "cors"

import path from "path"

import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import receiptRoute from "./routes/receiptRoutes.js";

import { connectDB } from "./lib/db.js";

const app=express()

const PORT=process.env.PORT
const __dirname = path.resolve();

app.use(express.json())
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
    }
))


app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/receipts", receiptRoute);


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
}

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
    connectDB();
})