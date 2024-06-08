import SellsController  from "../controller/SellsController";
import { auth } from "../middleware/AuthMiddleware";
import BaseRoutes from "./BaseRouter";

class SellsRouter extends BaseRoutes{
    routes(): void {
        this.router.post("/register", auth, SellsController.register);
        this.router.get("/getfilter", auth, SellsController.getFilteredSells);
        this.router.get("/getall", auth, SellsController.getSells);
        this.router.post("/table", auth, SellsController.registerFromTable);
        this.router.put("/update/:sellId", auth, SellsController.updateSell);
    }
}

export default new SellsRouter().router;