import { Sells } from "../models/Sells";
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

            // Retorna um lista de objetos com o nome e ID do cliente e o ID do produto comprado
            let clientPurchases: { clientId: number, clientName: string, productid: number }[] = []
            allSales.forEach(element => {
                clientPurchases.push({ clientId: element.clientId, clientName: element.clientname, productid: element.productid })
            })

            // Retorna o numero de vezes que um cliente comprou com o usuário
            const occurrences: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { clientId: any; clientName: any; }) => {
                const key = `${buyer.clientName}`;
                occurrences[key] = (occurrences[key] || 0) + 1;
            });

            return { userId: id, name: userName, totalSales: sales, totalValue: totalValue, salesPerClient: occurrences, sales: clientPurchases }
        } catch (error) {
            throw new Error(`Failed to get sales stats from userId: ${id}`)
        }
    }

    async getTotalProductSales(id: any, date?: Date) {
        try {
            const sales = await Sells.count({
                where: {
                    productid: id
                }
            })
            let totalValue = await Sells.sum('value', {
                where: {
                    productid: id
                }
            })

            const allSales = await Sells.findAll({
                where: {
                    productid: id
                }
            })

            // Retorna um lista de objetos com o nome e ID do cliente e o ID do produto comprado
            let clientPurchases: { clientId: number, clientName: string, sellerId: number, sellerName: string }[] = []
            allSales.forEach(element => {
                clientPurchases.push({ clientId: element.clientId, clientName: element.clientname, sellerId: element.userId, sellerName: element.seller })
            })

            // Retorna o numero de vezes que um cliente comprou com o usuário
            const occurrences: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { clientId: any; clientName: any; }) => {
                const key = `${buyer.clientName}`;
                occurrences[key] = (occurrences[key] || 0) + 1;
            });

            if (!totalValue) {
                totalValue = 0
            }
            return { productId: id, totalSales: sales, totalValue: totalValue, purchasesPerClient: occurrences, purchases: clientPurchases }
        } catch (error) {
            throw new Error("Failed to get product stats")
        }
    }

    // Fazer filtragem por categoria
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
                return { clientId: client, clientName: clientName, totalPurchases: sales, totalValue: totalValue }
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
