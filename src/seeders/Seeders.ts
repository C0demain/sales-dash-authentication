import bcrypt from 'bcrypt';
import { Users } from "../models/Users";
import { Roles } from '../models/enum/Roles';

export class Seeders {
  public static async defaultUsers(): Promise<void> {
    const existingUsersCount = await Users.count();

    if (existingUsersCount === 0) {
      const hashedPasswordAdmin = await bcrypt.hash('admin', 10);
      const hashedPasswordUser = await bcrypt.hash('user', 10);

      await Users.bulkCreate([
        {
          name: 'Admin',
          email: 'admin@gmail.com',
          password: hashedPasswordAdmin,
          role: Roles.Admin,
          cpf: '123.456.789-00'
        },
        {
          name: 'User',
          email: 'user@gmail.com',
          password: hashedPasswordUser,
          role: Roles.User,
          cpf: '987.654.321-00'
        }
      ]);

      console.log('✅ Seeders executados com sucesso!');
    }
  }
}
