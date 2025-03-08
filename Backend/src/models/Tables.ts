import mongoose from "mongoose";

interface Column {
    name: string;
    type: "text" | "date";
  }

  interface Row {
    [key: string]: string | Date; 
  }

  export interface ITable extends Document {
    user: mongoose.Schema.Types.ObjectId;
    name: string;
    columns: Column[];
    rows: Row[];
  }

const tableSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    columns:[{
        name:String,
        type:{
            type:String,
            enum:["text","date"],
            required:true,
        }
    }],
    rows:[{type:Object}]
},{timestamps:true})

const Table = mongoose.model<ITable>("Table",tableSchema);

export default Table;

