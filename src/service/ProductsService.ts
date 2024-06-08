import { Products } from "../models/Products";
import { ProductsRepo } from "../repository/ProductsRepo";

interface IProductsService {
    register(
        name: string
    ): Promise<void>;
}

export class ProductsService implements IProductsService {

    async register(name: string): Promise<void> {
        try {
            const newProduct = new Products();
            newProduct.name = name;
            console.log(`Registering new product with name: ${newProduct.name}`);

            await new ProductsRepo().save(newProduct);
        } catch (error) {
            throw new Error("ProductsService failed to register product")
        }
    }
}