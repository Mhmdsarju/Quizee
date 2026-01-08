import mongoose from "mongoose";

const categorySchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase: true,
    },
    isActive:{
        type:Boolean,
        default:true,
    }
},
{timestamps:true}
);


const categoryModel=mongoose.model("Category",categorySchema);

export default categoryModel;