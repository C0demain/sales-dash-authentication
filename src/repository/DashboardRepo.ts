import { log } from "console";
import { Sells } from "../models/Sells";
import { Client } from "../models/Client";
import { ClientRepo } from "./ClientRepo";
import { UsersRepo } from "./UsersRepo";

interface IDashboardRepo {
}

export class DashboardRepo implements IDashboardRepo {
    async getLatestSells(limit: number, order: string): Promise<Sells[]> {
        try {
            // Vendas recentes até determinado limite
            const sales = await Sells.findAll({
                limit: limit,
                //Order pode ser 'ASC' ou 'DESC'
                order: [['createdAt', order]]
            })
            return sales
        } catch (error) {
            throw new Error("Failed to get latest sales");
        }
    }

    //Não funciona por enquanto
    async getStatsFromDate(date?: Date): Promise<Sells[]> {
        if (!date) {
            date = new Date()
        }
        date.toUTCString
        try {
            const sales = await Sells.findAll({
                where: {
                    createdAt: {
                        lt: date.toUTCString()
                    }
                }
            })
            return await sales
        } catch (error) {
            throw new Error("Failed to get sales from given date")
        }
    }

    

    async getUserStats(id: any, date?: Date) {
        try {
            const u = await new UsersRepo().getById(id)
            const userName = u.name
            if (id) {
                const sales = await Sells.count({
                    where: {
                        userId: id
                    }
                })
                let totalValue = await Sells.sum('value', {
                    where: {
                        userId: id
                    }
                })
                if (!totalValue) {
                    totalValue = 0
                }
                const allSales = await Sells.findAll({
                    where: {
                        userId: id
                    }
                })
                let list: Object[] = []
                allSales.forEach(element => {
                    list.push([element.clientId,element.clientname].reduce((a, v) => ({a, [v]:v}), {}) )
                })
                
                return { userId: id, name: userName, totalSales: sales, totalValue: totalValue, buyers: list }
            }
            else {
                const u = await new UsersRepo().getById(id)
                const userName = u.name
                const sales = await Sells.count()
                let totalValue = await Sells.sum('value')
                if (!totalValue) {
                    totalValue = 0
                }
                return { userId: id, name: userName, totalSales: sales, totalValue: totalValue }
            }
        } catch (error) {
            throw new Error(`Failed to get sales stats from userId: ${id}`)
        }
    }

    async getTotalProductSales(product: any, date?: Date) {
        try {
            if (product) {
                const sales = await Sells.count({
                    where: {
                        product: product
                    }
                })
                let totalValue = await Sells.sum('value', {
                    where: {
                        product: product
                    }
                })

                if (!totalValue) {
                    totalValue = 0
                }
                return { productName: product, totalSales: sales, totalValue: totalValue }
            }
            else {
                const sales = await Sells.count()
                let totalValue = await Sells.sum('value')
                if (!totalValue) {
                    totalValue = 0
                }
                return { productName: product, totalSales: sales, totalValue: totalValue }
            }
        } catch (error) {
            throw new Error("Failed to get product stats")
        }
    }

    async getClientStats(client: any) {
        try {
            if (client) {
                const c = await new ClientRepo().getById(client)
                const clientName = c.name
                const sales = await Sells.count({
                    where: {
                        clientId: client
                    }
                })
                let totalValue = await Sells.sum('value', {
                    where: {
                        clientId: client
                    }
                })

                if (!totalValue) {
                    totalValue = 0
                }
                return { clientId: client, clientName: clientName, totalPurchases: sales, totalValue: totalValue }
            }
            else {
                const c = await new ClientRepo().getById(client)
                const clientName = c.name
                const sales = await Sells.count()
                let totalValue = await Sells.sum('value')
                if (!totalValue) {
                    totalValue = 0
                }
                return { clientId: client, clientName: clientName,totalPurchases: sales, totalValue: totalValue }
            }
        } catch (error) {
            throw new Error("Failed to get client stats")
        }
    }
    // Valor total no dia/mes
    // Vendas no dia/mês
    // Total de vendas por vendedor *
    // Vendas por produto *
}
