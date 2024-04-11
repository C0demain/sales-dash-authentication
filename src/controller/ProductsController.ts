import { ProductsService } from './../service/ProductsService';
import { Request, Response } from "express";
import { ProductsRepo } from "../repository/ProductsRepo";

export class ProductsController {
    async register(req: Request, res: Response) {
        try {
            const {name, description, value } = req.body
            await new ProductsService().register(name, description, value);
            return res.status(200).json({
                status: "success",
                message: "sucessfully registered product"
            })
        } catch (error) {
            console.error("Registration error:", error);
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with register",
            });
        }
    }

    //plural = produtos
    async getProducts(req: Request, res: Response) {
        try {
            const products = await new ProductsRepo().getAll();
            return res.status(200).json({
                status: "Success",
                message: "Successfully fetched products",
                products: products
            });
        } catch (error) {
            console.error("Get products error:", error);
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with getProducts",
            });
        }
    }

    //singular = produto
    async getProduct(req: Request, res: Response) {
        const { productId } = req.params
        try {
            const product = await new ProductsRepo().getById(parseInt(productId))
            if (!product) {
                return res.status(404).json({
                    status: "Not found",
                    message: "Product not found",
                });
            }
            return res.status(200).json({
                status: "Success",
                product: product
            });
        } catch (error) {
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with getProduct",
            });
        }
    }

    async updateProduct(req: Request, res: Response) {
        const { productId } = req.params
        const { name, description, value } = req.body
        try {
            const productRepo = new ProductsRepo()
            const product = await productRepo.getById(parseInt(productId))
            if (!product) {
                return res.status(404).json({
                    status: "Not found",
                    message: "Product not found",
                });
            }
            product.name = name
            product.description = description
            product.value = value
            await productRepo.update(product)
            return res.status(200).json({
                status: "Success",
                message: "Successfully updated product"
            });
        } catch (error) {
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with updateProduct",
            });
        }
    }

    async deleteProduct(req: Request, res: Response) {
        const { productId } = req.params
        try {
            await new ProductsRepo().delete(parseInt(productId))
            return res.status(200).json({
                status: "Success",
                message: "Successfully deleted product",
            });
        } catch (error) {
            console.error("Delete product error:", error);
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with deleteProduct",
            });
        }
    }

}

export default new ProductsController()