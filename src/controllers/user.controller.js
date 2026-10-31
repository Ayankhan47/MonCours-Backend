import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res, next) => {
    try{
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        const isUserExist = await userModel.findOne({ email: req.body.email });
        if(isUserExist){
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const user = await userModel.create({
            name: req.body.name,
            role: req.body.role,
            email: req.body.email,
            password: hashedPassword,

        })
        const token = generateToken(user);
        res.cookie("token", token);
        res.status(201).json({
            message: "User registered successfully",
            data: user,
            token: token
        })
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    try{
        const user = await userModel.findOne({ email: req.body.email });
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }else{
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            if(!isPasswordValid){
                return res.status(401).json({
                    message: "Invalid password"
                })
            }else{
                const token = generateToken(user);
                res.cookie("token", token);
                res.status(200).json({
                    message: "login successful",
                    data: user,
                    token: token
                })
            }
        }
    }catch(error){
        next(error);
    }
}

export const getProfile = async (req, res, next) =>{
    try{

        const user = await userModel.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        res.status(200).json({
            message:"authorized User!",
            user: user
        })
    }catch(error){
        next(error);
    }
}