import express, { Application, Request, Response } from "express";
import cors from "cors";
import Database from "./config/database";
import AuthenticationRouter from "./router/AuthenticationRouter";
import CommissionsRouter from "./router/CommissionsRouter";
import SellsRouter from "./router/SellsRouter";
import ProductsRouter from "./router/ProductsRouter";
import ClientRouter from "./router/ClientRouter";
import DashboardRouter from "./router/DashboardRouter";

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
      res.send("Welcome to Sales Dash Backend :)");
    });
    this.app.use("/api/v1/auth", AuthenticationRouter);
    this.app.use("/api/v1/sells", SellsRouter);
    this.app.use("/api/v1/commissions", CommissionsRouter);
    this.app.use("/api/v1/products", ProductsRouter);
    this.app.use("/api/v1/clients", ClientRouter);
    this.app.use("/api/v1/dashboard", DashboardRouter);
  }

  protected databaseSync(): void {
    const db = new Database();
    db.connectToPostgreSQL();
    db.sequelize?.sync();
  }

  protected plugins(): void {
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    this.app.use(cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }));
  }
}

const port: number = 8000;
const app = new App().app;

app.listen(port, () => {
  console.log(`✅ Server started successfully. Server is running at http://localhost:${port}.`);
});
