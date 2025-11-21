import api from "../../api/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";




export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (params: { page: number; limit: number; sortField: string; sortOrder: string }) => {
    const { page, limit, sortField, sortOrder } = params;

    const res = await api.get(
      `/products?page=${page}&limit=${limit}&sort=${sortField}&order=${sortOrder}`
    );

    return res.data; // <-- IMPORTANT
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async ({ data }: { data: any }) => {
    const res = await api.post("/products", data);
    return res.data; // return new product
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }: { id: string; data: any }) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string) => {
    await api.delete(`/products/${id}`);
    return { id };
  }
);
