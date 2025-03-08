import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteTable } from '@/lib/api/tableApi';
import { toast } from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Table {
  _id: string;
  name: string;
  columns: { name: string; type: string }[];
  rows: string[][];
}

interface TableListProps {
  tables: Table[];
  onRefresh: () => void;
}

export default function TableList({ tables, onRefresh }: TableListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);

  const handleDelete = async (tableId: string) => {
    try {
      setIsDeleting(tableId);
      await deleteTable(tableId);
      toast.success('Table deleted successfully');
      onRefresh(); // Refresh the table list
    } catch (error) {
      console.error('Error deleting table:', error);
      toast.error('Failed to delete table');
    } finally {
      setIsDeleting(null);
      setTableToDelete(null);
    }
  };

  const handleViewEdit = (tableId: string) => {
    router.push(`/dashboard?tableId=${tableId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Tables</h2>
      {tables.length === 0 ? (
        <p className="text-gray-500">No tables found. Create one to get started!</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tables.map((table) => (
            <div key={table._id} className="border rounded-lg p-4 shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-2">{table.name}</h3>
              <div className="text-sm text-gray-600 mb-4">
                <p>{table.columns.length} columns</p>
                <p>{table.rows.length} rows</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewEdit(table._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  View & Edit
                </button>
                <button
                  onClick={() => setTableToDelete(table._id)}
                  disabled={isDeleting === table._id}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:bg-red-300"
                >
                  {isDeleting === table._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!tableToDelete} onOpenChange={() => setTableToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the table and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => tableToDelete && handleDelete(tableToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 