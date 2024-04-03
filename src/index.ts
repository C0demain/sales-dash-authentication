import express, { Application, Request, Response } from "express";
import Database from "./config/database";
import AuthenticationRouter from "./router/AuthenticationRouter";
import CommissionsRouter from "./router/CommissionsRouter";
import SellsRouter from "./router/SellsRouter";

class App {
  public app: Application;

  // init
  constructor() {
    this.app = express();
    this.databaseSync();
    this.plugins();
    this.routes();
  }

  // add routes
  protected routes(): void {
    this.app.route("/").get((req: Request, res: Response) => {
      res.send("welcome home");
    });
    this.app.use("/api/v1/auth", AuthenticationRouter);
    this.app.use("/api/v1/sells", SellsRouter);
    this.app.use("/api/v1/commissions", CommissionsRouter);
  }

  // add database sync
  protected databaseSync(): void {
    const db = new Database();
    db.sequelize?.sync();
  }

  // add plugin
  protected plugins(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
}

const port: number = 8000;
const app = new App().app;

app.listen(port, () => {
  console.log(`✅ Server started successfully. Server is running at http://localhost:${port}.`);
});
