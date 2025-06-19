import mongoose from "mongoose";

const userShema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    role:{type:String,enum:['admin','user'],default:'user'},
    image:{type: String,default: ""}
});


export default mongoose.model('User',userShema)