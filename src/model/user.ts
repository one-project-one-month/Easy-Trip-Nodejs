import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true 
    }
},{timestamps:true})

export const User = mongoose.model("User",userSchema)
// 683136146838a3fce0bf1205
// 68313d7137f1987f55e082b2
//userId
//683117cf8695a66b66a22323