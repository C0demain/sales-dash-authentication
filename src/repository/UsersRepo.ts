import { Sells } from "../models/Sells";
import { Users } from "../models/Users";

interface IUsersRepo {
  save(users: Users): Promise<void>;
  update(users: Users): Promise<void>;
  delete(usersId: number): Promise<void>;
  getById(usersId: number): Promise<Users>;
  getAll(): Promise<Users[]>;
  findByEmail(email: string): Promise<Users>;
  getByIdWithSells(userId: number): Promise<Users | null>;
  delete(userId: number): Promise<void>;
}

export class UsersRepo implements IUsersRepo {

  async save(users: Users): Promise<void> {
    try {
      await Users.create({
        name: users.name,
        password: users.password,
        email: users.email,
        cpf: users.cpf,
        role: users.role
      });
    } catch (error) {
      console.log(error)
      throw new Error("Failed to create users!");
    }
  }

  async update(user: Users): Promise<void> {
    try {
      //  find existing users
      const new_user = await Users.findOne({
        where: {
          id: user.id,
        },
      });

      if (!new_user) {
        throw new Error("Users not found");
      }

      new_user.name = user.name
      new_user.email = user.email
      new_user.cpf = user.cpf
      new_user.role = user.role

      await new_user.save();
    } catch (error) {
      throw new Error("Failed to update users!");
    }
  }

  async delete(userId: number): Promise<void> {
    try {
      // Encontrar o usuário existente
      const user = await Users.findOne({
        where: { id: userId },
      });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      // Excluir o usuário
      await user.destroy();
    } catch (error) {
      throw new Error("Failed to delete user!");
    }
  }
  

  async getById(usersId: number): Promise<Users> {
    try {
      //  find existing users
      const new_users = await Users.findOne({
        where: {
          id: usersId,
        },
      });

      if (!new_users) {
        throw new Error("Users not found");
      }
      // users data
      return new_users;
    } catch (error) {
      throw new Error("Failed to get user!");
    }
  }


  async getAll(): Promise<Users[]> {
    try {
      return await Users.findAll();
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
        throw new Error("Users not found!");
      }
      return new_users;
    } catch (error) {
      throw new Error("Failed to fecth user by email!");
    }
  } 

  async findByCpf(cpf: string): Promise<Users> {
    try {
      const new_users = await Users.findOne({
        where: { cpf: cpf },
      });
      if (!new_users) {
        throw new Error("Users not found!");
      }
      return new_users;
    } catch (error) {
      throw new Error("Failed to fecth user by email!");
    }
  } 

  async getByIdWithSells(userId: number): Promise<Users | null> {
    try {
      return await Users.findByPk(userId, { include: [{ model: Sells }] });
    } catch (error) {
      throw new Error("Failed to get user with sells!");
    }
  }


}
