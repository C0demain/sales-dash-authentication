import { WhereOptions } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import { Sells } from "../models/Sells";
import { ClientRepo } from "./ClientRepo";
import { UsersRepo } from "./UsersRepo";
import { Users } from "../models/Users";
import { Client } from "../models/Client";
import { Products } from "../models/Products";

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
    async getStatsFromDate(filters: WhereOptions) {
        try {
            const allSales = await Sells.findAll({
              where: filters, 
              include: [Users, Client, Products]
            });

            let totalSales = await Sells.count({
                where: filters
            }) || 0
            
            let totalValue = await Sells.sum('value', {
                where: filters
            }) || 0

            // Retorna um lista de objetos com o nome e ID do cliente e o ID do produto comprado
            let clientPurchases: { clientId: number, clientName: string, productid: number }[] = []
            allSales.forEach(element => {
                clientPurchases.push({ clientId: element.clientId, clientName: element.clientname, productid: element.productId })
            })

            // Retorna o numero de vezes que um cliente comprou com o usuário
            const occurrencesClients: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { clientName: any; }) => {
                const key = `${buyer.clientName}`;
                occurrencesClients[key] = (occurrencesClients[key] || 0) + 1;
            });

            const occurrencesProducts: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { productid: any; }) => {
                const key = `${buyer.productid}`;
                occurrencesProducts[key] = (occurrencesProducts[key] || 0) + 1;
            });

            return { totalSales, totalValue, salesPerClient: occurrencesClients, productsSold: occurrencesProducts, sales: clientPurchases }

          } catch (error) {
            throw new Error("Failed to fetch data!");
        }
    }

    async getUserStats(id: any, date?: Date) {
        try {
            const u = await new UsersRepo().getById(id)

            if(!u) throw new NotFoundError(`User with id '${id}' not found`);

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
            }) || 0
            const allSales = await Sells.findAll({
                where: {
                    userId: id
                }
            })

            // Retorna um lista de objetos com o nome e ID do cliente e o ID do produto comprado
            let clientPurchases: { clientId: number, clientName: string, productid: number }[] = []
            allSales.forEach(element => {
                clientPurchases.push({ clientId: element.clientId, clientName: element.clientname, productid: element.productId })
            })

            // Retorna o numero de vezes que um cliente comprou com o usuário
            const occurrencesClients: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { clientName: any; }) => {
                const key = `${buyer.clientName}`;
                occurrencesClients[key] = (occurrencesClients[key] || 0) + 1;
            });

            const occurrencesProducts: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { productid: any; }) => {
                const key = `${buyer.productid}`;
                occurrencesProducts[key] = (occurrencesProducts[key] || 0) + 1;
            });

            return { userId: id, name: userName, totalSales: sales, totalValue: totalValue, salesPerClient: occurrencesClients, productsSold: occurrencesProducts, sales: clientPurchases }
        } catch (error) {
            if(error instanceof NotFoundError) throw error
            else throw new Error('Failed to get user stats')
        }
    }

    async getProductStats(id: any, date?: Date) {
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
            const occurrencesClient: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { clientId: any; clientName: any; }) => {
                const key = `${buyer.clientName}`;
                occurrencesClient[key] = (occurrencesClient[key] || 0) + 1;
            });

            const occurrencesUser: { [key: string]: number } = {};
            clientPurchases.forEach((buyer: { sellerId: any; sellerName: any; }) => {
                const key = `${buyer.sellerName}`;
                occurrencesUser[key] = (occurrencesUser[key] || 0) + 1;
            });

            if (!totalValue) {
                totalValue = 0
            }
            return { productId: id, totalSales: sales, totalValue: totalValue, purchasesPerClient: occurrencesClient, soldPerUser: occurrencesUser, sales: clientPurchases }
        } catch (error) {
            throw new Error("Failed to get product stats")
        }
    }

    // Fazer filtragem por categoria
    async getClientStats(client: any) {
        try {
            const c = await new ClientRepo().getById(client)

            if(!c) throw new NotFoundError(`Client with id '${client}' not found`);

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

            const allSales = await Sells.findAll({
                where: {
                    clientId: client
                }
            })

            let productPurchases: { productId: number, sellerId: number, sellerName: string }[] = []
            allSales.forEach(element => {
                productPurchases.push({ productId: element.productId, sellerId: element.userId, sellerName: element.seller })
            })

            // Retorna o numero de vezes que um cliente comprou com o usuário
            const occurrencesProducts: { [key: string]: number } = {};
            productPurchases.forEach((buyer: { productId: any }) => {
                const key = `${buyer.productId}`;
                occurrencesProducts[key] = (occurrencesProducts[key] || 0) + 1;
            });

            const occurrencesUsers: { [key: string]: number } = {};
            productPurchases.forEach((buyer: { sellerName: any }) => {
                const key = `${buyer.sellerName}`;
                occurrencesUsers[key] = (occurrencesUsers[key] || 0) + 1;
            });

            return { clientId: client, clientName: clientName, totalPurchases: sales, totalValue: totalValue, productsPurchased: occurrencesProducts, purchasedWith: occurrencesUsers, sales: productPurchases }
        } catch (error) {
            if(error instanceof NotFoundError) throw error
            else throw new Error("Failed to get client stats")
        }
    }

    async sortTotalValue() {
        try {
            const usersList = await new UsersRepo().getAllSellers()

            let idList: number[] = []
            usersList.forEach(element => idList.push(element.id))
            let valueList: {name: string, id: number, value: number,productsSold: number, totalCommissions: number}[] = []
            for (let x of idList){
                let user = await new UsersRepo().getById(x)
                let userName = user.name
                let totalValue = await Sells.sum('value', {
                    where: {
                        userId: x
                    }
                })
                let totalCommissions = await Sells.sum('commissionValue', {
                    where: {
                        userId: x
                    },
                })
                const productsSold = await Sells.count({
                    where: {
                        userId: x
                    }
                })
                if (!totalValue){
                    totalValue = 0
                }
                if (!totalCommissions){
                    totalCommissions = 0
                }
                valueList.push({name: userName,id: x, value: totalValue, productsSold: productsSold, totalCommissions: totalCommissions})
            }
            
            valueList.sort((a, b) => a.value - b.value);

            return valueList.reverse()
        } catch (error) {
            throw new Error(``)
        }
    }
    // Valor total no dia/mes
    // Vendas no dia/mês
    // Total de vendas por vendedor *
    // Vendas por produto *
}