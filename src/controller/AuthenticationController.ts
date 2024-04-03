import { Request, Response } from "express";
import { AuthenticationService } from "../service/Authentication";
import { UsersRepo } from "../repository/UsersRepo";

class AuthenticationController {
  // login controller
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await new AuthenticationService().login(email, password);
      if (token === "") {
        return res.status(400).json({
          status: "Bad Request",
          message: "Incorrect email or password",
        });
      }
      const res_token = { type: "Bearer", token: token };
      return res.status(200).json({
        status: "Success",
        message: "Successfully logged in",
        result: res_token,
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
      const { name, email, password, cpf } = req.body;
      await new AuthenticationService().register(email, password, name, cpf);
      return res.status(200).json({
        status: "Success",
        message: "Successfully registered user",
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
      const users = new UsersRepo().getAll();
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
}

export default new AuthenticationController();
