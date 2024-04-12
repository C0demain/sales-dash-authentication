import SellsController  from "../controller/SellsController";
import BaseRoutes from "./BaseRouter";

class SellsRouter extends BaseRoutes{
    
    routes(): void {
        this.router.post("/register", SellsController.register);
        this.router.get("/getall", SellsController.getSells);
        this.router.get("/getall/filter", SellsController.getFilteredSells);
        this.router.post("/table", SellsController.registerFromTable)
    }
    
}
export default new SellsRouter().router;