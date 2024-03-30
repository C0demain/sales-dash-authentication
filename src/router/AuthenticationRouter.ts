import AuthenticationController from "../controller/AuthenticationController";
import { auth } from "../middleware/AuthMiddleware";
import BaseRoutes from "./BaseRouter";

class AuthenticationRoutes extends BaseRoutes {
  routes(): void {
    this.router.post("/login", AuthenticationController.login);
    this.router.post("/register", AuthenticationController.register);
    this.router.get("/users", auth, AuthenticationController.getUsers); //falta pedir o token do login
  }
}

export default new AuthenticationRoutes().router;
