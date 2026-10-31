import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () =>{
    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL is not configured');
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected successfully');
}

export default connectDB;