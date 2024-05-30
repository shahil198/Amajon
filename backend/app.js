import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app=express();
dotenv.config({'path':'backend/config/config.env'});


import { connectDatabase } from './config/dbconnect.js';
import errorMiddleWare from './middlewares/Error.js';

//connecting database
connectDatabase();

app.use(express.json())
app.use(cookieParser())


//uncaught exception error
process.on('uncaughtException',(err)=>{
       console.log(`ERROR: ${err}`)
       console.log('shutting down the server due to uncaught exception')
       process.exit(1);
})

// console.log(logo)


//Routing
import productRoutes from './routes/product.js';
import userRoutes  from  './routes/auth.js'
app.use('/api/v1',productRoutes);
app.use('/api/v1',userRoutes)

app.use(errorMiddleWare)




let server=app.listen(process.env.PORT,()=>{
    console.log(`server running on PORT :${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})

//handling unhandled promise rejection
process.on('unhandledRejection',(err)=>{
    console.log(`ERROR: ${err}`);
    console.log(`Shutting down server due to unhandledRejection`)
    server.close(()=>{
        process.exit(1)
    })
})