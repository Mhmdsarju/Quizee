import asyncHandler from "express-async-handler";
import { statusCode } from "../../constant/constants.js";
import categoryModel from "../../models/categoryModel.js";
import {createCategoryService,deleteCategoryService,updateCategoryService,} from "../../services/categoryService.js";
import { paginateAndSearch } from "../../utils/paginateAndSearch.js";
import AppError from "../../utils/AppError.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new AppError("Category name is required", statusCode.BAD_REQUEST);
  }

  const category = await createCategoryService(name);

  res.status(statusCode.CREATED).json(category);
});

export const getAllCategory = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  const filter = req.user?.role === "admin" ? {} : { isActive: true };

  const result = await paginateAndSearch({
    model: categoryModel,
    search,
    searchFields: ["name"],
    page: Number(page),
    limit: Number(limit),
    filter,
  });

  res.json(result);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new AppError("Category name is required", statusCode.BAD_REQUEST);
  }

  const category = await updateCategoryService(req.params.id, name);

  if (!category) {
    throw new AppError("Category not found", statusCode.NOT_FOUND);
  }

  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await deleteCategoryService(req.params.id);

  if (!category) {
    throw new AppError("Category not found", statusCode.NOT_FOUND);
  }

  res.json(category);
});
