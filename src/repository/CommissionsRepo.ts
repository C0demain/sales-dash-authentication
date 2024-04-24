import NotFoundError from "../exceptions/NotFound";
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
      const newCommission = await Commissions.findByPk(CommissionId)

      if (!newCommission) throw new NotFoundError(`Commission with id '${CommissionId}' not found`);

      // delete
      await newCommission.destroy();
    } catch (error) {
      if(error instanceof NotFoundError) throw error
      else throw new Error("Failed to delete Commission!");
    }
  }

  async getById(CommissionId: number): Promise<Commissions> {
    try {
      //  find existing Commissions
      const newCommission = await Commissions.findByPk(CommissionId)

      if(!newCommission) throw new NotFoundError(`Commission with id '${CommissionId}' not found`)
      // Commissions data
      return newCommission;
    } catch (error) {
      if(error instanceof NotFoundError) throw error
      else throw new Error("Failed to fetch commission data!");
    }
  }

  async getAll(): Promise<Commissions[]> {
    try {
      return await Commissions.findAll();
    } catch (error) {
      throw new Error("Failed to feacth all data!");
    }
  }

  async update(commission: Commissions): Promise<void> {
    try{
      const newCommission = await Commissions.findByPk(Number(commission.id))

      if(!newCommission) throw new NotFoundError(`Commission with id '${commission.id}' not found`);

      await commission.save()

    }catch(error){
      if(error instanceof NotFoundError) throw error
      else throw new Error("Failed to update data!");
    }
  }
}
