
import { Request, Response } from "express";
import { Op } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import { DashboardRepo } from "../repository/DashboardRepo";
import { subtractDays } from "../utils/Dates";
import { DatabaseCleaner } from "../service/DatabaseCleaner";
import { SellsRepo } from "../repository/SellsRepo";
import { isStringObject } from "util/types";

export class DashboardController {
    async getUserStats(req: Request, res: Response) {
        try {
            let filters = {}
            const { id, startDate, endDate } = req.query
            const newStartDate = startDate ? subtractDays(new Date(startDate.toString()), 1) : new Date('1970-01-01')
            const newEndDate = endDate ? new Date(endDate.toString()) : new Date()
            const newUserId = parseInt(id?.toString() || "0")
            filters = { ...filters, ...{ userId: id, date: { [Op.between]: [newStartDate, newEndDate] } } }

            console.log(id, newUserId)

            const userSales = await new DashboardRepo().getUserStats(newUserId, filters)

            return res.status(200).json({
                status: "Success",
                message: `Showing stats from user ${id}`,
                userSales: userSales
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    status: "Not Found",
                    message: error.message,
                });
            } else {
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
            filters = { ...filters, ...{ productId: id, date: { [Op.between]: [newStartDate, newEndDate] } } }

            const productSales = await new DashboardRepo().getProductStats(parseInt(newProductId), filters)

            return res.status(200).json({
                status: "Success",
                message: `Showing stats from product: ${id}`,
                productStats: productSales
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    status: "Not Found",
                    message: error.message,
                });
            } else {
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
            filters = { ...filters, ...{ clientId: id, date: { [Op.between]: [newStartDate, newEndDate] } } }

            const productSales = await new DashboardRepo().getClientStats(parseInt(newClientStats), filters)

            return res.status(200).json({
                status: "Success",
                message: `Showing stats from client ${id}`,
                clientStats: productSales
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    status: "Not Found",
                    message: error.message,
                });
            } else {
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Something went wrong with getClientStats",
                });
            }
        }
    }

    async getStatsFromDate(req: Request, res: Response) {
        let filters = {}
        const { userId } = req.query
        const { startDate, endDate } = req.query
        const newStartDate = startDate ? new Date(startDate.toString()+'T00:00') : new Date('1970-01-01')
        const newEndDate = endDate ? new Date(endDate.toString()+'T00:00') : new Date()
        filters = { ...filters, ...{ date: { [Op.between]: [newStartDate, newEndDate] } } }

        if (userId) filters = { ...filters, userId: userId }

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

    async getCommissionStatsFromDate(req: Request, res: Response) {
        let filters = {}
        const { userId } = req.query
        const { startDate, endDate } = req.query
        const newStartDate = startDate ? new Date(startDate.toString()+'T00:00') : new Date('1970-01-01')
        const newEndDate = endDate ? new Date(endDate.toString()+'T00:00') : new Date()
        filters = { ...filters, ...{ date: { [Op.between]: [newStartDate, newEndDate] } } }

        if (userId) filters = { ...filters, userId: userId }

        console.log(filters);

        try {
            const sales = await new DashboardRepo().getCommissionStatsFromDate(filters)
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

    async getClientStatsFromDate(req: Request, res: Response) {
        let filters = {}
        const { clientId } = req.query
        const { startDate, endDate } = req.query
        const newStartDate = startDate ? new Date(startDate.toString()+'T00:00') : new Date('1970-01-01')
        const newEndDate = endDate ? new Date(endDate.toString()+'T00:00') : new Date()
        newStartDate.setDate(newStartDate.getDate() - 1);
        filters = { ...filters, ...{ date: { [Op.between]: [newStartDate, newEndDate] } } }

        if (clientId) filters = { ...filters, clientId: clientId }

        console.log(filters);

        try {
            const sales = await new DashboardRepo().getClientStatsFromDate(filters);
            return res.status(200).json({
                status: "Success",
                message: `Showing stats from client with id: ${clientId}`,
                stats: sales
            });
        } catch (error) {
            console.error();
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with getClientStatsFromDate",
            })
        }
    }

    async getProductStatsFromDate(req: Request, res: Response) {
        let filters = {}
        const { productId } = req.query
        const { startDate, endDate } = req.query
        const newStartDate = startDate ? new Date(startDate.toString()+'T00:00') : new Date('1970-01-01')
        const newEndDate = endDate ? new Date(endDate.toString()+'T00:00') : new Date()
        newStartDate.setDate(newStartDate.getDate() - 1);
        filters = { ...filters, ...{ date: { [Op.between]: [newStartDate, newEndDate] } } }

        if (productId) filters = { ...filters, productId: productId }

        console.log(filters);

        try {
            const sales = await new DashboardRepo().getProductStatsFromDate(filters);
            return res.status(200).json({
                status: "Success",
                message: `Showing stats from product with id:${productId}`,
                stats: sales
            });
        } catch (error) {
            console.error();
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with getProductStatsFromDate",
            })
        }
    }

    async getRanking(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query
            const newStartDate = startDate ? subtractDays(new Date(startDate.toString()), 1) : new Date('1970-01-01')
            const newEndDate = endDate ? new Date(endDate.toString()) : new Date()

            const ranking = await new DashboardRepo().sortTotalValue(newStartDate, newEndDate)
            return res.status(200).json({
                status: "Success",
                message: `Showing ranking from interval: ${newStartDate} to ${newEndDate}`,
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

    async cleanDatabase(req: Request, res: Response) {
        try {
            await DatabaseCleaner.cleanDatabase(res);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to clear and seed the database" });
        }
    }
}

export default new DashboardController()