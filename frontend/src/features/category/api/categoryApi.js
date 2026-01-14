import client from "../../../api/client";

export const createCategory = async (categoryData) => {
  const response = await client.post("/categories", categoryData);
  return response.data.data;
};

export const getAllCategories = async (accountId = null) => {
  const params = accountId ? { accountId } : {};
  const response = await client.get("/categories", { params });
  return response.data.data;
};

export const getCategoryById = async (id) => {
  const response = await client.get(`/categories/${id}`);
  return response.data.data;
};

export const getCategoriesByParentId = async (parentId, accountId = null) => {
  const params = accountId ? { accountId } : {};
  const response = await client.get(`/categories/${parentId}/children`, { params });
  return response.data.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await client.put(`/categories/${id}`, categoryData);
  return response.data.data;
};

export const deleteCategory = async (id) => {
  await client.delete(`/categories/${id}`);
};
