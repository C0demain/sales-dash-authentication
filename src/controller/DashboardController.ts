
import { Request, Response } from "express";
import { DashboardRepo } from "../repository/DashboardRepo";
import NotFoundError from "../exceptions/NotFound";
import { subtractDays } from "../utils/Dates";
import { Op, WhereOptions } from "sequelize";
import { Products } from "../models/Products";
import { Client } from "../models/Client";
import { parse } from "path";

export class DashboardController {
    async getUserStats(req: Request, res: Response) {
        try {
            let filters = {}
            const { id, startDate, endDate } = req.query
            const newStartDate = startDate ? subtractDays(new Date(startDate.toString()), 1) : new Date('1970-01-01')
            const newEndDate = endDate ? new Date(endDate.toString()) : new Date()
            const newUserId = id?.toString() || "0"
            filters = { ...filters, ...{ userId: id, date: {[Op.between]: [newStartDate, newEndDate]} } }
            
            const userSales = await new DashboardRepo().getUserStats(parseInt(newUserId), filters)

            return res.status(200).json({
                status: "Success",
                message: `Showing stats from user ${id}`,
                userSales: userSales
            });
        } catch (error) {
            if(error instanceof NotFoundError){
                return res.status(404).json({
                    status: "Not Found",
                    message: error.message,
                });
            }else{
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Something went wrong with getUserStats",
                });
            }
        }
    }

    async getProductStats(req: Request, res: Response) {
        try {
            let filters = {}
            const { id, startDate, endDate } = req.query
            const newStartDate = startDate ? subtractDays(new Date(startDate.toString()), 1) : new Date('1970-01-01')
            const newEndDate = endDate ? new Date(endDate.toString()) : new Date()
            const newProductId = id?.toString() || "0"
            filters = { ...filters, ...{ productId: id, date: {[Op.between]: [newStartDate, newEndDate]} } }

            const productSales = await new DashboardRepo().getProductStats(parseInt(newProductId), filters)

            return res.status(200).json({
                status: "Success",
                message: `Showing stats from product: ${id}`,
                productStats: productSales
            });
        } catch (error) {
            if(error instanceof NotFoundError){
                return res.status(404).json({
                    status: "Not Found",
                    message: error.message,
                });
            }else{
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Something went wrong with getProductStats",
                });
            }
        }
    }

    async getClientStats(req: Request, res: Response) {
        try {
            let filters = {}
            const { id, startDate, endDate } = req.query
            const newStartDate = startDate ? subtractDays(new Date(startDate.toString()), 1) : new Date('1970-01-01')
            const newEndDate = endDate ? new Date(endDate.toString()) : new Date()
            const newClientStats = id?.toString() || "0"
            filters = { ...filters, ...{ clientId: id, date: {[Op.between]: [newStartDate, newEndDate]} } }

            const productSales = await new DashboardRepo().getClientStats(parseInt(newClientStats), filters)

            return res.status(200).json({
                status: "Success",
                message: `Showing stats from client ${id}`,
                clientStats: productSales
            });
        } catch (error) {
            if(error instanceof NotFoundError){
                return res.status(404).json({
                    status: "Not Found",
                    message: error.message,
                });
            }else{
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Something went wrong with getClientStats",
                });
            }
        }
    }

    //Não funciona ainda
    async getStatsFromDate(req: Request, res: Response) {
        let filters = {}
        const { startDate, endDate } = req.query
        const newStartDate = startDate ? subtractDays(new Date(startDate.toString()), 1) : new Date('1970-01-01')
        const newEndDate = endDate ? new Date(endDate.toString()) : new Date()
        console.log(newStartDate, newStartDate);        
        filters = { ...filters, ...{ date: {[Op.between]: [newStartDate, newEndDate]} } }


        console.log(filters);
        

        try {
            const sales = await new DashboardRepo().getStatsFromDate(filters)
            return res.status(200).json({
                status: "Success",
                message: `Showing stats from`,
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

    async getRanking(req: Request, res: Response) {
        try {
            const ranking = await new DashboardRepo().sortTotalValue()
            return res.status(200).json({
                status: "Success",
                message: `Showing ranking in order`,
                ranking: ranking
            });
        } catch (error) {
            console.error();
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with getRanking",
            })
        }
    }
}

export default new DashboardController()