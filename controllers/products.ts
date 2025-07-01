import { Request, Response } from "express";
import Products from "../models/Products";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Products.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: (error as Error).message, 
    });
  }
};
