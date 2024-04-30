import bcrypt from 'bcrypt';
import { Users } from "../models/Users";

export class Seeders {
  public static async defaultUsers(): Promise<void> {
    const existingUsersCount = await Users.count();

    if (existingUsersCount === 0) {
      const hashedPasswordAdmin = await bcrypt.hash('admin', 10);
      const hashedPasswordUser = await bcrypt.hash('user', 10);

      await Users.bulkCreate([
        {
          name: 'Admin',
          email: 'admin@example.com',
          password: hashedPasswordAdmin,
          role: 'admin',
          cpf: '123.456.789-00'
        },
        {
          name: 'User',
          email: 'user@example.com',
          password: hashedPasswordUser,
          role: 'user',
          cpf: '987.654.321-00'
        }
      ]);

      console.log('✅ Seeders executados com sucesso!');
    }
  }
}
