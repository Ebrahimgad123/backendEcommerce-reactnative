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
export const createProduct = async (req: Request, res: Response) => {
  // تحويل الملفات إلى روابط الصور
  const images = (req.files as Express.Multer.File[])?.map(file =>
    `https://backend-ecommerce-reactnative.vercel.app/uploads/${file.filename}`
  );

  try {
    const product = await Products.create({
      ...req.body,
      images, // نضيف الصور كمصفوفة في الحقل المناسب
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: (error as Error).message,
    });
  }
};
