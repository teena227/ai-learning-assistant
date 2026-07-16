import User from  "../models/User.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        
        if(!name|| !email || !password){
            return res.status(400).json({message:"ALL FIELDS ARE REQUIRED"})
        }
        if(password.length<6){
            return res.status(400).json({message:"PASSWORD MUST BE ATLEAST OF 6 CHARACTER"})
        }
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"USER ALREADY EXISTS"})
        }
        const hassedPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            name,
            email,
            password:hassedPassword,
        });
           const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };
    export const loginUser=async(req,res)=>{
        try{
             const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
         const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

        

    