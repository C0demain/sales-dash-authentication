import { Client } from "../models/Client";
import { Products } from "../models/Products";
import { Sells } from "../models/Sells";
import { Users } from "../models/Users";
import { SellsRepo } from "../repository/SellsRepo";
import Database from "../config/database";

interface ISellsService {
    register(
        date: string,
        userId: number,
        productId: number,
        clientId: number,
        value: number,
        new_client: boolean,
        new_product: boolean,
        commissionId: number,
        commissionValue: number
    ): Promise<void>;
    registerMultiple(sells: Sells[]): Promise<void>;
}

export class SellsService implements ISellsService {

    async register(
        date: string,
        userId: number,
        productId: number,
        clientId: number,
        value: number,
        new_client: boolean,
        new_product: boolean,
        commissionId: number,
        commissionValue: number
    ): Promise<void> {
        try {
            const user = await Users.findByPk(userId);
            const client = await Client.findByPk(clientId);
            const prod = await Products.findByPk(productId);
            if (!user) {
                throw new Error("User not found");
            }

            if (!client) {
                throw new Error("Client not found");
            }

            if (!prod) {
                throw new Error("Product not found");
            }

            const newSell = new Sells();
            newSell.date = date;
            newSell.product = prod;
            newSell.productId = prod.id;
            newSell.client = client;
            newSell.clientId = client.id;
            newSell.value = value;
            newSell.user = user;
            newSell.userId = user.id;
            newSell.new_client = new_client;
            newSell.new_product = new_product;
            newSell.commissionId = commissionId;
            newSell.commissionValue = commissionValue;
            await new SellsRepo().save(newSell);
        } catch (error: any) {
            throw new Error("Failed to register sell: " + error.message);
        }
    }

    async registerMultiple(sellsData: {
        date: string;
        userId: number;
        productId: number;
        clientId: number;
        value: number;
        new_client: boolean;
        new_product: boolean;
        commissionId: number;
        commissionValue: number;
      }[]): Promise<void> {
        try {
          const sellsToSave: Sells[] = sellsData.map(sellData => {
            const newSell = new Sells();
            newSell.date = sellData.date;
            newSell.userId = sellData.userId;
            newSell.productId = sellData.productId;
            newSell.clientId = sellData.clientId;
            newSell.value = sellData.value;
            newSell.new_client = sellData.new_client;
            newSell.new_product = sellData.new_product;
            newSell.commissionId = sellData.commissionId;
            newSell.commissionValue = sellData.commissionValue;
            return newSell;
          });
    
          await new SellsRepo().saveRegisterFromTable(sellsToSave);
        } catch (error: any) {
          throw new Error("Failed to register multiple sells: " + error.message);
        }
      }
}
