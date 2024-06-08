import { ProductsService } from './../service/ProductsService';
import { Request, Response } from "express";
import { ProductsRepo } from "../repository/ProductsRepo";
import NotFoundError from '../exceptions/NotFound';
import { SellsRepo } from '../repository/SellsRepo';

export class ProductsController {
    async register(req: Request, res: Response) {
        try {
            const { name } = req.body
            await new ProductsService().register(name);
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
            const userId = req.query.userId
            const newUserId = (userId) ? parseInt(userId?.toString()) : undefined
            const products = await new ProductsRepo().getAll(newUserId);
            return res.status(200).json({
                status: "Success",
                message: "Successfully fetched products",
                products: products
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    status: "Not Found",
                    message: error.message,
                });
            } else {
                console.error("Get products error:", error);
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Something went wrong with getProducts",
                });
            }
        }
    }

    //singular = produto
    async getProduct(req: Request, res: Response) {
        const { productId } = req.params
        try {
            const product = await new ProductsRepo().getById(parseInt(productId))

            return res.status(200).json({
                status: "Success",
                product: product
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    status: "Not Found",
                    message: error.message,
                });
            } else {
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Something went wrong with getProduct",
                });
            }

        }
    }

    async updateProduct(req: Request, res: Response) {
        const { productId } = req.params
        const { name } = req.body
        try {
            const productRepo = new ProductsRepo()
            const product = await productRepo.getById(parseInt(productId))

            product.name = name
            await productRepo.update(product)
            return res.status(200).json({
                status: "Success",
                message: "Successfully updated product"
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    status: "Not Found",
                    message: error.message,
                });
            } else {
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Something went wrong with updateProduct",
                });
            }
        }
    }

    async deleteProduct(req: Request, res: Response) {
        const { productId } = req.params
        try {
            const check = await new SellsRepo().checkProduct(parseInt(productId));
            if (check == null) {
                await new ProductsRepo().delete(parseInt(productId));
                return res.status(204).json({
                    status: "No content",
                    message: "Successfully deleted product",
                });
            }
            else throw new Error();
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    status: "Not Found",
                    message: error.message,
                });
            } else {
                return res.status(403).json({
                    status: "Forbidden",
                    message: "Cant delete products with sells related",
                });
            }
        }
    }
}

export default new ProductsController()