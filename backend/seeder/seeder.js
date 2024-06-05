import product from "../models/product.js";
import mongoose from "mongoose";
import Products from "./data.js";

const seeder = async () => {
   try {
      await mongoose.connect("mongodb://localhost:27017/amajon");
      console.log("deleting the data...");
      await product.deleteMany();

      console.log("inserting the data...");
      await product.insertMany(Products);
   } catch (err) {
      console.log(err);
      process.exit();
   }
};

seeder();
