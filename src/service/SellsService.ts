import { Client } from "../models/Client";
import { Products } from "../models/Products";
import { Sells } from "../models/Sells";
import { Users } from "../models/Users";
import { SellsRepo } from "../repository/SellsRepo";

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
    registerMultiple(sells: any[]): Promise<void>;
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
        } catch (error) {
            throw new Error("Failed to register sell");
        }
    }

    async registerMultiple(sells: any[]): Promise<void> {
        try {
            for (const sell of sells) {
                const {
                    date, userId, productId, clientId, value,
                    new_client, new_product, commissionId, commissionValue
                } = sell;

                await this.register(
                    date, userId, productId, clientId, value,
                    new_client, new_product, commissionId, commissionValue
                );
            }
        } catch (error) {
            throw new Error("Failed to register multiple sells");
        }
    }
}