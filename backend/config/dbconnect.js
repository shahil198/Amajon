import mongoose  from "mongoose";


export const connectDatabase = () =>{
    let URI="";
    if(process.env.NODE_ENV=="PRODUCTION") URI=process.env.DB_URI;
    if(process.env.NODE_ENV=="DEVELOPMENT") URI=process.env.DB_LOCAL_URI;
     mongoose.connect(URI).then((con)=>{
        console.log(`database connect with host ${con?.connection?.host}`)
     })
}