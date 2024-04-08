import AuthenticationController from "../controller/AuthenticationController";
import { auth, authorize } from "../middleware/AuthMiddleware";
import { Roles } from "../models/enum/Roles";
import BaseRoutes from "./BaseRouter";

class AuthenticationRoutes extends BaseRoutes {
  routes(): void {
    this.router.post("/login", AuthenticationController.login);
    this.router.post("/register", AuthenticationController.register);
    this.router.get("/users", auth, AuthenticationController.getUsers);
  }
}

export default new AuthenticationRoutes().router;
