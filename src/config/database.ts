import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';
import { Users } from "../models/Users";
import { Sells } from "../models/Sells";
import { Commissions } from "../models/Commissions";
import { Products } from "../models/Products";
import { Client } from "../models/Client";
import { Seeders } from "../seeders/Seeders";

dotenv.config();

class Database {
  private static instance: Database;
  public sequelize: Sequelize;

  private POSTGRES_DB = process.env.POSTGRES_DB as string;
  private POSTGRES_HOST = process.env.POSTGRES_HOST as string;
  private POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT as string, 10);
  private POSTGRES_USER = process.env.POSTGRES_USER as string;
  private POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD as string;

  private constructor() {
    this.sequelize = new Sequelize({
      database: this.POSTGRES_DB,
      username: this.POSTGRES_USER,
      password: this.POSTGRES_PASSWORD,
      host: this.POSTGRES_HOST,
      port: this.POSTGRES_PORT,
      dialect: "postgres",
      models: [Users, Sells, Commissions, Products, Client],
      logging: true
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(showLogs: boolean = true): Promise<void> {
    try {
      if (showLogs)
        console.log("ℹ️ Connecting to the PostgreSQL database...");
      await this.sequelize.authenticate();

      if (showLogs)
        console.log("✅ PostgreSQL Connection has been established successfully.");
      await this.syncModels();

      if (showLogs)
        console.log("✅ Models synchronized with database.");
      await Seeders.defaultUsers();
      await Seeders.defaultCommissions();

      if (showLogs) console.log("✅ Seeders executed successfully.");

    } catch (error) {
      console.error("❌ Unable to connect to the PostgreSQL database:", error);
    }
  }

  private async syncModels(): Promise<void> {
    await this.sequelize.sync();
  }
}

export default Database;