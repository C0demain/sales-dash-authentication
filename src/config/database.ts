import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
import { Client } from "../models/Client";
import { Commissions } from "../models/Commissions";
import { Products } from "../models/Products";
import { Sells } from "../models/Sells";
import { Users } from "../models/Users";
import { Seeders } from "../seeders/Seeders";

dotenv.config();

class Database {
  public sequelize: Sequelize | undefined;

  private POSTGRES_URL = 'postgresql://postgres:YQVZfDIjSrvhjbkefuEddfbDipmMzrIn@monorail.proxy.rlwy.net:53334/railway';

  constructor() {
    this.connectToPostgreSQL();
  }

  public async connectToPostgreSQL() {
    if (!this.POSTGRES_URL) {
      console.error("❌ PostgreSQL URL not provided.");
      return;
    }

    this.sequelize = new Sequelize(this.POSTGRES_URL, {
      dialect: "postgres",
      models: [Users, Sells, Commissions, Products, Client]
    });

    try {
      await this.sequelize.authenticate();
      console.log("✅ PostgreSQL Connection has been established successfully.");
      
      // Após a autenticação bem-sucedida, sincronize os modelos e execute os seeders
      await this.syncModels();
      await Seeders.defaultUsers();
      await Seeders.defaultCommissions();
      console.log("✅ Models synchronized with database.");
      console.log("✅ Seeders executed successfully.");

    } catch (error) {
      console.error("❌ Unable to connect to the PostgreSQL database:", error);
    }
  }

  private async syncModels(): Promise<void> {
    if (this.sequelize) {
      await this.sequelize.sync();
    }
  }
}

export default Database;