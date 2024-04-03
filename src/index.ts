import express, { Application, Request, Response } from "express";
import cors from "cors"; 
import Database from "./config/database";
import AuthenticationRouter from "./router/AuthenticationRouter";
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
    
    // Use o middleware cors com opções
    this.app.use(cors({
      origin: 'http://localhost:3000', // Origens permitidas
      methods: ['GET', 'POST', 'PUT', 'DELETE'] // Métodos HTTP permitidos
    }));
  }
}

const port: number = 8000;
const app = new App().app;

app.listen(port, () => {
  console.log(`✅ Server started successfully. Server is running at http://localhost:${port}.`);
});
