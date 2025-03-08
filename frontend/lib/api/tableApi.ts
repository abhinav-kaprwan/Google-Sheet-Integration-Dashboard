import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const saveTable = async (tableName: string, columns: { name: string; type: string }[], rows: string[][] = []) => {
    if (!tableName.trim() || columns.length === 0) {
      alert("Please provide a table name and at least one column.");
      return;
    }
  
    try {
        const response = await api.post('/api/tables/create', {
            name: tableName,
            columns,
            rows
        });
  
        if (response.status === 201) {
            return response.data;
        }
        throw new Error("Failed to save table");
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "Failed to save table";
        throw new Error(message);
    }
  };

export const deleteTable = async (tableId: string) => {
    try {
        const response = await api.delete(`/api/tables/delete/${tableId}`);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error("Failed to delete table");
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "Failed to delete table";
        throw new Error(message);
    }
};

export const getTable = async (tableId: string) => {
    try {
        const response = await api.get(`/api/tables/table/${tableId}`);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error("Failed to fetch table");
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "Failed to fetch table";
        throw new Error(message);
    }
};