
import { Request, Response } from "express";
import { DashboardRepo } from "../repository/DashboardRepo";

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
            return res.status(500).json({
                status: "Internal Server Error",
                message: "User not found or does not exist",
            })
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
            console.error();
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with getProductStats",
            })
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
            console.error();
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with getClientStats",
            })
        }
    }

    //Não funciona ainda
    async getStatsFromDate(req: Request, res: Response) {
        try {
            const sales = await new DashboardRepo().getStatsFromDate()
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