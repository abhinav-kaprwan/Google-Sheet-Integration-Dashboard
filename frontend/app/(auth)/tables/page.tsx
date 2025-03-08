"use client";

import { useEffect, useState } from 'react';
import TableList from '@/components/TableList';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface Table {
  _id: string;
  name: string;
  columns: { name: string; type: string }[];
  rows: string[][];
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tables/user-tables`, {
        withCredentials: true
      });
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Failed to load tables');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <TableList tables={tables} onRefresh={fetchTables} />
    </div>
  );
} 