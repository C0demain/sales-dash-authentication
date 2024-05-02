
import { Request, Response } from "express";
import { DashboardRepo } from "../repository/DashboardRepo";
import NotFoundError from "../exceptions/NotFound";
import { subtractDays } from "../utils/Dates";
import { Op, WhereOptions } from "sequelize";

export class DashboardController {
    async getLatestSales(req: Request, res: Response) {
        try {
            const limit: number = 50
            const order: string = 'DESC'
            const lastSales = await new DashboardRepo().getLatestSells(limit, order)
            return res.status(200).json({
                status: "Success",
                message: `Showing up to ${limit} sales in ${order} order`,
                lastSales: lastSales
            });
        } catch (error) {
            console.error();
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with getLatestSales",
            })
        }
    }

    async getUserStats(req: Request, res: Response) {
        try {
            const userId = req.params.id
            const userSales = await new DashboardRepo().getUserStats(userId)

            return res.status(200).json({
                status: "Success",
                message: `Showing stats from user ${userId}`,
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
            const product = req.params.id
            const productSales = await new DashboardRepo().getProductStats(product)

            return res.status(200).json({
                status: "Success",
                message: `Showing stats from product: ${product}`,
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
                    message: "Something went wrong with getClientStats",
                });
            }
        }
    }

    async getClientStats(req: Request, res: Response) {
        try {
            const id = req.params.id
            const totalPurchases = await new DashboardRepo().getClientStats(id)

            return res.status(200).json({
                status: "Success",
                message: `Showing stats from client ${id}`,
                clientStats: totalPurchases
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
        filters = { ...filters, ...{ date: {[Op.between]: [newStartDate, newEndDate]} } }
        try {
            console.log(filters)
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