import express from "express";
import * as categoryController from "../controller/categoriesController.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/create", categoryController.create);
categoriesRouter.get("/getAllCategories", categoryController.fetch);
categoriesRouter.get("/getCategory/:id", categoryController.getCategoryById);

categoriesRouter.get(
  "/getCategoryTree/:id",
  categoryController.getCategoryTree
);
categoriesRouter.put("/update/:id", categoryController.update);
categoriesRouter.delete("/delete/:id", categoryController.deleteCategory);

export default categoriesRouter;
