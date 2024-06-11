import express, { Application, Request, Response } from "express";
import cors from "cors";
import Database from "./config/database";
import AuthenticationRouter from "./router/AuthenticationRouter";
import CommissionsRouter from "./router/CommissionsRouter";
import SellsRouter from "./router/SellsRouter";
import ProductsRouter from "./router/ProductsRouter";
import ClientRouter from "./router/ClientRouter";
import DashboardRouter from "./router/DashboardRouter";
import DocsRouter from "./router/DocsRouter";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.databaseSync();
    this.plugins();
    this.routes();
  }

  protected routes(): void {
    this.app.route("/").get((req: Request, res: Response) => {
      // #swagger.ignore = true
      const docUrl = `http://localhost:${port}/api/v1/docs`
      res.send(`Welcome to Sales Dash Backend. You can find the documentation <a href='${docUrl}'>here!</a>`);
    });
    this.app.use('/api/v1/', DocsRouter)
    this.app.use("/api/v1/auth", AuthenticationRouter/* #swagger.tags = ['Auth'] */);
    this.app.use("/api/v1/sells", SellsRouter /* #swagger.tags = ['Sells'] */);
    this.app.use("/api/v1/commissions", CommissionsRouter /* #swagger.tags = ['Commissions'] */);
    this.app.use("/api/v1/products", ProductsRouter /* #swagger.tags = ['Products'] */);
    this.app.use("/api/v1/clients", ClientRouter /* #swagger.tags = ['Clients'] */);
    this.app.use("/api/v1/dashboard", DashboardRouter /* #swagger.tags = ['Dashboard'] */);
  }

  protected async databaseSync(): Promise<void> {
    const db = Database.getInstance();
    await db.connect(true);
    await db.sequelize?.sync();
  }

  protected plugins(): void {
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    this.app.use(cors({
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }));
  }
}

const port: number = 8000;
const app = new App().app;

app.listen(port, () => {
  console.log(`✅ Server started successfully. Server is running at http://localhost:${port}.`);
});
