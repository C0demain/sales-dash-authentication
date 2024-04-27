import { Request, Response } from "express";
import { ClientRepo } from "../repository/ClientRepo";
import { ClientService } from "../service/ClientService";
import { UniqueConstraintError } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import { SellsRepo } from "../repository/SellsRepo";

export class ClientController {

    // register
    async register(req: Request, res: Response) {
        try {
            const { name, segment, cpf } = req.body;
            await new ClientService().register(name, segment, cpf);
            return res.status(200).json({
                status: "success",
                message: "sucessfully registered client"
            })

        }
        catch (error) {
            console.error("Registration error:", error);
            if (error instanceof UniqueConstraintError) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: error.errors[0].message
                })
            } else {
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Something went wrong with register",
                });
            }
        }

    }

    async getClients(req: Request, res: Response) {
        try {
            const client = await new ClientRepo().getAll();
            console.log(client);
            return res.status(200).json({
                status: "Success",
                message: "Successfully fetched clients",
                client: client,
            });
        } catch (error) {
            console.error("Get client error:", error);
            return res.status(500).json({
                status: "Internal Server Error",
                message: "Something went wrong with getClients",
            });
        }
    }

    async updateClient(req: Request, res: Response) {
        try {
            const { clientId } = req.params;
            const { name, cpf, segment } = req.body;

            const new_client = await new ClientRepo().getById(parseInt(clientId));

            if (!new_client) throw new NotFoundError("Client not found");

            new_client.name = name;
            new_client.cpf = cpf;
            new_client.segment = segment;

            await new ClientRepo().update(new_client);

            return res.status(200).json({
                status: "Success",
                message: "Successfully updated client"
            });

        } catch (error) {
            if (error instanceof NotFoundError) throw error
            else throw new Error("Failed to update client!");
        }
    }
    async deleteClient(req: Request, res: Response) {
        const { clientId } = req.params
        try {
            const check = await new SellsRepo().checkProduct(parseInt(clientId));
            if (check == null) {
                await new ClientRepo().delete(parseInt(clientId));
                return res.status(204).json({
                    status: "No content",
                    message: "Successfully deleted client",
                });
            }
            else throw new Error();
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    status: "Not Found",
                    message: error.message,
                });
            } else {
                return res.status(403).json({
                    status: "Forbidden",
                    message: "Cant delete client with sells related.",
                });
            }
        }
    }
}

export default new ClientController();
