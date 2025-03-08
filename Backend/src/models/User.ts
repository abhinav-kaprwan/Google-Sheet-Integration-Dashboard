import mongoose from "mongoose";

interface IUser extends mongoose.Document{
    email:string;
    password:string;
    createdAt:Date;
    updatedAt:Date;
    tokens: string[];
}
const userSchema = new mongoose.Schema<IUser>({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    tokens:{type:[String]}
},
{timestamps:true}
)

const User = mongoose.model<IUser>("User", userSchema);

export default User;
