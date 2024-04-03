import { Commissions } from "../models/Commissions";

interface ICommissionsRepo {
  save(Commissions: Commissions): Promise<void>;
  update(Commissions: Commissions): Promise<void>;
  delete(CommissionsId: number): Promise<void>;
  getById(CommissionsId: number): Promise<Commissions>;
  getAll(): Promise<Commissions[]>;
}

export class CommissionsRepo implements ICommissionsRepo {

  
  async save(commissions: Commissions): Promise<void> {
    try {
      await Commissions.create({
        title: commissions.title,
        percentage : commissions.percentage

      });
    } catch (error) {
      throw new Error("Failed to create Commission!");
    }
  }

  async delete(CommissionId: number): Promise<void> {
    try {
      //  find existing Commissions
      const newCommission = await Commissions.findOne({
        where: {
          id: CommissionId,
        },
      });

      if (!newCommission) {
        throw new Error("Commission not found");
      }
      // delete
      await newCommission.destroy();
    } catch (error) {
      throw new Error("Failed to delete Commission!");
    }
  }

  async getById(CommissionId: number): Promise<Commissions> {
    try {
      //  find existing Commissions
      const newCommission = await Commissions.findOne({
        where: {
          id: CommissionId,
        },
      });

      if (!newCommission) {
        throw new Error("Commission not found");
      }
      // Commissions data
      return newCommission;
    } catch (error) {
      throw new Error("Failed to fetch commission data!");
    }
  }

  async getAll(): Promise<Commissions[]> {
    try {
      return await Commissions.findAll();
    } catch (error) {
      throw new Error("Failed to feacth all data!");
    }
  }

  update(Commissions: Commissions): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
