import { Sells } from "../models/Sells";
import { Users } from "../models/Users";
import { SellsRepo } from "../repository/SellsRepo";

interface ISellsService{
    register(
        date : string,
        userId : number,
        product : string,
        client : string,
        client_department : string,
        value : number,    
    ): Promise<void>;
}

export class SellsService implements ISellsService{
    
    async register(date: string, userId:number, product: string, client: string, client_department: string, value: number): Promise<void> {
        try{           
            const user = await Users.findByPk(userId);
            if (!user) {
            throw new Error("User not found");
            }
            
            const newSell = new Sells();
            newSell.date = date;
            newSell.seller = user.email;
            newSell.product = product;
            newSell.client = client;
            newSell.client_department = client_department;
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