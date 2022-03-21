import { Router } from "express";
import {
  getProducts,
  createNewProduct,
  getProductById,
  printProductById,
  deleteProductById,
  getTotalProducts,
  updateProductById,
} from "../controllers/products.controller";

const router = Router();

router.get("/", getProducts);

router.get("/products", getProducts);

router.get("/products/count", getTotalProducts);

router.post("/products/find", getProductById);

router.post("/products/:print", printProductById);

router.post("/products/create", createNewProduct);

router.delete("/products/delete/:code", deleteProductById);

router.put("/products/edit/:code", updateProductById);

export default router;
