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

  private POSTGRES_URL = process.env.POSTGRES_URL || 'postgresql://postgres:autuYQJImudfnzqKuuijRxRHaGhLObeI@monorail.proxy.rlwy.net:27275/railway';

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
      models: [Users, Sells, Commissions, Products, Client],
      pool: {
        max: 10, // Número máximo de conexões no pool
        min: 0,  // Número mínimo de conexões no pool
        acquire: 30000, // Tempo máximo, em milissegundos, que o pool irá tentar obter uma conexão antes de lançar um erro
        idle: 10000 // Tempo máximo, em milissegundos, que uma conexão pode ficar inativa antes de ser liberada
      },
      define: {
        timestamps: false // Desativar timestamps globais
      },
      logging: false // Desativar logging para reduzir a saída no console
    });

    try {
      await this.sequelize.authenticate();
      console.log("✅ PostgreSQL Connection has been established successfully.");

      // Após a autenticação bem-sucedida, sincronize os modelos e execute os seeders
      await this.syncModels();
      await Seeders.defaultAdmin();
      await Seeders.defaultCommissions();
      console.log("✅ Models synchronized with database.");
      console.log("✅ Seeders executed successfully.");
    } catch (error) {
      console.error("❌ Unable to connect to the PostgreSQL database:", error);
    }
  }

  private async syncModels(): Promise<void> {
    if (this.sequelize) {
      await this.sequelize.sync({ force: false }); // Não force a recriação das tabelas
    }
  }
}

export default Database;
