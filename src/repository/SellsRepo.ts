import { WhereOptions } from "sequelize";
import { Client } from "../models/Client";
import { Products } from "../models/Products";
import { Sells } from "../models/Sells";
import { Users } from "../models/Users";
import { Commissions } from "../models/Commissions";

interface ISellsRepo {
  save(Sells: Sells): Promise<void>;
  update(Sells: Sells): Promise<void>;
  delete(SellsId: number): Promise<void>;
  getById(SellsId: number): Promise<Sells>;
  getAll(): Promise<Sells[]>;
  checkProduct(prodId : number): Promise<Sells | null>;
}

export class SellsRepo implements ISellsRepo {
  
  
  async save(sells: Sells): Promise<void> {
    try {
      const user = await Users.findOne({ where: { email: sells.seller } });
      const client = await Client.findOne({ where : {cpf : sells.client.cpf }});
      const prod = await Products.findOne({where :{id : sells.productId}});
      console.log(client)
      if (!user) {
        throw new Error("User not found");
      } 
      if(!client){
        throw new Error("Client not found");
      } 
      if(!prod){
        throw new Error("Product not found");
      } 
      await Sells.create({
        date : sells.date,
        seller : user.name,
        product : prod,
        productName: prod.name,
        productId : prod.id,
        clientId : client.id,
        client : client,
        clientname : client.name,
        value : sells.value,
        user : user,
        userId : user.id,
        new_client : sells.new_client,
        new_product : sells.new_product,
        commissionId: sells.commissionId,
        commissionValue: sells.commissionValue
      });
    } catch (error) {
      throw new Error("Failed to create Sell!");
    }
  }
  
  async delete(SellsId: number): Promise<void> {
    try {
      //  find existing Sells
      const new_Sells = await Sells.findOne({
        where: {
          id: SellsId,
        },
        include : [Users],
      });
      
      if (!new_Sells) {
        throw new Error("Sells not found");
      }
      // delete
      await new_Sells.destroy();
    } catch (error) {
      throw new Error("Failed to delete Sells!");
    }
  }
  
  async getById(SellsId: number): Promise<Sells> {
    try {
      //  find existing Sells
      const new_Sells = await Sells.findOne({
        where: {
          id: SellsId,
        },
      });
      
      if (!new_Sells) {
        throw new Error("Sells not found");
      }
      // Sells data
      return new_Sells;
    } catch (error) {
      throw new Error("Failed to delete Sells!");
    }
  }
  
  async getAll(): Promise<Sells[]> {
    try {
      return await Sells.findAll({
        include: [Users, Client, Commissions],
      });
    } catch (error) {
      throw new Error("Failed to feacth all data!");
    }
  }
  
  async getFiltered(filters: WhereOptions): Promise<Sells[]> {
    try {
      return await Sells.findAll({
        where: filters,
        include: [Users, Client, Products]
      });
    } catch (error) {
      throw new Error("Failed to feacth all data!");
    }
  }
  
  async update(sells: Sells): Promise<void> {
    try {
      const new_sell = await Sells.findOne({
        where: {
          id: sells.id,
        },
      });
      
      const user = await Users.findOne({
        where:{
          cpf : sells.user.cpf,
        }
      })
      
      if (!new_sell) {
        throw new Error("sell not found");
      }
      
      if(!user){
        throw new Error("Seller not in database");
      }
      
      new_sell.date = sells.date;
      new_sell.seller = user.name;
      new_sell.userId = user.id;
      new_sell.value = sells.value;
      
      
      await new_sell.save();
    } catch (error) {
      throw new Error("Failed to update sell!");
    }
  }
  async checkProduct(prodID : number): Promise<Sells| null> {
      try{
        const sell = await Sells.findOne({
        where: {
          productId: prodID,
        }
      });
      return sell;
    }
    catch(error){
      throw new Error("Impossible to complete operation");
    }
  }

  async checkSeller(userID : number): Promise<Sells| null> {
    try{
      const sell = await Sells.findOne({
      where: {
        sellerId: userID,
      }
    });
    return sell;
  }
  catch(error){
    throw new Error("Impossible to complete operation");
  }
}
}
