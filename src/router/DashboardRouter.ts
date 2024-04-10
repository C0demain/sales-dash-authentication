import DashboardController from "../controller/DashboardController";
import BaseRoutes from "./BaseRouter";

class DashboardRouter extends BaseRoutes {
    routes(): void {
        this.router.get("/", DashboardController.getLatestSales);
        this.router.get("/user/:id", DashboardController.getUserStats);
        this.router.get("/product/:name", DashboardController.getProductStats);
        this.router.get("/client/:id", DashboardController.getClientStats);
        this.router.get("/date", DashboardController.getStatsFromDate);
    }
}
export default new DashboardRouter().router;