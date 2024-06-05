import { UniqueConstraintError } from "sequelize";
import { Client } from "../models/Client";
import { ClientRepo } from "../repository/ClientRepo";
import { Users } from "../models/Users";
import { DuplicateCpfError } from "../exceptions/DuplicateCpfError";

interface IClientService {
    register(
        name: string,
        segment: string,
        cpf: string,
    ): Promise<void>;
}

export class ClientService implements IClientService {
    async register(name: string, segment: string, cpf: string): Promise<void> {
        try {
            const cleanClientCpf = cpf.replace(/[.-]/g, '');

            const existingClientOrUser = await Promise.all([
                Users.findOne({ where: { cpf: cleanClientCpf } }),
                Client.findOne({ where: { cpf: cleanClientCpf } })
            ]);

            // Verificar se o CPF já existe em usuários ou clientes
            if (existingClientOrUser.some(record => record !== null)) {
                throw new DuplicateCpfError(`CPF ${cpf} já está cadastrado como usuário ou cliente.`);
            }

            const newClient = new Client();
            newClient.name = name;
            newClient.segment = segment;
            newClient.cpf = cleanClientCpf;

            await new ClientRepo().save(newClient);
        } catch (error) {
            if (error instanceof UniqueConstraintError || error instanceof DuplicateCpfError) {
                throw error;
            } else {
                throw new Error("Falha ao registrar o cliente.");
            }
        }
    }
}