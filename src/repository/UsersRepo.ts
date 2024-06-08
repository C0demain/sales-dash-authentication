import { UniqueConstraintError } from "sequelize";
import { Sells } from "../models/Sells";
import { Users } from "../models/Users";
import NotFoundError from "../exceptions/NotFound";

interface IUsersRepo {
  saveUser(users: Users): Promise<void>;
  saveAdmin(users: Users): Promise<void>;
  update(users: Users): Promise<void>;
  delete(usersId: number): Promise<void>;
  getById(usersId: number): Promise<Users>;
  getByCpf(userCpf: string): Promise<Users>;
  getAll(): Promise<Users[]>;
  findByEmail(email: string): Promise<Users>;
  getByIdWithSells(userId: number): Promise<Users | null>;
  delete(userId: number): Promise<void>;
}

export class UsersRepo implements IUsersRepo {

  async saveUser(users: Users): Promise<void> {
    try {
      await Users.create({
        name: users.name,
        password: users.password,
        email: users.email,
        cpf: users.cpf,
        role: 'user'
      });
    } catch (error) {
      console.log(error)
      if (error instanceof UniqueConstraintError) throw error
      else throw new Error("Failed to create users!");
    }
  }

  async saveAdmin(users: Users): Promise<void> {
    try {
      await Users.create({
        name: users.name,
        password: users.password,
        email: users.email,
        cpf: users.cpf,
        role: 'admin'
      });
    } catch (error) {
      console.log(error)
      if (error instanceof UniqueConstraintError) throw error
      else throw new Error("Failed to create users!");
    }
  }

  async update(user: Users): Promise<void> {
    try {

      const new_user = await Users.findOne({
        where: {
          id: user.id,
        },
      });

      if (!new_user) {
        throw new NotFoundError(`User with id '${user.id}' not found`);
      }

      new_user.name = user.name
      new_user.email = user.email
      new_user.cpf = user.cpf
      new_user.role = user.role
      new_user.password = user.password

      await new_user.save();
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to update users!");
    }
  }

  async delete(userId: number): Promise<void> {
    try {

      const user = await Users.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError(`User with id '${userId}' not found`);
      }

      await user.destroy();
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to delete user!");
    }
  }


  async getById(usersId: number): Promise<Users> {
    try {

      const new_users = await Users.findOne({
        where: {
          id: usersId,
        },
      });

      if (!new_users) {
        throw new NotFoundError(`User with id '${usersId}' not found`);
      }

      return new_users;
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to get user!");
    }
  }

  async getAll(): Promise<Users[]> {
    try {
      return await Users.findAll();
    } catch (error) {
      throw new Error("Failed to feacth all users!");
    }
  }

  async getAllSellers(): Promise<Users[]> {
    try {
      return await Users.findAll({
        where: {
          role: 'user'
        }
      });
    } catch (error) {
      throw new Error("Failed to feacth all users!");
    }
  }

  async findByEmail(email: string): Promise<Users> {
    try {
      const new_users = await Users.findOne({
        where: { email: email },
      });
      if (!new_users) {
        throw new NotFoundError(`User with email '${email}' not found`);
      }
      return new_users;
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to fecth user by email!");
    }
  }

  async getByCpf(userCpf: string): Promise<Users> {
    try {
      const new_users = await Users.findOne({
        where: { cpf: userCpf },
      });
      if (!new_users) {
        throw new NotFoundError(`User with cpf '${userCpf}' not found`);
      }
      return new_users;
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to fecth user by cpf!");
    }
  }

  async getByIdWithSells(userId: number): Promise<Users | null> {
    try {
      const user = await Users.findByPk(userId, { include: [{ model: Sells }] });
      if (!user) {
        throw new NotFoundError(`User with id '${userId}' not found`);
      }

      return user
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to get user with sells!");
    }
  }
}
