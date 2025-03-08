import { useState } from "react";

interface Column {
  name: string;
  type: string;
}

export function useTable() {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState<Column[]>([]);
  const [newColumn, setNewColumn] = useState({ name: "", type: "text" });
  const [rows, setRows] = useState<string[][]>([]);

  const addColumn = () => {
    if (newColumn.name.trim()) {
      setColumns([...columns, { ...newColumn }]);
      setNewColumn({ name: "", type: "text" });
    }
  };

  const deleteColumn = (index: number) => {
    const newColumns = columns.filter((_, i) => i !== index);
    const newRows = rows.map(row => row.filter((_, i) => i !== index));
    setColumns(newColumns);
    setRows(newRows);
  };

  const addRow = () => {
    const newRow = new Array(columns.length).fill("");
    setRows([...rows, newRow]);
  };

  const deleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateCellValue = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    if (!newRows[rowIndex]) {
      newRows[rowIndex] = new Array(columns.length).fill("");
    }
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };

  const handleSaveTable = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tables/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: tableName,
          columns,
          rows
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save table');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving table:', error);
      throw error;
    }
  };

  const isTableCreated = () => {
    return columns.length > 0;
  };

  return {
    tableName,
    setTableName,
    columns,
    setColumns,
    newColumn,
    setNewColumn,
    rows,
    setRows,
    addColumn,
    deleteColumn,
    addRow,
    deleteRow,
    handleSaveTable,
    updateCellValue,
    isTableCreated
  };
} 