import categoryModel from "../models/categoryModel.js";

export const createCategoryService= async(name)=>{
 const normalizedName = name.trim().toLowerCase();

  const exists = await categoryModel.findOne({ name: normalizedName });
  if (exists) {
    throw new Error("Category already exists");
  }

  return await categoryModel.create({ name: normalizedName });
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

