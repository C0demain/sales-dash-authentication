import express, { Application } from "express";
import cors from "cors";
import Database from "./config/database";
import AuthenticationRouter from "./router/AuthenticationRouter";
import CommissionsRouter from "./router/CommissionsRouter";
import SellsRouter from "./router/SellsRouter";
import { UserBasicInfo } from "./models/interface/User";
import ProductsRouter from "./router/ProductsRouter";
import ClientRouter from "./router/ClientRouter";
import DashboardRouter from "./router/DashboardRouter";
import { Commissions } from "./models/Commissions";

declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo | null;
    }
  }
}

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.databaseSync();
    this.plugins();
    this.routes();
  }

  protected routes(): void {
    this.app.use("/api/v1/auth", AuthenticationRouter);
    this.app.use("/api/v1/sells", SellsRouter);
    this.app.use("/api/v1/commissions", CommissionsRouter);
    this.app.use("/api/v1/products", ProductsRouter);
    this.app.use("/api/v1/clients", ClientRouter);
    this.app.use("/api/v1/dashboard", DashboardRouter)
  }

  protected async databaseSync(): Promise<void> {
    const db = Database.getInstance();
    await db.connect(true);
    await db.sequelize?.sync();
  }

  protected plugins(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(cors({
      origin: true, 
      methods: ['GET', 'POST', 'PUT', 'DELETE'] 
    }));
  }
}

const port: number = 8000;
const app = new App().app;

app.listen(port, () => {
  console.log(`✅ Server started successfully. Server is running at http://localhost:${port}.`);
})