import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../controllers/order';

import { isAuthenticated, isAdmin } from '../middlewares/auth';

const router = express.Router();

// ✅ إنشاء طلب جديد
router.post('/', isAuthenticated, createOrder);

// ✅ جلب الطلبات الخاصة بالمستخدم
router.get('/my-orders', isAuthenticated, getUserOrders);

// ✅ جلب كل الطلبات (للمشرف)
router.get('/', isAuthenticated, isAdmin, getAllOrders);

// ✅ جلب طلب معين بالتفصيل
router.get('/:id', isAuthenticated, getOrderById);

// ✅ تعديل حالة الطلب (مثلاً: تغيير حالة الطلب لـ "تم التوصيل")
router.patch('/:id/status', isAuthenticated, isAdmin, updateOrderStatus);

// ✅ حذف طلب (اختياري)
router.delete('/:id', isAuthenticated, isAdmin, deleteOrder);

export default router;
