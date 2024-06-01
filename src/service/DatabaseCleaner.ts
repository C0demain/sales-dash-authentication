import { Response } from "express";
import { Client } from "../models/Client";
import { Products } from "../models/Products";
import { Sells } from "../models/Sells";
import { Users } from "../models/Users";
import { Op } from "sequelize";

export class DatabaseCleaner {
    static async cleanDatabase(res: Response) {
        try {
            // Exclui todos os registros de cada tabela, exceto as comissões e o usuário gestor padrão
            await Sells.destroy({ where: {} });
            await Users.destroy({ where: { name: { [Op.ne]: 'Gestor' } } });
            await Products.destroy({ where: {} });
            await Client.destroy({ where: {} });

            return res.status(200).json({ message: "Dados apagados com sucesso!" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Falha ao limpar os dados do banco de dados" });
        }
    }
}
