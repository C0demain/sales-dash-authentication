import { Request, Response } from "express";
import { AuthenticationService } from "../service/Authentication";
import { UsersRepo } from "../repository/UsersRepo";
import { cp } from "fs";

class AuthenticationController {
  // login controller
  async login(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      const token = await new AuthenticationService().login(email, password);
      if (token === "") {
        return res.status(400).json({
          status: "Bad Request",
          message: "Incorrect email or password"
        });
      }
      const res_token = { type: "Bearer", token: token };
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

  // register controller
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, cpf, role } = req.body;
      await new AuthenticationService().register(email, password, name, cpf, role);
      return res.status(200).json({
        status: "Success",
        message: "Successfully registered user",
        role: role
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong with register",
      });
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

  async getUserWithSells(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      const user = await new UsersRepo().getByIdWithSells(userId);
      if (!user) {
        return res.status(404).json({
          status: "Not Found",
          message: "User not found",
        });
      }
      return res.status(200).json({
        status: "Success",
        message: "Successfully fetched user with sells",
        user: user,
      });
    } catch (error) {
      console.error("Get user with sells error:", error);
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong with getUserWithSells",
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { userId } = req.params
    try {
      await new UsersRepo().delete(parseInt(userId))
      return res.status(200).json({
        status: "Success",
        message: "Successfully deleted user",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong with deleteUser",
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    const { userId } = req.params
    const { name, email, cpf, role } = req.body
    try {
      const userRepo = new UsersRepo()
      const user = await userRepo.getById(parseInt(userId))
      if (!user) {
        return res.status(404).json({
          status: "Not found",
          message: "User not found",
        });
      }
      user.name = name
      user.email = email
      user.cpf = cpf
      user.role = role
      await userRepo.update(user)
      return res.status(200).json({
        status: "Success",
        message: "Successfully updated user"
      });
    } catch (error) {
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong with updateUser",
      });
    }
  }


}

export default new AuthenticationController();
