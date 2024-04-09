import { Sells } from "../models/Sells";

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

            return await sales
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
            const sales = Sells.findAll({
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

    async getTotalUserSales(userID: any, date?: Date){
        try {
            const sales = await Sells.findAndCountAll({
                where:{
                    userId: userID
                }
            })
            return sales
        } catch (error) {
            throw new Error("Failed to count sales per user")
        }
    }

    async getTotalProductSales(product: any, date?: Date){
        try {
            const sales = await Sells.findAndCountAll({
                where:{
                    product: product
                }
            })
            return sales
        } catch (error) {
            throw new Error("Failed to count sales per user")
        }
    }
    // Valor total no dia/mes
    // Vendas no dia/mês
    // Total de vendas por vendedor *
    // Vendas por produto *
}
