import mongoose from 'mongoose';
import 'dotenv/config';

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const connectDB = async () => {
    if (!URI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    try {
        const instance = await mongoose.connect(`${URI}/${DB_NAME}`)
        console.log(`Connected to MongoDB at ${instance.connection.host}`);
    } catch {
        throw new Error("Database connection failed");
    }
}

export default connectDB;