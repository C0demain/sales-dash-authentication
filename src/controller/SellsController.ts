import { Request , Response } from "express";
import { SellsRepo } from "../repository/SellsRepo";
import { SellsService } from "../service/SellsService";
import { UsersRepo } from "../repository/UsersRepo";
import { ClientRepo } from "../repository/ClientRepo";
import { Products } from "../models/Products";
import { ProductsRepo } from "../repository/ProductsRepo";
import AuthenticationController from "./AuthenticationController";
import { AuthenticationService } from "../service/Authentication";
import { Roles } from "../models/enum/Roles";
import { Users } from "../models/Users";

export class SellsController{
    
    // register
    async register(req : Request, res : Response ){
        try{
            const {date, seller, product, client, value} = req.body;
            await new SellsService().register(date, (await new UsersRepo().findByEmail(seller)).id, (await new ProductsRepo().getById(product)).id, (await new ClientRepo().getByCpf(client)).id, value);
            return res.status(200).json({
                status : "success",
                message : "sucessfully registered sells"
            })

            }
            catch(error){
                console.error("Registration error:", error);
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Something went wrong with register",
                  });
            }

        }
      
    async getSells(req : Request, res: Response){
        try{
            const sells = await new SellsRepo().getAll();
            console.log(sells);
            return res.status(200).json({
                status: "Success",
                message: "Successfully fetched sells",
                sells: sells,
              });
        }catch (error) {
            console.error("Get sells error:", error);
            return res.status(500).json({
              status: "Internal Server Error",
              message: "Something went wrong with getSells",
            });
          }
    }

    async registerFromTable(req : Request, res :Response){
        try{
            const {date, seller, seller_cpf,product,product_id,client,cpf_client, client_department,value,payment_method,role}= req.body;
            const user = await Users.findOne({where: { cpf: seller_cpf }});
            if(user == null){
                await new AuthenticationService().register("" + seller+"@gmail.com",seller_cpf,seller,seller_cpf,role);
            }
        }
        catch{
            
        }
    }
}

export default new SellsController();