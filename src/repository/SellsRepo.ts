import { Sells } from "../models/Sells";
import { Users } from "../models/Users";

interface ISellsRepo {
  save(Sells: Sells): Promise<void>;
  update(Sells: Sells): Promise<void>;
  delete(SellsId: number): Promise<void>;
  getById(SellsId: number): Promise<Sells>;
  getAll(): Promise<Sells[]>;
}

export class SellsRepo implements ISellsRepo {

  
  async save(sells: Sells): Promise<void> {
    try {
      const user = await Users.findOne({ where: { email: sells.seller } });
      if (!user) {
        throw new Error("User not found");
      }  
      await Sells.create({
        date : sells.date,
        seller : user.name,
        product : sells.product,
        client : sells.client,
        client_department : sells.client_department,
        value : sells.value,
        user : user,
        userId : user.id,

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
        include : [Users],
      });
    } catch (error) {
      throw new Error("Failed to feacth all data!");
    }
  }

  update(Sells: Sells): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
