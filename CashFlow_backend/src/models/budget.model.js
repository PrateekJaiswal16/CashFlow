    import mongoose from "mongoose";

    const budgetSchema = new mongoose.Schema(
        {
            amount: {
                type: Number,
                required: true,
            },
            userId: {
                type: String, // <- changed from ObjectId to String
                ref: "User",  // optional — you can still use `populate` with `localField/foreignField`
                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

    const Budget = mongoose.model("Budget", budgetSchema);
    export default Budget;

