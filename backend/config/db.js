import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dns.setDefaultResultOrder("ipv4first");

const connectDB=async () => {
    try{
             await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected successfully');

    }catch(error){
        console.error(`Error: ${error.message}`);
    }
    
};

export default connectDB;