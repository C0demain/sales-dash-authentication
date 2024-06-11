import AuthenticationController from "../controller/AuthenticationController";
import { auth } from "../middleware/AuthMiddleware";
import BaseRoutes from "./BaseRouter";

class AuthenticationRoutes extends BaseRoutes {
  routes(): void {
    this.router.post("/login", AuthenticationController.login
      /* #swagger.requestBody = {
        schema: {$ref: "#/definitions/Login"}
      }*/
    );
    this.router.post("/registerUser", auth, AuthenticationController.registerUser
      /* #swagger.requestBody = {
        schema: {$ref: "#/definitions/AddSeller"}
      }*/
    );
    this.router.post("/registerAdmin", auth, AuthenticationController.registerAdmin
      /* #swagger.requestBody = {
        schema: {$ref: "#/definitions/AddAdmin"}
      }*/
    );
    this.router.get("/users", auth, AuthenticationController.getUsers);
    this.router.get("/users/sellers", auth, AuthenticationController.getSellers);
    this.router.get("/user/:id", auth, AuthenticationController.getUserWithSells);
    this.router.get("/user/products/:id", auth, AuthenticationController.getUserWithProducts);
    this.router.get("/user/clients/:id", auth, AuthenticationController.getUserWithClients);
    this.router.delete("/user/:userId", auth, AuthenticationController.deleteUser);
    this.router.put("/user/:userId", auth, AuthenticationController.updateUser);
  }
}

export default new AuthenticationRoutes().router;
