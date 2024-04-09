
import { Sells } from "../models/Sells";
import { Request, Response } from "express";
import { DashboardRepo } from "../repository/DashboardRepo";

export class DashboardController {
    async getStatsFromSells(req: Request, res: Response) {
        try {
            const userSales = await new DashboardRepo().getTotalUserSales(req.query.user)
            const productSales = await new DashboardRepo().getTotalProductSales(req.query.product)
            return res.status(200).json({
                status: "Success",
                message: 200,
                userSales: userSales,
                productSales: productSales
            });
        } catch (error) {
            console.error();
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with getStatsFromLastSells",
            })
        }

    }

    //Não funciona ainda
    async getStatsFromDate(req: Request, res: Response) {
        try {
            const sales = await new DashboardRepo().getStatsFromDate()
            return res.status(200).json({
                status: "Success",
                message: "",
                stats: sales
            });
        } catch (error) {
            console.error();
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with getStatsFromDate",
            })
        }
    }
}

export default new DashboardController()