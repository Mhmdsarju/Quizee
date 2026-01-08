import api from "./axios";

export const getAllCategories=()=>api.get("/api/admin/categories");
export const createCategories=(data)=>api.post("/api/admin/categories",data);
export const updateCategories=(id,data)=>api.patch(`/api/admin/categories/${id}`,data);
export const deleteCategories=()=>api.patch(`/api/admin/categories/${id}/status`);