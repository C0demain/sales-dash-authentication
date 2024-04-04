import { Commissions } from "../models/Commissions";
import { CommissionsRepo } from "../repository/CommissionsRepo";

interface ICommissionsService{
    register(
        title: string, 
        percentage: number
    ): Promise<void>;
}

export class CommissionsService implements ICommissionsService{
    
    async register(title: string, percentage: number): Promise<void> {
        try{
            const newCommission = new Commissions();
            newCommission.title = title
            newCommission.percentage = percentage
            await new CommissionsRepo().save(newCommission);      
        }
        catch(error){
        throw new Error("failed to register commission")
        }
    }
    
}