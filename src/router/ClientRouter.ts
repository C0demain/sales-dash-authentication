import ClientController from "../controller/ClientController";
import BaseRoutes from "./BaseRouter";

class ClientRouter extends BaseRoutes{
    
    routes(): void {
        
        this.router.post("/register" , ClientController.register);
        this.router.get("/getclients" , ClientController.getClients);
   }

}

export default new ClientRouter().router;