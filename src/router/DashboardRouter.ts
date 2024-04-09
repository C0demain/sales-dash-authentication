import DashboardController from "../controller/DashboardController";
import BaseRoutes from "./BaseRouter";

class DashboardRouter extends BaseRoutes {
    routes(): void {
        this.router.get("/", DashboardController.getStatsFromSells);
        this.router.get("/date", DashboardController.getStatsFromDate);
    }
}
export default new DashboardRouter().router;