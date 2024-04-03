import { Sells } from "../models/Sells";
import { SellsRepo } from "../repository/SellsRepo";

interface ISellsService{
    register(
        date : string,
        seller : string,
        product : string,
        client : string,
        client_department : string,
        value : number
    ): Promise<void>;
}

export class SellsService implements ISellsService{
    
    async register(date: string, seller: string, product: string, client: string, client_department: string, value: number): Promise<void> {
        try{
            const newSell = new Sells();
            newSell.date = date;
            newSell.seller = seller;
            newSell.product = product;
            newSell.client = client;
            newSell.client_department = client_department;
            newSell.value = value;
            await new SellsRepo().save(newSell);        
        }
        catch(error){
        throw new Error("failed to register sell")
        }
    }
    
}