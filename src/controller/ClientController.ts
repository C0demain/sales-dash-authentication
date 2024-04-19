import { Request , Response } from "express";
import { ClientRepo } from "../repository/ClientRepo";
import { ClientService } from "../service/ClientService";
import { UniqueConstraintError } from "sequelize";

export class ClientController{
    
    // register
    async register(req : Request, res : Response ){
        try{
            const {name, segment, cpf} = req.body;
            await new ClientService().register(name,segment,cpf);
            return res.status(200).json({
                status : "success",
                message : "sucessfully registered client"
            })

            }
            catch(error){
                console.error("Registration error:", error);
                if(error instanceof UniqueConstraintError){
                    return res.status(400).json({
                        status: "Bad Request",
                        message: error.errors[0].message
                    })
                }else{
                    return res.status(500).json({
                        status: "Internal Server Error",
                        message: "Something went wrong with register",
                      });
                }
            }

        }
      
    async getClients(req : Request, res: Response){
        try{
            const client = await new ClientRepo().getAll();
            console.log(client);
            return res.status(200).json({
                status: "Success",
                message: "Successfully fetched clients",
                client: client,
              });
        }catch (error) {
            console.error("Get client error:", error);
            return res.status(500).json({
              status: "Internal Server Error",
              message: "Something went wrong with getClients",
            });
          }
    }
    }

export default new ClientController();