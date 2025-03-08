import express from "express";
import { createTable, getUserTables, fetchGoogleSheetData, deleteTable, getTable } from "../controller/tableController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/create", authMiddleware, createTable);
router.get("/user-tables", authMiddleware, getUserTables);
router.get("/table/:tableId", authMiddleware, getTable);
router.post("/fetch-google-sheet-data", authMiddleware, fetchGoogleSheetData);
router.delete("/delete/:tableId", authMiddleware, deleteTable);

export default router;