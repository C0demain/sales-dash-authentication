import { Client } from "../models/Client";
import { Sells } from "../models/Sells";
import { Users } from "../models/Users";
import { SellsRepo } from "../repository/SellsRepo";

interface ISellsService{
    register(
        date : string,
        userId : number,
        product : string,
        clientId : number,
        value : number,    
    ): Promise<void>;
}

export class SellsService implements ISellsService{
    
    async register(date: string, userId:number, product: string, clientId : number, value: number): Promise<void> {
        try{           
            const user = await Users.findByPk(userId);
            const client = await Client.findByPk(clientId);
            if (!user) {
            throw new Error("User not found");
            }

            if(client === null){
                throw new Error("Client no found");
            }
            
            const newSell = new Sells();
            newSell.date = date;
            newSell.seller = user.email;
            newSell.product = product;
            newSell.clientname = client.name;
            newSell.client = client;
            newSell.clientId = client.id;
            newSell.value = value;
            newSell.user = user;
            newSell.userId = user.id;
            await new SellsRepo().save(newSell);        
        }
        catch(error){
        throw new Error("failed to register sell")
        }
    }
    
}