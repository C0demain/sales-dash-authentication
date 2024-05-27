import { Roles } from './../models/enum/Roles';
import { Users } from "../models/Users";
import { UsersRepo } from "../repository/UsersRepo";
import Authentication from "../utils/Authentication";
import { UniqueConstraintError } from 'sequelize';
import EmailService from '../email/EmailService';
import crypto from 'crypto';

interface IAuthenticationService {
  login(email: string, password: string): Promise<string>;
  registerUser(
    email: string,
    password: string,
    name: string,
    cpf: string,
    role: [Roles.Admin, Roles.User]
  ): Promise<void>;
  registerAdmin(
    email: string,
    name: string,
    cpf: string
  ): Promise<void>;
}

export class AuthenticationService implements IAuthenticationService {
  async login(email: string, password: string): Promise<string> {
    try {
      const user = await new UsersRepo().findByEmail(email);

      if (!user) {
        throw new Error("User not found");
      }

      const compare = await Authentication.passwordCompare(password, user.password);

      if (!compare) {
        throw new Error("Incorrect password");
      }

      return Authentication.generateToken(
        user.id,
        user.email,
        user.name,
        user.cpf,
        user.role
      );
    } catch (error) {
      throw new Error("Failed to login");
    }
  }

  async registerUser(
    email: string,
    password: string,
    name: string,
    cpf: string,
  ): Promise<void> {
    try {
      const hashedPassword: string = await Authentication.passwordHash(password);
      const newUser = new Users();
      newUser.email = email;
      newUser.password = hashedPassword;
      newUser.name = name;
      newUser.cpf = cpf;
      newUser.role = [Roles.User];

      await new UsersRepo().saveUser(newUser);
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw error
      else throw new Error("failed to register user")
    }
  }

  async registerAdmin(
    email: string,
    name: string,
    cpf: string
  ): Promise<void> {
    try {
      const adminPassword: string = this.generateRandomPassword(12);
      const adminHashedPassword: string = await Authentication.passwordHash(adminPassword);
      const newAdmin = new Users();
      newAdmin.email = email;
      newAdmin.password = adminHashedPassword;
      newAdmin.name = name;
      newAdmin.cpf = cpf;
      newAdmin.role = [Roles.Admin]; 

      // Salvar o novo usuário administrador
      await new UsersRepo().saveAdmin(newAdmin); 
      // Enviar a senha gerada por e-mail
      await EmailService.sendEmail(email, "Senha de Acesso Gestor", `Primeira senha para login: ${adminPassword}`);

    } catch (error) {
      if (error instanceof UniqueConstraintError) throw error;
      else throw new Error("failed to register admin");
    }
  }

  private generateRandomPassword(length: number): string {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
  }

  async hashPassword(password: string): Promise<string> {
    return await Authentication.passwordHash(password);
  }

  // async update(email: string, newPassword: string): Promise<void> {
  //   try {
  //     const user = await new UsersRepo().findByEmail(email);

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     const hashedPassword: string = await Authentication.passwordHash(newPassword);
  //     user.password = hashedPassword;

  //     await new UsersRepo().update(user);
  //   } catch (error) {
  //     throw new Error("Failed to update password");
  //   }
  // }

}
