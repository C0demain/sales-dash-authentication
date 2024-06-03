import ClientController from "../controller/ClientController";
import { auth } from "../middleware/AuthMiddleware";
import BaseRoutes from "./BaseRouter";

class ClientRouter extends BaseRoutes {

    routes(): void {
        this.router.post("/register", auth, ClientController.register);
        this.router.get("/getclients", auth, ClientController.getClients);
        this.router.put("/update/:clientId", auth, ClientController.updateClient);
        this.router.delete("/delete/:clientId", auth, ClientController.deleteClient);
    }
}

export default new ClientRouter().router;