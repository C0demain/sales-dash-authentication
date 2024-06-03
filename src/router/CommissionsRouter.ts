import BaseRoutes from "./BaseRouter";
import CommissionsController from "../controller/CommissionsController";
import { auth } from "../middleware/AuthMiddleware";

class CommissionsRouter extends BaseRoutes{
    
    routes(): void {
        this.router.post("/register", auth, CommissionsController.register);
        this.router.get("/getall", auth, CommissionsController.getCommissions);
        this.router.get('/:commissionId', auth, CommissionsController.getComission)
        this.router.put('/:commissionId', auth, CommissionsController.updateCommission)
        this.router.delete('/:commissionId', auth, CommissionsController.deleteCommission)
    }
    
}
export default new CommissionsRouter().router;