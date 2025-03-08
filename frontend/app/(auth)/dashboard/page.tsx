"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { TableDisplay } from "@/components/TableDisplay";
import { useTable } from "@/hooks/useTable";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTable } from '@/lib/api/tableApi';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const tableId = searchParams.get('tableId');
  
  const {
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
  } = useTable();

  const {
    sheetUrl,
    setSheetUrl,
    isImporting,
    handleGoogleSheetsImport
  } = useGoogleSheets();

  useEffect(() => {
    const loadTable = async () => {
      if (!tableId) return;
      
      try {
        setIsLoading(true);
        const tableData = await getTable(tableId);
        setTableName(tableData.name);
        setColumns(tableData.columns);
        setRows(tableData.rows);
      } catch (error) {
        console.error('Error loading table:', error);
        toast.error('Failed to load table');
      } finally {
        setIsLoading(false);
      }
    };

    loadTable();
  }, [tableId, setTableName, setColumns, setRows]);

  const handleSave = async () => {
    try {
      await handleSaveTable();
      // Clear the table data after successful save
      setTableName("");
      setColumns([]);
      setRows([]);
      setNewColumn({ name: "", type: "text" });
      // Show success message
      toast.success('Table saved successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to save table. Please try again.');
      } else {
        toast.error('An unknown error occurred. Please try again.');
      }
    }
  };

  const handleImport = async () => {
    try {
      const importedTable = await handleGoogleSheetsImport(tableName);
      if (importedTable) {
        setColumns(importedTable.columns);
        setRows(importedTable.rows);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to import from google sheets.');
      } else {
        toast.error('An unknown error occurred. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">

      {columns.length === 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8 py-6">
                  Create New Table
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Table</DialogTitle>
                </DialogHeader>

                <div className="mb-4">
                  <Input
                    placeholder="Enter Table Name"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Column Name"
                    value={newColumn.name}
                    onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                  />
                  <Select 
                    onValueChange={(val) => setNewColumn({ ...newColumn, type: val })} 
                    value={newColumn.type}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addColumn}>Add</Button>
                </div>

                {columns.length > 0 && (
                  <div className="mt-2">
                    <h3 className="font-semibold">Columns:</h3>
                    <ul className="list-disc pl-5">
                      {columns.map((col, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          {col.name} ({col.type})
                          <Button
                            variant="destructive"
                            size="sm"
                            className="ml-2"
                            onClick={() => deleteColumn(idx)}
                          >
                            Delete
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700"
                >
                  Connect Google Sheets
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect Google Sheets</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tableName" className="block text-sm font-medium text-gray-700 mb-1">
                      Table Name
                    </label>
                    <Input
                      id="tableName"
                      placeholder="Enter Table Name"
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                      className="w-full mb-4"
                    />
                  </div>
                  <div>
                    <label htmlFor="sheetUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Google Sheet URL
                    </label>
                    <Input
                      id="sheetUrl"
                      placeholder="Paste Google Sheets URL here"
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleImport}
                      disabled={isImporting || !sheetUrl.trim() || !tableName.trim()}
                    >
                      {isImporting ? 'Importing...' : 'Import Sheet'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-500 mt-4">
            Create a new table or import from Google Sheets
          </p>
        </div>
      ) : (
        <>
          <TableDisplay
            tableName={tableName}
            columns={columns}
            rows={rows}
            onDeleteColumn={deleteColumn}
            onDeleteRow={deleteRow}
            onCellChange={updateCellValue}
            onAddRow={addRow}
            onAddColumn={(newColumn) => {
              setColumns([...columns, newColumn]);
              // Add empty values for the new column in all existing rows
              setRows(rows.map(row => [...row, ""]));
            }}
          />
          {isTableCreated() && (
            <Button onClick={handleSave} className="mt-4">
              Save Table
            </Button>
          )}
        </>
      )}
    </div>
  );
} 