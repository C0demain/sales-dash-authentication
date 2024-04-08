import BaseRoutes from "./BaseRouter";
import CommissionsController from "../controller/CommissionsController";

class CommissionsRouter extends BaseRoutes{
    
    routes(): void {
        this.router.post("/register", CommissionsController.register);
        this.router.get("/getall", CommissionsController.getCommissions);
        this.router.get('/:commissionId', CommissionsController.getComission)
        this.router.put('/:commissionId', CommissionsController.updateCommission)
        this.router.delete('/:commissionId', CommissionsController.deleteCommission)
    }
    
}
export default new CommissionsRouter().router;