
import { Sells } from "../models/Sells";
import { Request, Response } from "express";
import { DashboardRepo } from "../repository/DashboardRepo";
import { count } from "console";
import { or } from "sequelize";

export class DashboardController {
    async getLatestSales(req: Request, res: Response) {
        try {
            const limit: number = 50
            const order:string = 'DESC'
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
                console.error();
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Something went wrong with getUserStats",
                })
            }

        }
    async getProductStats(req: Request, res: Response) {
            try {
                const product = req.params.name
                const productSales = await new DashboardRepo().getTotalProductSales(product)

                return res.status(200).json({
                    status: "Success",
                    message: `Showing stats from ${product}`,
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
    }

export default new DashboardController()