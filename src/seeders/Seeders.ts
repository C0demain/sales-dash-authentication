import bcrypt from 'bcrypt';
import { Users } from "../models/Users";
import { Roles } from '../models/enum/Roles';
import { Commissions } from '../models/Commissions';

export class Seeders {
  public static async defaultUsers(): Promise<void> {
    const existingUsersCount = await Users.count();

    if (existingUsersCount === 0) {
      const hashedPasswordGestor = await bcrypt.hash('gestor', 10);
      const hashedPasswordVendedor = await bcrypt.hash('vendedor', 10);

      await Users.bulkCreate([
        {
          name: 'Gestor',
          email: 'gestor@gmail.com',
          password: hashedPasswordGestor,
          role: Roles.Admin,
          cpf: '000.000.000-00'
        },
        {
          name: 'Vendedor',
          email: 'vendedor@gmail.com',
          password: hashedPasswordVendedor,
          role: Roles.User,
          cpf: '111.111.111-11'
        }
      ]);
    }
  }
  
  public static async defaultCommissions(): Promise<void> {
    const commissionExists = await Commissions.findOne({
      where: { id: 1 }
    })
    if (commissionExists == null) {
      Commissions.bulkCreate
        ([
          {
            title: "Cliente Novo/Produto Novo",
            percentage: 0.20
          },
          {
            title: "Cliente Novo/Produto Velho",
            percentage: 0.10
          }, {
            title: "Cliente Velho/Produto Novo",
            percentage: 0.05
          },
          {
            title: "Cliente Velho/Produto Velho",
            percentage: 0.02
          }
        ])
    }
  }
}