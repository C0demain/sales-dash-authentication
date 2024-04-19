import { Roles } from './../models/enum/Roles';
import { Users } from "../models/Users";
import { UsersRepo } from "../repository/UsersRepo";
import Authentication from "../utils/Authentication";
import { UniqueConstraintError } from 'sequelize';

interface IAuthenticationService {
  login(email: string, password: string): Promise<string>;
  register(
    email: string,
    password: string,
    name: string,
    cpf: string,
    role: [Roles.Admin, Roles.User]
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

  async register(
    email: string,
    password: string,
    name: string,
    cpf: string,
    role: [Roles.Admin, Roles.User]
  ): Promise<void> {
    try {
      const hashedPassword: string = await Authentication.passwordHash(password);
      const newUser = new Users();
      newUser.email = email;
      newUser.password = hashedPassword;
      newUser.name = name;
      newUser.cpf = cpf;
      newUser.role = role;

      await new UsersRepo().save(newUser);
    } catch (error) {
      if(error instanceof UniqueConstraintError) throw error
      else throw new Error("failed to register user")
    }
  }
}
