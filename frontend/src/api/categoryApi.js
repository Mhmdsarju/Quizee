import api from "./axios";

export const getAllCategories=()=>api.get("/admin/categories");
export const createCategories=(data)=>api.post("/admin/categories",data);
export const updateCategories=(id,data)=>api.patch(`/admin/categories/${id}`,data);
export const deleteCategories=(id)=>api.patch(`/admin/categories/${id}/status`);