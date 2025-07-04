import User from '../models/User';
import { Request, Response } from 'express';
const  getUserById=async(req:Request,res:Response)=>{
    try {
        const userid=req.user.id
        const user=await User.findById(userid);
        res.json({ success: true, user });
      } catch (error) {
        res.status(500).json({ success: false, message: "Fetching user failed", error });
      }
}
export default getUserById