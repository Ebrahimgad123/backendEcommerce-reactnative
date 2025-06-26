import Order from '../models/Order';
import { Request, Response } from 'express';


export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = new Order({
      user: req.user.id,
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: 'فشل في إنشاء الطلب' });
  }
};


export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ أثناء تحميل الطلبات' });
  }
};

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'تعذر تحميل الطلبات' });
  }
};


export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if(!order) {
        res.status(404).json({ error: 'الطلب غير موجود' });
        return;
     }
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
       res.status(403).json({ error: 'غير مصرح' });
       return
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'تعذر العثور على الطلب' });
  }
};


export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status, updatedAt: Date.now() } },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'فشل تحديث حالة الطلب' });
  }
};


export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الطلب بنجاح' });
  } catch (err) {
    res.status(500).json({ error: 'فشل في حذف الطلب' });
  }
};
