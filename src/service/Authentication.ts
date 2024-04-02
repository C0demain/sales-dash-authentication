import { Users } from "../models/Users";
import { UsersRepo } from "../repository/UsersRepo";
import Authentication from "../utils/Authentication";

interface IAuthenticationService {
  login(email: string, password: string): Promise<string>;
  register(
    email: string,
    password: string,
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

  async register(
    email: string,
    password: string,
    name: string,
    cpf: string
  ): Promise<void> {
    try {
      const hashedPassword: string = await Authentication.passwordHash(password);
      const newUser = new Users();
      newUser.email = email;
      newUser.password = hashedPassword;
      newUser.name = name;
      newUser.cpf = cpf;

      await new UsersRepo().save(newUser);
    } catch (error) {
      throw new Error("Failed to register user");
    }
  }
}
