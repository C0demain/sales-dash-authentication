import { Op, WhereOptions } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import { Sells } from "../models/Sells";
import { ClientRepo } from "./ClientRepo";
import { ProductsRepo } from "./ProductsRepo";
import { UsersRepo } from "./UsersRepo";
import { Commissions } from "../models/Commissions";

interface IDashboardRepo {
    getStatsFromDate(filters: WhereOptions): Promise<MonthSaleStats[]>
}

interface MonthSaleStats {
    month: string
    year: number
    totalValue: number
    totalSales: number
    totalCommissionValue: number
}

interface CommissionMonthSaleStats {
    month: string
    year: number
    commissionValues: Array<{
        title: string
        totalValue: number
        totalSales: number
    }>
}

// interface UserStats {

// }

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export class DashboardRepo implements IDashboardRepo {
    async getStatsFromDate(filters: WhereOptions | any) {
        try {
            const stats: MonthSaleStats[] = []
            const sales = await Sells.findAll({ where: filters, order: [['date', 'ASC']]})
            const [startDate, endDate]: Date[] = filters.date[Op.between]
            var currentDate: Date = startDate
            while(currentDate.getFullYear() <= endDate.getFullYear()){
                stats.push({
                    month: meses[currentDate.getMonth()],
                    year: currentDate.getFullYear(),
                    totalValue: 0,
                    totalCommissionValue: 0,
                    totalSales: 0
                })
                if(currentDate.getMonth() == endDate.getMonth() && currentDate.getFullYear() == endDate.getFullYear()){
                    break
                }
                currentDate.setMonth(currentDate.getMonth()+1)
            }
            for(let sale of sales){
                const currentStat = stats.find(st => st.month == meses[new Date(sale.date+"T00:00").getMonth()] && st.year == new Date(sale.date+"T00:00").getFullYear())
                if(currentStat){
                    currentStat.totalValue += sale.value
                    currentStat.totalCommissionValue += sale.commissionValue
                    currentStat.totalSales += 1
                }
                
            }
            return stats


        } catch (error) {
            console.log(error)
            throw new Error("Failed to fetch data!");
        }
    }

    async getCommissionStatsFromDate(filters: WhereOptions) {
        try {
            const stats: CommissionMonthSaleStats[] = []
            const defaultCommissionStats = []
            for(let com of await Commissions.findAll()){
                defaultCommissionStats.push({
                    title: com.title,
                    totalValue: 0,
                    totalSales: 0,
                })
            }
            const sales = await Sells.findAll({ where: filters, order: [['date', 'ASC']], include: Commissions})
            for (const s of sales) {
                const date = new Date(s.date+'T00:00')
                const oldSale = stats.find(sale => sale.month == meses[date.getMonth()] && sale.year == date.getFullYear())
                if (stats.length === 0 || !oldSale) {
                    const commissionStatsCopy = JSON.parse(JSON.stringify(defaultCommissionStats))
                    commissionStatsCopy[s.commissionId-1].totalValue = s.commissionValue
                    commissionStatsCopy[s.commissionId-1].totalSales = 1
                    const newSale: CommissionMonthSaleStats = {
                        month: meses[date.getMonth()],
                        year: date.getFullYear(),
                        commissionValues: commissionStatsCopy,
                    }
                    stats.push(newSale)
                } else {
                    oldSale.commissionValues[s.commissionId-1].totalValue += s.commissionValue
                    oldSale.commissionValues[s.commissionId-1].totalSales += 1
                }

            }

            return stats

        } catch (error) {
            console.log(error)
            throw new Error("Failed to fetch data!");
        }
    }
    async getClientStatsFromDate(filters: WhereOptions | any) {
        try {
            const stats: MonthSaleStats[] = []
            const sales = await Sells.findAll({ where: filters, order: [['date', 'ASC']]})
            const [startDate, endDate]: Date[] = filters.date[Op.between]
            var currentDate: Date = startDate
            while(currentDate.getFullYear() <= endDate.getFullYear()){
                stats.push({
                    month: meses[currentDate.getMonth()],
                    year: currentDate.getFullYear(),
                    totalValue: 0,
                    totalCommissionValue: 0,
                    totalSales: 0
                })
                if(currentDate.getMonth() == endDate.getMonth() && currentDate.getFullYear() == endDate.getFullYear()){
                    break
                }
                currentDate.setMonth(currentDate.getMonth()+1)
            }
            for(let sale of sales){
                const currentStat = stats.find(st => st.month == meses[new Date(sale.date+"T00:00").getMonth()] && st.year == new Date(sale.date+"T00:00").getFullYear())
                if(currentStat){
                    currentStat.totalValue += parseFloat((sale.value).toFixed(2))
                    currentStat.totalCommissionValue += parseFloat((sale.commissionValue).toFixed(2))
                    currentStat.totalSales += 1
                }
                
            }
            return stats


        } catch (error) {
            console.log(error)
            throw new Error("Failed to fetch data!");
        }
    }

    async getProductStatsFromDate(filters: WhereOptions | any) {
        try {
            const stats: MonthSaleStats[] = []
            const sales = await Sells.findAll({ where: filters, order: [['date', 'ASC']]})
            const [startDate, endDate]: Date[] = filters.date[Op.between]
            var currentDate: Date = startDate
            while(currentDate.getFullYear() <= endDate.getFullYear()){
                stats.push({
                    month: meses[currentDate.getMonth()],
                    year: currentDate.getFullYear(),
                    totalValue: 0,
                    totalCommissionValue: 0,
                    totalSales: 0
                })
                if(currentDate.getMonth() == endDate.getMonth() && currentDate.getFullYear() == endDate.getFullYear()){
                    break
                }
                currentDate.setMonth(currentDate.getMonth()+1)
            }
            for(let sale of sales){
                const currentStat = stats.find(st => st.month == meses[new Date(sale.date+"T00:00").getMonth()] && st.year == new Date(sale.date+"T00:00").getFullYear())
                if(currentStat){
                    currentStat.totalValue += parseFloat((sale.value).toFixed(2))
                    currentStat.totalCommissionValue += parseFloat((sale.commissionValue).toFixed(2))
                    currentStat.totalSales += 1
                }
                
            }
            
            return stats


        } catch (error) {
            console.log(error)
            throw new Error("Failed to fetch data!");
        }
    }

    async getUserStats(id: number, filters: WhereOptions) {
        try {
            const user = await new UsersRepo().getById(id);

            if (!user) {
                console.log("User not found");
                throw new NotFoundError(`User with id '${id}' not found`);
            }

            const userName = user.name
            const allSales = await Sells.findAll({ where: filters })
            const salesInfo = await this.salesInfo(filters);

            const soldUser = await Promise.all(allSales.map(async (sale) => {
                const client = await new ClientRepo().getById(sale.clientId);
                const product = await new ProductsRepo().getById(sale.productId);
                return { clientId: sale.clientId, clientName: client.name, productId: sale.productId, productName: product.name };
            }));

            const occurrencesClients = this.countOccurrences(soldUser, 'clientName')
            const occurrencesProducts = this.countOccurrences(soldUser, 'productName')

            return { userId: id, name: userName, ...salesInfo, salesPerClient: occurrencesClients, productsSold: occurrencesProducts, sales: soldUser };
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            } else {
                throw new Error('Failed to get user stats');
            }
        }
    }

    async getProductStats(id: number, filters: WhereOptions) {
        try {
            const product = await new ProductsRepo().getById(id)

            if (!product) {
                throw new NotFoundError(`User with id '${id}' not found`);
            }

            const allSales = await Sells.findAll({ where: filters })
            const salesInfo = await this.salesInfo(filters);
            const productPurchases = await Promise.all(allSales.map(
                async sale => {
                    const user = await new UsersRepo().getById(sale.userId)
                    const client = await new ClientRepo().getById(sale.clientId)
                    return { clientId: client.id, clientName: client.name, userId: user.id, userName: user.name }
                }
            ))

            // Retorna o numero de vezes que um cliente comprou com o usuário
            const occurrencesClients = this.countOccurrences(productPurchases, 'clientName')
            const occurrencesUsers = this.countOccurrences(productPurchases, 'userName')

            return { productId: id, productName: product.name, ...salesInfo, purchasesPerClient: occurrencesClients, soldPerUser: occurrencesUsers, sales: productPurchases }
        } catch (error) {
            throw new Error("Failed to get product stats")
        }
    }

    // Fazer filtragem por categoria
    async getClientStats(id: number, filters: WhereOptions) {
        try {
            const client = await new ClientRepo().getById(id)
            const clientName = client.name

            if (!client) throw new NotFoundError(`Client with id '${client}' not found`);

            const allSales = await Sells.findAll({ where: filters })
            const salesInfo = await this.salesInfo(filters);
            const clientPurchases = await Promise.all(allSales.map(
                async sale => {
                    const user = await new UsersRepo().getById(sale.userId)
                    const product = await new ProductsRepo().getById(sale.productId)
                    return ({ productId: sale.productId, productName: product.name, sellerId: sale.userId, sellerName: user.name })
                }
            ))

            const occurrencesProducts = this.countOccurrences(clientPurchases, 'productName')
            const occurrencesUsers = this.countOccurrences(clientPurchases, 'userName')

            return { clientId: client, clientName: clientName, ...salesInfo, productsPurchased: occurrencesProducts, purchasedWith: occurrencesUsers, sales: clientPurchases }
        } catch (error) {
            if (error instanceof NotFoundError) throw error
            else throw new Error("Failed to get client stats")
        }
    }

    async sortTotalValue(startDate: Date, endDate: Date) {
        try {
            const usersList = await new UsersRepo().getAllSellers()

            const valueList = await Promise.all(usersList.map(async (user) => {
                const filters = { userId: user.id, date: { [Op.between]: [startDate, endDate] } }
                const salesInfo = await this.salesInfo(filters)

                return { name: user.name, id: user.id, value: salesInfo.totalValue, productsSold: salesInfo.totalSales, commissions: salesInfo.totalCommissions }
            }))

            return valueList.sort((a, b) => a.value - b.value).reverse()
        } catch (error) {
            throw new Error("Failed to sort by total value");
        }
    }

    private countOccurrences(array: any[], key: string) {
        return array.reduce((accumulator, item) => {
            const value = item[key];
            accumulator[value] = (accumulator[value] || 0) + 1;
            return accumulator;
        }, {} as { [key: string]: number });
    }

    private salesInfo = async (filters: WhereOptions) => {
        const [totalValue, totalCommissions, totalSales] = await Promise.all([
            await Sells.sum('value', { where: filters }) || 0,
            await Sells.sum('commissionValue', { where: filters }) || 0,
            await Sells.count({ where: filters }) || 0,
        ])
        return { totalValue, totalCommissions, totalSales }
    }
}