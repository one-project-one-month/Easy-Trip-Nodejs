import { Request, Response } from "express";
import { User } from "../../../../model/user";
import { Plan } from "../../../../model/plan";

export const favPlanController = async(req:Request,res:Response)=>{
    const {userId,title,plan} = req.body

    try {
        const existingUser = await User.findById(userId)
    if(!existingUser){
        res.status(404).json({message:"User is not found"})
    }

    const newPlan = await Plan.create({
        userId,
        title,
        plan
    })

    res.status(200).json({message:"Plan saved",newPlan})
    } catch (error) {
           res.status(500).json({message:"Error saving Plan ",error})
    }

     

}

export const getFavPlan = async(req:Request,res:Response)=>{
    const {userId} = req.body
    try {
        const plan = await Plan.find({userId})
        res.status(200).json({message:"User Plan",plan})
    } catch (error) {
        console.log(error)
    }
}

export const deleteFavPlan = async(req:Request,res:Response)=>{
    const userId = req.body.userId
    const planId = req.params.id

    try {
        const deleteFavPlan = await Plan.findOneAndDelete({_id:planId,userId})
        if(!deleteFavPlan){
            res.status(400).json({message:"User and Plan not found"})
        }
        res.status(200).json({message:"delete fav plan successful"})
    } catch (error) {
        console.log(error)
    }

}


export const userRegister = async(req:Request,res:Response)=>{
    const {username,email,password} = req.body
    const existingUser = await User.findOne({email})
    if(existingUser){
        res.status(400).json({message:"Existing User"})
    }

    const user = await User.create({
        username,
        email,
        password
    })

    if(user){
        res.status(200).json({message:"register successful",user})
    }
}