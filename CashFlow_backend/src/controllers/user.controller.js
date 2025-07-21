import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
    try {
        const { email, name, imageUrl } = req.body;
        const clerkUserId = req.userId; 

        if (!clerkUserId) {
			return res.status(400).json({ message: "Missing clerkUserId" });
		} 

        const user = await User.findOne({ clerkUserId });
        if (user) {
			
			if (!user.clerkUserId) {
				user.clerkUserId = clerkUserId;
				await user.save();
			}
			return res.status(200).json({ message: "User already exists", user });
		} 
        await User.create({
            clerkUserId,
            email,
            name,
            imageUrl,
        });


        const newUser = await User.findOne({ clerkUserId });
        res.status(201).json({ message: "User registered successfully.", user: newUser });

    } catch (error) {
       
        if (error.code === 11000) {
            console.log("Caught duplicate key error in race condition. User was already created.");
            const user = await User.findOne({ clerkUserId: req.userId });
            return res.status(200).json({ message: "User already registered.", user });
        }
        
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
};