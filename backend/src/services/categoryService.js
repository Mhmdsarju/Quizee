import categoryModel from "../models/categoryModel.js";

export const createCategoryService= async(name)=>{
    const exists= await categoryModel.find({name});
    if(exists){
        throw new Error("Category alredy exists");
    }

    return await categoryModel.create({name});
}

export const getAllCategoryService=async()=>{
    return await categoryModel.find().sort({created:-1});
}

export const updateCategoryService=async(id,name)=>{
   const category=await categoryModel.findById(id);

   if(!category){
    throw new Error("category not found");
   }

   category.name=name;

   return await category.save();
}

export const deleteCategoryService=async(id)=>{
    const  category= await categoryModel.findById(id);
    if(!category){
    throw new Error("category not found");
   }

   category.isActive=!category.isActive;
   return await category.save();
}

