import { Json } from "sequelize/types/utils";
import { Sells } from "../models/Sells";
import { where } from "sequelize";

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

    async getUserStats(id: any, date?: Date){
        try {
            if (id){
                const sales = await Sells.count({
                    where:{
                        userId: id
                    }
                })
                let totalValue = await Sells.sum('value', {where:{
                    userId: id
                }})
                
                if (!totalValue){
                    totalValue = 0
                }
                return {userId: id, totalSales: sales, totalValue: totalValue}
            }
            else{
                const sales = await Sells.count()
                let totalValue = await Sells.sum('value')
                if (!totalValue){
                    totalValue = 0
                }
                return {userId: id, totalSales: sales, totalValue: totalValue}
            }
        } catch (error) {
            throw new Error(`Failed to get sales stats from userId: ${id}`)
        }
    }

    async getTotalProductSales(product: any, date?: Date){
        try {
            if (product){
                const sales = await Sells.count({
                    where:{
                        product: product
                    }
                })
                let totalValue = await Sells.sum('value', {where:{
                    product: product
                }})
                
                if (!totalValue){
                    totalValue = 0
                }
                return {productName: product, totalSales: sales, totalValue: totalValue}
            }
            else{
                const sales = await Sells.count()
                let totalValue = await Sells.sum('value')
                if (!totalValue){
                    totalValue = 0
                }
                return {productName: product, totalSales: sales, totalValue: totalValue}
            }
        } catch (error) {
            throw new Error("Failed to count sales per user")
        }
    }
    // Valor total no dia/mes
    // Vendas no dia/mês
    // Total de vendas por vendedor *
    // Vendas por produto *
}
