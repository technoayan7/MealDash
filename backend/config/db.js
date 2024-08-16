import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ayanahmad7052:ayan4896@cluster0.zzfqxpy.mongodb.net/food-del');
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
};
