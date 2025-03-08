import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface Column {
  name: string;
  type: string;
}

interface TableDisplayProps {
  tableName: string;
  columns: Column[];
  rows: string[][];
  onDeleteColumn: (index: number) => void;
  onDeleteRow: (index: number) => void;
  onCellChange: (rowIndex: number, colIndex: number, value: string) => void;
  onAddRow: () => void;
  onAddColumn: (column: Column) => void;
}

export function TableDisplay({
  tableName,
  columns,
  rows,
  onDeleteColumn,
  onDeleteRow,
  onCellChange,
  onAddRow,
  onAddColumn
}: TableDisplayProps) {
  const [newColumn, setNewColumn] = useState<Column>({ name: "", type: "text" });

  const handleAddColumn = () => {
    if (newColumn.name.trim()) {
      onAddColumn(newColumn);
      setNewColumn({ name: "", type: "text" });
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{tableName}</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add Column</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Column</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2">
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
                <Button onClick={handleAddColumn}>Add</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={onAddRow}>Add Row</Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-2 text-left border-b">
                  <div className="flex justify-between items-center">
                    <span>{col.name} ({col.type})</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 text-red-600 hover:text-red-800"
                      onClick={() => onDeleteColumn(idx)}
                    >
                      ×
                    </Button>
                  </div>
                </th>
              ))}
              <th className="px-4 py-2 border-b w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b last:border-b-0">
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="px-4 py-2">
                    <Input
                      value={cell}
                      onChange={(e) => onCellChange(rowIdx, colIdx, e.target.value)}
                    />
                  </td>
                ))}
                <td className="px-4 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => onDeleteRow(rowIdx)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 