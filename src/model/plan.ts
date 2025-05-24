import mongoose, { Document, Schema } from "mongoose"

interface IPlanDay {
    day : number
    date : string
    activities:string[]
} 

export interface IFavPlan extends Document {
    userId : mongoose.Types.ObjectId
    title : string
    plan : IPlanDay[]
}

const planDaySchema = new Schema<IPlanDay>({
    day:{
        type:Number,
        required:true
    },
    date:{
        type :String,
        required:true
    },
    activities:[{
        type:String,
        required:true
    }]
})

const planSchema = new Schema<IFavPlan>({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        require:true
    },
    plan:[planDaySchema]
},{
timestamps:true
})

export const Plan = mongoose.model("Plan",planSchema)
