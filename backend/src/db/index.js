import mongoose from "mongoose"

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("MONGODB connected")
    } catch (error) {
        console.log("MongoDB connection failed", error)
        process.exit(1)
    }
}

export default connectDb