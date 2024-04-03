import BaseRoutes from "./BaseRouter";
import CommissionsController from "../controller/CommissionsController";

class CommissionsRouter extends BaseRoutes{
    
    routes(): void {
        this.router.post("/register", CommissionsController.register);
        this.router.get("/getall", CommissionsController.getCommissions);
    }
    
}
export default new CommissionsRouter().router;