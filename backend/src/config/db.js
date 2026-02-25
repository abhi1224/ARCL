import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log('MongoDB Connected Successfully !'); 
        // console.log(`${process.env.MONGO_URI}/${DB_NAME}`);
               
    }
    catch(error){
        console.log(`Error: ${error.message}`)      
        throw error
    }

}