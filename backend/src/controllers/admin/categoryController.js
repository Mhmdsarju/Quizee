import { statusCode } from "../../constant/constants.js";
import { createCategoryService, deleteCategoryService, getAllCategoryService, updateCategoryService } from "../../services/categoryService.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await createCategoryService(name);
    res.status(statusCode.CREATED).json(category);
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ message: error.message });
  }
};

export const getAllCategory=async(req,res)=>{
    try {
        const category = await getAllCategoryService();
        res.status(statusCode.OK).json(category);
    } catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({message:error.message});
    }
}


export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await updateCategoryService(req.params.id, name);
    res.json(category);
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await deleteCategoryService(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ message: error.message });
  }
};