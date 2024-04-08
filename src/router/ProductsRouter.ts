import ProductsController from '../controller/ProductsController';
import BaseRoutes from "./BaseRouter";

class ProductsRouter extends BaseRoutes{
    
    routes(): void {
        this.router.post("/register", ProductsController.register);
        this.router.get("/getall", ProductsController.getProducts);
        this.router.get('/:productId', ProductsController.getProduct)
        this.router.put('/:productId', ProductsController.updateProduct)
        this.router.delete('/:productId', ProductsController.deleteProduct)
    }
    
}
export default new ProductsRouter().router;