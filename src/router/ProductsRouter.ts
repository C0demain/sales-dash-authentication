import ProductsController from '../controller/ProductsController';
import { auth } from '../middleware/AuthMiddleware';
import BaseRoutes from "./BaseRouter";

class ProductsRouter extends BaseRoutes{
    
    routes(): void {
        this.router.post("/register", auth, ProductsController.register);
        this.router.get("/getAll", auth, ProductsController.getProducts);
        this.router.get('/:productId', auth, ProductsController.getProduct)
        this.router.put('/:productId', auth, ProductsController.updateProduct)
        this.router.delete('/:productId', auth, ProductsController.deleteProduct)
    }
    
}
export default new ProductsRouter().router;