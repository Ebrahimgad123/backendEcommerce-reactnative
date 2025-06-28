import {Router} from "express"
import getUserById from "../controllers/users"
import { isAuthenticated } from "../middlewares/auth"

const userRouter = Router()

userRouter.get("/",isAuthenticated, getUserById)

export default userRouter