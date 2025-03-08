import Table from "../models/Tables";
import { Request, Response } from "express";
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials
oauth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

export const createTable = async (req: Request, res: Response):Promise<void> => {
  try {
    const { name, columns, rows } = req.body;
    const userId = (req as any).user?.id;
    
    if (!name || !columns || !Array.isArray(columns)) {
       res.status(400).json({ message: "Invalid table data" });
       return;
    }

    const newTable = new Table({
      userId,
      name,
      columns,
      rows: rows || [], // Use provided rows or empty array
    });

    await newTable.save();
    res.status(201).json(newTable);
    return;
  } catch (error:any) {
    console.error('Error creating table:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
    return;
  }
};

export const getUserTables = async (req: Request, res: Response):Promise<void> => {
  try {
    const tables = await Table.find({ userId: (req as any).user?.id });
    res.status(200).json(tables);
    return;
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
    return;
  }
};

export const fetchGoogleSheetData = async (req: Request, res: Response):Promise<void> => {
  try {
    const { sheetId, tableName } = req.body;
    const userId = (req as any).user?.id;

    if (!sheetId) {
      res.status(400).json({ message: "Sheet ID is required" });
      return;
    }

    if (!tableName) {
      res.status(400).json({ message: "Table name is required" });
      return;
    }

    try {
      // Get absolute path to credentials file
      const credentialsPath = path.resolve(__dirname, '../../service-account-key.json');
      console.log('Looking for credentials file at:', credentialsPath);

      // Check if file exists
      const fs = require('fs');
      if (!fs.existsSync(credentialsPath)) {
        console.error('Credentials file not found at:', credentialsPath);
        res.status(500).json({ 
          message: "Google Sheets credentials not found",
          details: [
            "1. Make sure service-account-key.json is in the Backend folder",
            "2. Check file permissions",
            `3. Expected path: ${credentialsPath}`
          ]
        });
        return;
      }

      // Initialize auth with the required scope
      const auth = new GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
      });

      console.log('Authenticating with Google Sheets API...');

      // Initialize the Sheets API
      const sheets = google.sheets({ version: 'v4', auth });

      // Get the spreadsheet values
      console.log('Fetching sheet data for ID:', sheetId);
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'A1:ZZ', // Get all data from first sheet
        valueRenderOption: 'FORMATTED_VALUE',
        majorDimension: 'ROWS'
      });

      const sheetData = result.data.values;

      if (!sheetData || !Array.isArray(sheetData) || sheetData.length === 0) {
        res.status(400).json({ message: "No data found in sheet" });
        return;
      }

      console.log(`${sheetData.length} rows retrieved.`);

      // Extract headers (first row) as columns
      const headers = sheetData[0];
      const columns = headers.map((header: string) => ({
        name: header || 'Unnamed Column', // Provide default name for empty headers
        type: "text" // Default to text type
      }));

      // Extract data rows (excluding header row)
      const rows = sheetData.slice(1).map(row => {
        // Pad rows that are shorter than headers with empty strings
        while (row.length < headers.length) {
          row.push('');
        }
        return row;
      });

      // Create a new table with the sheet data using the provided name
      const newTable = new Table({
        userId,
        name: tableName, // Use the provided table name
        columns,
        rows
      });

      await newTable.save();
      res.status(201).json(newTable);

    } catch (error: any) {
      console.error('Google Sheets API Error:', error);
      
      if (error.code === 403) {
        res.status(403).json({ 
          message: "Access denied to Google Sheet. Please ensure:",
          details: [
            "1. Your service account credentials are properly configured",
            "2. The Google Sheets API is enabled in your Google Cloud Console",
            "3. The sheet is shared with your service account email"
          ]
        });
        return;
      }
      
      if (error.code === 404) {
        res.status(404).json({ 
          message: "Google Sheet not found. Please ensure:",
          details: [
            "1. The sheet ID is correct",
            "2. The sheet exists",
            "3. The sheet is shared with your service account email"
          ]
        });
        return;
      }

      res.status(500).json({ 
        message: "Error accessing Google Sheet",
        details: [
          "1. Verify your service account credentials are correct",
          "2. Check if the Google Sheets API is enabled",
          "3. Ensure the sheet is shared with your service account"
        ],
        error: error.message
      });
      return;
    }

  } catch (error: any) {
    console.error("Error processing Google Sheet:", error);
    res.status(500).json({ 
      message: "Failed to process sheet data",
      error: error.message,
      help: "Please check your service account credentials and sheet permissions"
    });
  }
};

export const deleteTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tableId } = req.params;
    const userId = (req as any).user?.id;

    const table = await Table.findOne({ _id: tableId, userId });
    
    if (!table) {
      res.status(404).json({ message: "Table not found" });
      return;
    }

    await Table.deleteOne({ _id: tableId, userId });
    res.status(200).json({ message: "Table deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting table:", error);
    res.status(500).json({ message: "Failed to delete table", error: error.message });
  }
};

export const getTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tableId } = req.params;
    const userId = (req as any).user?.id;

    const table = await Table.findOne({ _id: tableId, userId });
    
    if (!table) {
      res.status(404).json({ message: "Table not found" });
      return;
    }

    res.status(200).json(table);
  } catch (error: any) {
    console.error("Error fetching table:", error);
    res.status(500).json({ message: "Failed to fetch table", error: error.message });
  }
};
