import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Please enter the product name"]
    },
    price:{
        type:Number,
        required:[true,"Please enter the price"]
    },
    description:{
        type:String,
        required:[true,"please enter the description"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
            type:String,
            required:true
            },
        url:{
            type:String,
            required:true
        }    
        }
    ],
    category:{
       type:String,
       required:true,
       enum:{
        values: [
            "Electronics",
            "Cameras",
            "Laptops",
            "Accessories",
            "Headphones",
            "Food",
            "Books",
            "Sports",
            "Outdoor",
            "Home",
        ],
        message:"Please enter the correct categories"
          },
    },
    seller:{
        type:String,
        required:[true,"Please enter the seller"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter the stocks"]
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true 
            }
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:false
    }


},{timestamps:true})


export default mongoose.model("Product",productSchema);