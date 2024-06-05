import { Roles } from './../models/enum/Roles';
import { Users } from "../models/Users";
import { UsersRepo } from "../repository/UsersRepo";
import Authentication from "../utils/Authentication";
import { UniqueConstraintError } from 'sequelize';
import EmailService from './EmailService';
import crypto from 'crypto';
import { Client } from '../models/Client';
import { DuplicateCpfError } from '../exceptions/DuplicateCpfError';
import { DuplicateEmailError } from '../exceptions/DuplicateEmailError';

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
        user.cpf
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
      // Validar o email
      const existingUserWithEmail = await Users.findOne({ where: { email } });
      if (existingUserWithEmail) {
        throw new DuplicateEmailError(`O email ${email} já está cadastrado.`);
      }

      const cleanUserCpf = cpf.replace(/[.-]/g, '');

      const existingClientOrUser = await Promise.all([
        Users.findOne({ where: { cpf: cleanUserCpf } }),
        Client.findOne({ where: { cpf: cleanUserCpf } })
      ]);

      // Verificar se o CPF já existe em usuários ou clientes
      if (existingClientOrUser.some(record => record !== null)) {
        throw new DuplicateCpfError(`CPF ${cpf} já está cadastrado como usuário ou cliente.`);
      }

      const hashedPassword: string = await Authentication.passwordHash(password);
      const newUser = new Users();
      newUser.email = email;
      newUser.password = hashedPassword;
      newUser.name = name;
      newUser.cpf = cleanUserCpf;
      newUser.role = [Roles.User];

      await new UsersRepo().saveUser(newUser);
    } catch (error) {
      if (error instanceof UniqueConstraintError || error instanceof DuplicateCpfError || error instanceof DuplicateEmailError) {
        throw error;
      } else {
        throw new Error("Falha ao registrar o cliente.");
      }
    }
  }

  async registerAdmin(
    email: string,
    name: string,
    cpf: string
  ): Promise<void> {
    try {
      // Validar o email
      const existingUserWithEmail = await Users.findOne({ where: { email } });
      if (existingUserWithEmail) {
        throw new DuplicateEmailError(`O email ${email} já está cadastrado.`);
      }

      const cleanAdminCpf = cpf.replace(/[.-]/g, '');

      const existingClientOrUser = await Promise.all([
        Users.findOne({ where: { cpf: cleanAdminCpf } }),
        Client.findOne({ where: { cpf: cleanAdminCpf } })
      ]);

      // Verificar se o CPF já existe em usuários ou clientes
      if (existingClientOrUser.some(record => record !== null)) {
        throw new DuplicateCpfError(`CPF ${cpf} já está cadastrado como usuário ou cliente.`);
      }

      const adminPassword: string = this.generateRandomPassword(12);
      const adminHashedPassword: string = await Authentication.passwordHash(adminPassword);
      const newAdmin = new Users();
      newAdmin.email = email;
      newAdmin.password = adminHashedPassword;
      newAdmin.name = name;
      newAdmin.cpf = cleanAdminCpf;
      newAdmin.role = [Roles.Admin];

      // Salvar o novo usuário administrador
      await new UsersRepo().saveAdmin(newAdmin);
      // Enviar a senha gerada por e-mail
      await EmailService.sendEmail(email, "Senha de Acesso Gestor", `Primeira senha para login: ${adminPassword}`);

    } catch (error) {
      if (error instanceof UniqueConstraintError || error instanceof DuplicateCpfError || error instanceof DuplicateEmailError) {
        throw error;
      } else {
        throw new Error("Falha ao registrar o cliente.");
      }
    }
  }


  private generateRandomPassword(length: number): string {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
  }

  async hashPassword(password: string): Promise<string> {
    return await Authentication.passwordHash(password);
  }
}
