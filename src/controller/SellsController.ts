import { Request, Response } from "express";
import { Client } from "../models/Client";
import { Products } from "../models/Products";
import { Users } from "../models/Users";
import { ClientRepo } from "../repository/ClientRepo";
import { SellsRepo } from "../repository/SellsRepo";
import { UsersRepo } from "../repository/UsersRepo";
import { SellsService } from "../service/SellsService";
import Authentication from "../utils/Authentication";
import { Commissions } from "../models/Commissions";
import { Op } from "sequelize";
import { addDays, subtractDays } from "../utils/Dates";

export class SellsController {

  async register(req: Request, res: Response) {
    try {
      const { date, seller_cpf, product_id, cpf_client, value} = req.body;
      const clientCreated = await Client.findOne({
        where: { cpf: cpf_client }
      })      
      const productCreated = await Products.findOne({
        where: { id: product_id }
      })

      const clientIsNew = clientCreated == null
      const productIsNew = productCreated == null
      const commissionId = getCommission(clientIsNew, productIsNew)

      const commission = await Commissions.findByPk(commissionId)
      const commissionValue = commission!.percentage * value

      await new SellsService().register(date, (await new UsersRepo().getByCpf(seller_cpf)).id, product_id, (await new ClientRepo().getByCpf(cpf_client)).id, value, clientIsNew, productIsNew, commissionId, commissionValue);
      return res.status(200).json({
        status: "success",
        message: "sucessfully registered sells"
      })
    }
    catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong with register",
      });
    }

  }

  async getFilteredSells(req: Request, res: Response) {
    const { userId, productId, clientId, startDate, endDate } = req.query
    let filters = {}
    if (userId) filters = { ...filters, ...{ userId: userId } }
    if (productId) filters = { ...filters, ...{ productId: productId } }
    if (clientId) filters = { ...filters, ...{ clientId: clientId } }

    // Filter sells between two optional dates
    const newStartDate = startDate ? subtractDays(new Date(startDate.toString()), 1) : new Date('1970-01-01')
    const newEndDate = endDate ? new Date(endDate.toString()) : new Date()
    filters = { ...filters, ...{ date: {[Op.between]: [newStartDate, newEndDate]} } }

    try {
      const sells = await new SellsRepo().getFiltered(filters);

      return res.status(200).json({
        status: "Success",
        message: "Successfully fetched sells",
        sells: sells,
      });
    } catch (error) {
      console.error("Get sells error:", error);
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong with getSells",
      });
    }
  }

  async registerFromTable(req: Request, res: Response) {
    try {
      const { date, seller, seller_cpf, product, product_Id, client, cpf_client, client_department, value, payment_method, role } = req.body;
      const [testUser, userCreated] = await Users.findOrCreate({
        where: { cpf: seller_cpf },
        defaults: {
          name: seller,
          cpf: seller_cpf,
          email: seller.replace(/\s+/g, '') + "@gmail.com",
          password: await Authentication.passwordHash(seller_cpf),
          role: role,
        }
      })

      const [testClient, clientCreated] = await Client.findOrCreate({
        where: { cpf: cpf_client },
        defaults: {
          name: client,
          segment: client_department,
          cpf: cpf_client,
        }
      })

      const [testProduct, productCreated] = await Products.findOrCreate({
        where: { id: product_Id },
        defaults: {
          name: product,
          description: "",
          value: 0,
        }
      })

      const commissionId:number = getCommission(clientCreated, productCreated)
      const commission = await Commissions.findByPk(commissionId)
      const commissionValue = commission!.percentage * value

      console.log(commissionId, commissionValue);

      await new SellsService().register(date, testUser.id, testProduct.id, testClient.id, value, clientCreated, productCreated, commissionId, commissionValue);

      return res.status(200).json({
        status: "Success",
        message: "Successfully registered sell",
      });

    } catch (error) {
      console.error("Register from table error:", error);
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong with registerFromTable",
      });
    }
  }

  async updateSell(req: Request, res: Response) {
    const { sellId } = req.params;
    const { date, seller_cpf, value } = req.body;
    try {
      const userRepo = new UsersRepo();
      const sellsRepo = new SellsRepo();
      const user = await userRepo.getByCpf(seller_cpf);
      const sell = await sellsRepo.getById(parseInt(sellId));
      if (!user) {
        return res.status(404).json({
          status: "Not found",
          message: "User not found",
        });
      }
      if (!sell) {
        return res.status(404).json({
          status: "Not found",
          message: "Sell not found",
        });
      }
      sell.date = date;
      sell.seller = user.name;
      sell.user = user;
      sell.userId = user.id;
      sell.value = value;


      await sellsRepo.update(sell);
      return res.status(200).json({
        status: "Success",
        message: "Successfully updated sell"
      });
    } catch (error) {
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong with updateSell",
      });
    }
  }

  async getSells(req: Request, res: Response) {
    try {
        const sells = await new SellsRepo().getAll();
        return res.status(200).json({
            status: "Success",
            message: "Successfully fetched sells",
            sell: sells,
        });
    } catch (error) {
        console.error("Get client error:", error);
        return res.status(500).json({
            status: "Internal Server Error",
            message: "Something went wrong with getsells",
        });
    }
}
}

const getCommission = (clientCreated: boolean, productCreated: boolean):number => {
  if (clientCreated && productCreated) {
    return 1
  } else if (clientCreated) {
    return 2
  } else if (productCreated) {
    return 3
  } else {
    return 4
  }
}



export default new SellsController();