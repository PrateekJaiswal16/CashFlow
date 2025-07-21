// controllers/receipt.controller.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

export const scanReceipt = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No receipt image uploaded." });
    }

    try {
        const base64Img = req.file.buffer.toString('base64');

        
        const prompt = `
            Analyze the following receipt image and extract the transaction details.
            Behave like a JSON API. Your response must be a single, clean JSON object.

            The transaction is almost always an 'expense'. Only classify it as 'income' if it explicitly says something like "refund" or "return".

            From the receipt, extract the following fields:
            1.  "type": String. Must be either "expense" or "income".
            2.  "amount": Number. The final total amount.
            3.  "description": String. The name of the store, vendor, or service.
            4.  "category": String. Choose the most appropriate category for an expense from this list: ["Food", "Transportation", "Housing", "Bills", "Entertainment", "Health", "Shopping", "Other"]. If the type is income, choose from this list: ["Salary", "Freelance", "Investment", "Bonus", "Other"].
            5.  "date": String. The date of the transaction in "YYYY-MM-DD" format.

            Example Response:
            {
              "type": "expense",
              "amount": 85.50,
              "description": "Grocery Store",
              "category": "Food",
              "date": "2025-07-19"
            }
        `;
        

        const parts = [
            { inlineData: { mimeType: req.file.mimetype, data: base64Img } },
            { text: prompt },
        ];
        
        const result = await model.generateContent({ contents: [{ parts }] });
        const extractedData = JSON.parse(result.response.text());
        
        res.status(200).json(extractedData);

    } catch (error) {
        console.error("AI receipt scanning failed:", error);
        res.status(500).json({ message: "Failed to process receipt image." });
    }
};