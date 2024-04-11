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
import { Client } from "../models/Client";
import { Sells } from "../models/Sells";

export class SellsController{
    
    // register
    async register(req : Request, res : Response ){
        try{
            const {date, seller_cpf, product_id, cpf_client, value} = req.body;
            await new SellsService().register(date, (await new UsersRepo().getByCpf(seller_cpf)).id,product_id, (await new ClientRepo().getByCpf(cpf_client)).id, value);
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
            const [testUser, userCreated] = await Users.findOrCreate({
                where : {cpf :seller_cpf },
                defaults: {
                    name : seller,
                    cpf : seller_cpf,
                    email : "" + seller + "@gmail.com",
                    password : seller_cpf,
                    role : role,
                }
            })
            
            const [testClient, clientCreated] = await Client.findOrCreate({
                where : {cpf: cpf_client},
                defaults : {
                    name : client,
                    segment : client_department,
                    cpf : cpf_client,
                }

            })

            const [testProduct, productCreated] = await Products.findOrCreate({
                where : {id : product_id},
                defaults : {
                    name : product,
                    description : "",
                    value : 0,
                }
            })

            await new SellsService().register(date, (await new UsersRepo().getByCpf(seller_cpf)).id,product_id, (await new ClientRepo().getByCpf(cpf_client)).id, value);

            
        }
        catch{
            
        }
    }
}

export default new SellsController();