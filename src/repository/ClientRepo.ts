import { UniqueConstraintError } from "sequelize";
import { Client } from "../models/Client";
import NotFoundError from "../exceptions/NotFound";
import { Users } from "../models/Users";
import { SellsRepo } from "./SellsRepo";

interface IClientRepo {
  save(client: Client): Promise<void>;
  update(client: Client): Promise<void>;
  delete(clientId: number): Promise<void>;
  getById(clientId: number): Promise<Client>;
  getAll(userId: number | undefined): Promise<Client[]>;
  delete(clientId: number): Promise<void>;
}

export class ClientRepo implements IClientRepo {

  async save(client: Client): Promise<void> {
    try {
      await Client.create({
        name: client.name,
        segment: client.segment,
        cpf: client.cpf,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw error
      else throw new Error("Failed to create client!");
    }
  }

  async update(client: Client): Promise<void> {
    try {

      const new_client = await Client.findOne({
        where: {
          id: client.id,
        },
      });

      if (!new_client) throw new NotFoundError(`Client with id ${client.id} not found`);

      new_client.name = client.name;
      new_client.cpf = client.cpf;
      new_client.segment = client.segment;

      await new_client.save();
    } catch (error) {
      throw error
    }
  }

  async delete(clientId: number): Promise<void> {
    try {

      const client = await Client.findOne({
        where: { id: clientId },
      });

      if (!client) throw new NotFoundError(`Client with id '${clientId}' not found`);

      await client.destroy();
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to delete client!");
    }
  }


  async getById(clientId: number): Promise<Client> {
    try {

      const new_client = await Client.findOne({
        where: {
          id: clientId,
        },
      });

      if (!new_client) throw new NotFoundError(`Client with id '${clientId}' not found`);

      return new_client;
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to get client!");
    }
  }

  async getByCpf(clientcpf: string): Promise<Client> {
    try {
      const new_client = await Client.findOne({
        where: {
          cpf: clientcpf,
        },
      });

      if (!new_client) throw new NotFoundError(`Client with cpf '${clientcpf}' not found`);

      return new_client;
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to get client!");
    }
  }


  async getAll(userId: number | undefined): Promise<Client[]> {
    try {
      if (userId !== undefined) {
        const user = await Users.findByPk(userId)
        if (!user) {
          console.log("User not found");
          throw new NotFoundError(`User with id '${userId}' not found`);
        }

        const sales = await new SellsRepo().getFiltered({ userId })
        const userProducts = await Promise.all(sales.map(async sale => {
          return await this.getById(sale.productId)
        }))

        return userProducts;
      } else {
        return await Client.findAll()
      }
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to fetch all data!");
    }
  }
}
