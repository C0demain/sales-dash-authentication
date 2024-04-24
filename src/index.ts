import express, { Application, Request, Response, } from "express";
import rateLimit from "express-rate-limit";
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

const createInitialCommissions = async () => {
  const commissionExists = await Commissions.findOne({
    where: { id: 1 }
  })
  if (commissionExists == null) {
    Commissions.bulkCreate
      ([
        {
          title: "Cliente Novo/Produto Novo",
          percentage: 0.20
        },
        {
          title: "Cliente Novo/Produto Velho",
          percentage: 0.10
        }, {
          title: "Cliente Velho/Produto Novo",
          percentage: 0.05
        },
        {
          title: "Cliente Velho/Produto Velho",
          percentage: 0.02
        }
      ])
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo | null;
    }
  }
}

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
    this.app.use("/api/v1/products", ProductsRouter);
    this.app.use("/api/v1/clients", ClientRouter);
    this.app.use("/api/v1/dashboard", DashboardRouter)
  }

  // add database sync
  protected databaseSync(): void {
    const db = new Database();
    db.sequelize?.sync();
    db.sequelize?.afterBulkSync(createInitialCommissions)
  }

  // add plugin
  protected plugins(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Use o middleware cors com opções
    this.app.use(cors({
      origin: true, // Origens permitidas
      methods: ['GET', 'POST', 'PUT', 'DELETE'] // Métodos HTTP permitidos
    }));

    const limiter = rateLimit({
      windowMs: 60 * 1000,
      max: 1000,
      message: "Limite de requisições excedido. Por favor, tente novamente mais tarde.",
    });
    this.app.use(limiter);
  }
}


const port: number = 8000;
const app = new App().app;

app.listen(port, () => {
  console.log(`✅ Server started successfully. Server is running at http://localhost:${port}.`);
})