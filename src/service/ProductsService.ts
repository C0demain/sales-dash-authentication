import { Products } from "../models/Products";
import { ProductsRepo } from "../repository/ProductsRepo";

interface IProductsService{
    register(
        name: string,
        description: string,
        value : number,    
    ): Promise<void>;
}

export class ProductsService implements IProductsService{
    
    async register(name: string, description: string, value: number): Promise<void> {
        try{           
            const newProduct = new Products();
            newProduct.name = name;
            newProduct.description = description
            newProduct.value = value;           
          
            await new ProductsRepo().save(newProduct);        
        }
        catch(error){
        throw new Error("failed to register product")
        }
    }
    
}