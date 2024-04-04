import { Request , Response } from "express";
import { CommissionsRepo } from "../repository/CommissionsRepo";
import { CommissionsService } from "../service/Commissions";

export class CommissionsController{
    async register(req: Request, res: Response){
        try{
            const { title, percentage } = req.body
            await new CommissionsService().register(title, percentage)
            return res.status(200).json({
                status : "success",
                message : "sucessfully registered commission"
            })
        }catch(error){
            console.error("Registration error:", error);
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with register",
              });
        }
    }

    async getCommissions(req : Request, res: Response){
        try{
            const commission = await new CommissionsRepo().getAll();
            return res.status(200).json({
                status: "Success",
                message: "Successfully fetched commissions",
                commissions: commission
              });
        }catch (error) {
            console.error("Get commissions error:", error);
            return res.status(500).json({
              status: "Internal Server Error",
              message: "Something went wrong with getCommissions",
            });
          }
    }
}

export default new CommissionsController()