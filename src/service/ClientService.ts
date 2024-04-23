import { UniqueConstraintError } from "sequelize";
import { Client } from "../models/Client";
import { ClientRepo } from "../repository/ClientRepo";

interface IClientService{
    register(
        name: string,
        segment : string,
        cpf : string,    
    ): Promise<void>;
}

export class ClientService implements IClientService{
    
    async register( name: string, segment : string, cpf: string): Promise<void> {
        try{           
        
            const newClient = new Client();
            newClient.name = name;
            newClient.segment = segment;
            newClient.cpf = cpf;
            
            await new ClientRepo().save(newClient);        
        }
        catch(error){
        if(error instanceof UniqueConstraintError) throw error
        else throw new Error("failed to register client")

        }
    }
    
}