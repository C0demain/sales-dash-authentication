import { Request , Response } from "express";
import { SellsRepo } from "../repository/SellsRepo";
import { SellsService } from "../service/SellsService";

export class SellsController{
    
    // register
    async register(req : Request, res : Response ){
        try{
            const {date, seller, product, client,client_department,value} = req.body;
            await new SellsService().register(date, seller, product, client, client_department, value);
            return res.status(200).json({
                status : "success",
                message : "sucessfully registered sell"
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
            const sells = new SellsRepo().getAll();
            return res.status(200).json({
                status: "Success",
                message: "Successfully fetched sells",
                sells: sells
              });
        }catch (error) {
            console.error("Get sells error:", error);
            return res.status(500).json({
              status: "Internal Server Error",
              message: "Something went wrong with getSells",
            });
          }
    }
    }

export default new SellsController();