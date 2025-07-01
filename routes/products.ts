import {Router} from "express"
import { getAllProducts } from "../controllers/products"
const ProductRouter = Router()

ProductRouter.get("/", getAllProducts)

export default ProductRouter