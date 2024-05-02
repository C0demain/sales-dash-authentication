import SellsController  from "../controller/SellsController";
import BaseRoutes from "./BaseRouter";

class SellsRouter extends BaseRoutes{
    
    routes(): void {
        this.router.post("/register", SellsController.register);
        this.router.get("/getfilter", SellsController.getFilteredSells);
        this.router.get("/getall", SellsController.getSells);
        this.router.post("/table", SellsController.registerFromTable);
        this.router.put("/update/:sellId", SellsController.updateSell);
    }
    
}
export default new SellsRouter().router;