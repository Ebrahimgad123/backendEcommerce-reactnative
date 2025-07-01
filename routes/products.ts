import {Router} from "express"
import { getAllProducts , createProduct} from "../controllers/products"
import { isAdmin, isAuthenticated } from "../middlewares/auth"
import {validate} from "../middlewares/validate"
import { createProductSchema } from "../utils/validtionSchema"
import { uploadMultipleImages } from "../middlewares/upload"

const ProductRouter = Router()

ProductRouter.get("/", getAllProducts)
ProductRouter.post("/create",isAuthenticated,validate(createProductSchema),uploadMultipleImages("images",5), createProduct)

export default ProductRouter