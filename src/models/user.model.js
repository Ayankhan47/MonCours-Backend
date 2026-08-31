import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    role:{
        type: String,
        enum:["student","instructor","admin"],
        default:"student"
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email already exists"]
    },
    password:{
        type:String,
        required:true
    }
})

const User = mongoose.model('User', userSchema);
export default User;