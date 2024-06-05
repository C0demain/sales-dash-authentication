import { Request, Response } from "express";
import { AuthenticationService } from "../service/Authentication";
import { UsersRepo } from "../repository/UsersRepo";
import { UniqueConstraintError } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import { SellsRepo } from "../repository/SellsRepo";
import { DuplicateCpfError } from "../exceptions/DuplicateCpfError";
import { DuplicateEmailError } from "../exceptions/DuplicateEmailError";

class AuthenticationController {
  // login controller
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await new AuthenticationService().login(email, password);
      const user = await new UsersRepo().findByEmail(email);

      if (token === "") {
        return res.status(400).json({
          status: "Bad Request",
          message: "Incorrect email or password"
        });
      }
      const res_token = { type: "Bearer", token: token, userId: user.id, role: user.role, name: user.name, cpf: user.cpf };
      return res.status(200).json({
        status: "Success",
        message: "Successfully logged in",
        ...res_token
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong with login",
      });
    }
  }

  // cadastro de vendedor
  async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password, cpf } = req.body;
      await new AuthenticationService().registerUser(email, password, name, cpf);
      return res.status(200).json({
        status: "Success",
        message: "Successfully registered user",
      });
    } catch (error) {
      if (error instanceof DuplicateCpfError || error instanceof DuplicateEmailError) {
          return res.status(400).json({
              status: "Bad Request",
              message: error.message,
          });
      } else {
          return res.status(500).json({
              status: "Internal Server Error",
              message: "Something went wrong while registering the client.",
          });
      }
    }
  }

  //cadastro de gestor envia a primeira senha pelo gmail
  async registerAdmin(req: Request, res: Response) {
    try {
      const { name, email, cpf } = req.body;
      await new AuthenticationService().registerAdmin(email, name, cpf);
      return res.status(200).json({
        status: "Success",
        message: "Successfully registered Admin",
      });
    } catch (error) {
      if (error instanceof DuplicateCpfError || error instanceof DuplicateEmailError) {
          return res.status(400).json({
              status: "Bad Request",
              message: error.message,
          });
      } else {
          return res.status(500).json({
              status: "Internal Server Error",
              message: "Something went wrong while registering the client.",
          });
      }
    }
  }

  // Get all users controller
  async getUsers(req: Request, res: Response) {
    try {
      const users = await new UsersRepo().getAll();
      return res.status(200).json({
        status: "Success",
        message: "Successfully fetched users",
        users: users,
      });
    } catch (error) {
      console.error("Get users error:", error);
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong with getUsers",
      });
    }
  }

  async getSellers(req: Request, res: Response) {
    try {
      const users = await new UsersRepo().getAllSellers();
      return res.status(200).json({
        status: "Success",
        message: "Successfully fetched users",
        users: users,
      });
    } catch (error) {
      console.error("Get users error:", error);
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong with getUsers",
      });
    }
  }

  async getUserWithSells(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      const user = await new UsersRepo().getByIdWithSells(userId);

      return res.status(200).json({
        status: "Success",
        message: "Successfully fetched user with sells",
        user: user,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          status: "Not Found",
          message: error.message,
        });
      } else {
        return res.status(500).json({
          status: "Internal Server Error",
          message: "Something went wrong with deleteUser",
        });
      }
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { userId } = req.params
    try {
      const check = await new SellsRepo().checkProduct(parseInt(userId));
      if (check == null) {
        if (((await new UsersRepo().getById(parseInt(userId))).role).toString() == "admin") {
          return res.status(403).json({
            status: "Forbidden",
            message: "Cant delete admin",
          })
        }
        await new UsersRepo().delete(parseInt(userId));
        return res.status(204).json({
          status: "No content",
          message: "Successfully deleted user",
        });
      }
      else throw new Error();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          status: "Not Found",
          message: error.message,
        });
      } else {
        return res.status(403).json({
          status: "Forbidden",
          message: "Cant delete Seller with sells related",
        });
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    const { userId } = req.params;
    const { name, email, password, cpf } = req.body;

    try {
      const userRepo = new UsersRepo();
      const user = await userRepo.getById(parseInt(userId));

      if (!user) {
        throw new NotFoundError("User not found");
      }

      // Update user information if provided
      if (name) user.name = name;
      if (email) user.email = email;
      if (cpf) user.cpf = cpf;


      // Update password if provided
      if (password) {
        const authService = new AuthenticationService();
        const hashedPassword = await authService.hashPassword(password);
        user.password = hashedPassword;
      }

      await userRepo.update(user);

      return res.status(200).json({
        status: "Success",
        message: "Successfully updated user",
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          status: "Not Found",
          message: error.message,
        });
      } else if (error instanceof UniqueConstraintError) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.errors[0]?.message,
        });
      } else {
        return res.status(500).json({
          status: "Internal Server Error",
          message: "Something went wrong with user update",
        });
      }
    }
  }

}

export default new AuthenticationController();
