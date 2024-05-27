import AuthenticationController from "../controller/AuthenticationController";
import BaseRoutes from "./BaseRouter";

class AuthenticationRoutes extends BaseRoutes {
  routes(): void {
    this.router.post("/login", AuthenticationController.login);
    this.router.post("/registerUser", AuthenticationController.registerUser);
    this.router.post("/registerAdmin", AuthenticationController.registerAdmin);
    this.router.get("/users", AuthenticationController.getUsers);
    this.router.get("/users/sellers", AuthenticationController.getSellers);
    this.router.get("/user/:id", AuthenticationController.getUserWithSells); 
    this.router.delete("/user/:userId", AuthenticationController.deleteUser);
    this.router.put("/user/:userId", AuthenticationController.updateUser);
  }
}

export default new AuthenticationRoutes().router;
