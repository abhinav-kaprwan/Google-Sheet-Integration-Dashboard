import { useState } from 'react';
import axios from 'axios';

export function useGoogleSheets() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const handleGoogleSheetsImport = async (tableName: string) => {
    try {
      setIsImporting(true);
      const sheetId = sheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      
      if (!sheetId) {
        throw new Error('Please enter a valid Google Sheets URL');
      }

      if (!tableName.trim()) {
        throw new Error('Please enter a table name');
      }

      // Make API call to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tables/fetch-google-sheet-data`,
        { 
          sheetId,
          tableName 
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        // Return the imported table data
        return response.data;
      }
      
    } catch (error: any) {
      console.error('Error importing from Google Sheets:', error);
      throw new Error(error.response?.data?.message || 'Failed to import from Google Sheets');
    } finally {
      setIsImporting(false);
      setSheetUrl('');
    }
  };

  return {
    sheetUrl,
    setSheetUrl,
    isImporting,
    handleGoogleSheetsImport
  };
} 