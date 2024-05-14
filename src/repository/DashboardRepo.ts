import { Op, WhereOptions } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import { Sells } from "../models/Sells";
import { ClientRepo } from "./ClientRepo";
import { ProductsRepo } from "./ProductsRepo";
import { UsersRepo } from "./UsersRepo";

interface IDashboardRepo {
}

export class DashboardRepo implements IDashboardRepo {
    async getStatsFromDate(filters: WhereOptions) {
        try {
            let [totalSales, totalValue, totalCommissions, allSales] = await Promise.all([
                Sells.count({ where: filters }) || 0,
                Sells.sum('value', { where: filters }) || 0,
                Sells.sum('commissionValue', { where: filters }) || 0,
                Sells.findAll({ where: filters })
            ]);            

            if (!totalValue || totalValue == null) {
                totalValue = 0
            }
            if (!totalCommissions || totalCommissions == null) {
                totalCommissions = 0
            }

            const clientPurchases = await Promise.all(allSales.map(async (sale) => {
                const client = await new ClientRepo().getById(sale.clientId);
                const product = await new ProductsRepo().getById(sale.productId)
                const user = await new UsersRepo().getById(sale.userId)
                return { sellerId: sale.userId, sellerName: user.name, clientId: sale.clientId, clientName: client.name, productId: sale.productId, productName: product.name };
            }));

            // Retorna o numero de vezes que um cliente comprou com o usuário
            const occurrencesClients: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { clientName: any; }) => {
                const key = `${buyer.clientName}`;
                occurrencesClients[key] = (occurrencesClients[key] || 0) + 1;
            });

