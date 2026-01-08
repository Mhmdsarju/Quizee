import { statusCode } from "../../constant/constants.js";
import categoryModel from "../../models/categoryModel.js";
import { createCategoryService, deleteCategoryService, updateCategoryService } from "../../services/categoryService.js";
import { paginateAndSearch } from "../../utils/paginateAndSearch.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await createCategoryService(name);
    res.status(statusCode.CREATED).json(category);
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ message: error.message });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const result = await paginateAndSearch({
      model: categoryModel,
      search,
      searchFields: ["name"], 
      page: Number(page),
      limit: Number(limit),
    });

    res.json(result);
  } catch (error) {
    console.error("ADMIN CATEGORY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};


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