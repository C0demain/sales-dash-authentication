import AuthenticationController from "../controller/AuthenticationController";
import { auth } from "../middleware/AuthMiddleware";
import BaseRoutes from "./BaseRouter";

class AuthenticationRoutes extends BaseRoutes {
  routes(): void {
    this.router.post("/login", AuthenticationController.login);
    this.router.post("/registerUser", auth, AuthenticationController.registerUser);
    this.router.post("/registerAdmin", auth, AuthenticationController.registerAdmin);
    this.router.get("/users", auth, AuthenticationController.getUsers);
    this.router.get("/users/sellers", auth, AuthenticationController.getSellers);
    this.router.get("/user/:id", auth, AuthenticationController.getUserWithSells);
    this.router.delete("/user/:userId", auth, AuthenticationController.deleteUser);
    this.router.put("/user/:userId", auth, AuthenticationController.updateUser);
  }
}

export default new AuthenticationRoutes().router;
