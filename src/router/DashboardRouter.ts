import DashboardController from "../controller/DashboardController";
import { auth } from "../middleware/AuthMiddleware";
import { DatabaseCleaner } from "../service/DatabaseCleaner";
import BaseRoutes from "./BaseRouter";

class DashboardRouter extends BaseRoutes {
    routes(): void {
        this.router.get("/user", auth, DashboardController.getUserStats);
        this.router.get("/product", auth, DashboardController.getProductStats);
        this.router.get("/client", auth, DashboardController.getClientStats);
        this.router.get("/date", auth, DashboardController.getStatsFromDate);
        this.router.get("/date/client",  DashboardController.getClientStatsFromDate);
        this.router.get("/date/commission", auth, DashboardController.getCommissionStatsFromDate);
        this.router.get('/ranking', auth, DashboardController.getRanking)
        this.router.post('/clean-database', auth, DashboardController.cleanDatabase)
    }
}
export default new DashboardRouter().router;