            const occurrencesProducts: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { productName: any; }) => {
                const key = `${buyer.productName}`;
                occurrencesProducts[key] = (occurrencesProducts[key] || 0) + 1;
            });

            const occurrencesUser: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { sellerId: any; sellerName: any; }) => {
                const key = `${buyer.sellerName}`;
                occurrencesUser[key] = (occurrencesUser[key] || 0) + 1;
            });

            return { totalSales, totalValue, totalCommissions, clientPurchases: occurrencesClients, productsSold: occurrencesProducts, userSells: occurrencesUser }

        } catch (error) {
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

            let [sales, totalValue, totalCommissions, allSales] = await Promise.all([
                Sells.count({ where: filters }),
                Sells.sum('value', { where: filters }) || 0,
                Sells.sum('commissionValue', { where: filters }) || 0,
                Sells.findAll({ where: filters })
            ]);

            if (!totalValue || totalValue == null) {
                totalValue = 0
            }
            if (!totalCommissions || totalCommissions == null) {
                totalCommissions = 0
            }

            const soldUser = await Promise.all(allSales.map(async (sale) => {
                const client = await new ClientRepo().getById(sale.clientId);
                return { clientId: sale.clientId, clientName: client.name, productId: sale.productId };
            }));

            const occurrencesClients: { [key: string]: number } = {};
            soldUser.forEach((buyer: { clientId: number; clientName: string; }) => {
                const key = `${buyer.clientName}`;
                occurrencesClients[key] = (occurrencesClients[key] || 0) + 1;
            });

            const occurrencesProducts: { [key: string]: number } = {};
            soldUser.forEach((buyer: { productId: any }) => {
                const key = `${buyer.productId}`;
                occurrencesProducts[key] = (occurrencesProducts[key] || 0) + 1;
            });

            return { userId: id, name: userName, totalSales: sales, totalValue, totalCommissions, salesPerClient: occurrencesClients, productsSold: occurrencesProducts, sales: soldUser };
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

            let [sales, totalValue, totalCommissions, allSales] = await Promise.all([
                await Sells.count({ where: filters }) || 0,
                await Sells.sum('value', { where: filters }) || 0,
                await Sells.sum('commissionValue', { where: filters }) || 0,
                await Sells.findAll({ where: filters })]
            )

            if (!totalValue || totalValue == null) {
                totalValue = 0
            }
            if (!totalCommissions || totalCommissions == null) {
                totalCommissions = 0
            }

            const productPurchases = await Promise.all(allSales.map(
                async sale => {
                    const user = await new UsersRepo().getById(sale.userId)
                    const client = await new ClientRepo().getById(sale.clientId)
                    return { clientId: client.id, clientName: client.name, userId: user.id, userName: user.name }
                }
            ))

            // Retorna o numero de vezes que um cliente comprou com o usuário
            const occurrencesClient: { [key: string]: number } = {};
            productPurchases.forEach((buyer: { clientId: number; clientName: string; }) => {
                const key = `${buyer.clientName}`;
                occurrencesClient[key] = (occurrencesClient[key] || 0) + 1;
            });

            const occurrencesUser: { [key: string]: number } = {};
            productPurchases.forEach((buyer: { userName: string; }) => {
                const key = `${buyer.userName}`;
                occurrencesUser[key] = (occurrencesUser[key] || 0) + 1;
            });

            return { productId: id, productName: product.name, totalSales: sales, totalValue: totalValue, totalCommissions: totalCommissions, purchasesPerClient: occurrencesClient, soldPerUser: occurrencesUser, sales: productPurchases }
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

            let [totalValue, totalCommissions, sales, allSales] = await Promise.all([
                Sells.sum('value', { where: filters }),
                Sells.sum('commissionValue', { where: filters }),
                Sells.count({ where: filters }),
                Sells.findAll({ where: filters })
            ])

            if (!totalValue || totalValue == null) {
                totalValue = 0
            }
            if (!totalCommissions || totalCommissions == null) {
                totalCommissions = 0
            }

            const clientPurchases = await Promise.all(allSales.map(
                async sale => {
                    const user = await new UsersRepo().getById(sale.userId)
                    const product = await new ProductsRepo().getById(sale.productId)
                    return ({ productId: sale.productId, productName: product.name, sellerId: sale.userId, sellerName: user.name })
                }
            ))

            // Retorna o numero de vezes que um cliente comprou com o usuário
            const occurrencesProducts: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { productId: any }) => {
                const key = `${buyer.productId}`;
                occurrencesProducts[key] = (occurrencesProducts[key] || 0) + 1;
            });

            const occurrencesUsers: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { sellerName: any }) => {
                const key = `${buyer.sellerName}`;
                occurrencesUsers[key] = (occurrencesUsers[key] || 0) + 1;
            });

            return { clientId: client, clientName: clientName, totalPurchases: sales, totalValue: totalValue, totalCommissions: totalCommissions, productsPurchased: occurrencesProducts, purchasedWith: occurrencesUsers, sales: clientPurchases }
        } catch (error) {
            if (error instanceof NotFoundError) throw error
            else throw new Error("Failed to get client stats")
        }
    }

    async sortTotalValue(startDate: Date, endDate: Date) {
        try {
            const usersList = await new UsersRepo().getAllSellers()

            let idList: number[] = []
            usersList.forEach(element => idList.push(element.id))
            let valueList: { name: string, id: number, value: number, productsSold: number, totalCommissions: number }[] = []
            for (let x of idList) {
                let user = await new UsersRepo().getById(x)
                let userName = user.name
                const filters = { userId: x, date: { [Op.between]: [startDate, endDate] } }

                let [totalValue, totalCommissions, productsSold] = [
                    await Sells.sum('value', {
                        where: filters
                    }) || 0,
                    await Sells.sum('commissionValue', {
                        where: filters
                    }) || 0,
                    await Sells.count({
                        where: filters
                    }) || 0
                ]

                valueList.push({ name: userName, id: x, value: totalValue, productsSold: productsSold, totalCommissions: totalCommissions })
            }

            valueList.sort((a, b) => a.value - b.value);

            return valueList.reverse()
        } catch (error) {
            throw new Error(``)
        }
    }
}