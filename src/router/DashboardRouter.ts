import DashboardController from "../controller/DashboardController";
import BaseRoutes from "./BaseRouter";

class DashboardRouter extends BaseRoutes {
    routes(): void {
        this.router.get("/user", DashboardController.getUserStats);
        this.router.get("/product", DashboardController.getProductStats);
        this.router.get("/client", DashboardController.getClientStats);
        this.router.get("/date", DashboardController.getStatsFromDate);
        this.router.get("/date/commission", DashboardController.getCommissionStatsFromDate);
        this.router.get('/ranking', DashboardController.getRanking)
    }
}
export default new DashboardRouter().router;