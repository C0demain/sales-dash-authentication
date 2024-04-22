import { Request , Response } from "express";
import { CommissionsRepo } from "../repository/CommissionsRepo";
import { Commissions } from "../models/Commissions";
import NotFoundError from "../exceptions/NotFound";

export class CommissionsController{
    async register(req: Request, res: Response){
        try{
            const { title, percentage } = req.body
            const commission = await new Commissions()
            commission.title = title
            commission.percentage = percentage
            await new CommissionsRepo().save(commission)
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
            const commissions = await new CommissionsRepo().getAll();
            return res.status(200).json({
                status: "Success",
                message: "Successfully fetched commissions",
                commissions: commissions
              });
        }catch (error) {
            console.error("Get commissions error:", error);
            return res.status(500).json({
              status: "Internal Server Error",
              message: "Something went wrong with getCommissions",
            });
          }
    }

    async getComission(req: Request, res: Response){
        const { commissionId } = req.params
        try{
          const commission = await new CommissionsRepo().getById(parseInt(commissionId))
          
          return res.status(200).json({
              status: "Success",
              message: "Successfully fetched commission",
              commission: commission
            });
        }catch (error) {
          if(error instanceof NotFoundError){
            return res.status(404).json({
              status: "Not Found",
              message: error.message,
            });
          }else{
            return res.status(500).json({
              status: "Internal Server Error",
              message: "Something went wrong with getCommission",
            });
        }
    }
  }

    async updateCommission(req: Request, res: Response){
      const { commissionId } = req.params
      const { title, percentage } = req.body
      try{
        const commissionRepo = new CommissionsRepo()
        const commission = await commissionRepo.getById(parseInt(commissionId))
        
        commission.title = title
        commission.percentage = percentage
        await commissionRepo.update(commission)
        return res.status(200).json({
          status: "Success",
          message: "Successfully updated commission"
        });
      }catch(error){
        if(error instanceof NotFoundError){
          return res.status(404).json({
            status: "Not Found",
            message: error.message,
          });
        }else{
          return res.status(500).json({
            status: "Internal Server Error",
            message: "Something went wrong with updateCommission",
        });
      }
    }
  }

    async deleteCommission(req: Request, res: Response){
      const { commissionId } = req.params
      try{
        await new CommissionsRepo().delete(parseInt(commissionId))
        return res.status(200).json({
          status: "Success",
          message: "Successfully deleted commission",
        });
      }catch (error) {
        if(error instanceof NotFoundError){
          return res.status(404).json({
            status: "Not Found",
            message: error.message,
          });
        }else{
          return res.status(500).json({
            status: "Internal Server Error",
            message: "Something went wrong with deleteCommission",
          });
    }
      }
    }
}

export default new CommissionsController()