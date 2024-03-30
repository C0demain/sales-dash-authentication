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
          status: "Bad Request!",
          message: "Wrong email or password!",
        });
      }
      const res_token = { type: "Bearer", token: token };
      return res.status(200).json({
        status: "Ok!",
        message: "Successfully login!",
        result: res_token,
      });
    } catch (error) {
      return res.status(500).json({
        status: "Internal server Error!",
        message: "Internal server Error!",
      });
    }
  }
  // register controller
  async register(req: Request, res: Response) {
    try {
      const { name, username, email, password } = req.body;

      await new AuthenticationService().register(
        email,
        password,
        name,
        username
      );

      return res.status(200).json({
        status: "Ok!",
        message: "Successfully registerd users!",
      });
    } catch (error) {
      return res.status(500).json({
        status: "Internal server Error!",
        message: "Internal server Error!",
      });
    }
  }

  // Método para obter informações de todos os usuários cadastrados
  async getUsers(req: Request, res: Response) {
    try {
      // Use o repositório de usuários para buscar todos os usuários
      const users = await new UsersRepo().getAll();

      // Retorne a lista de usuários
      return res.status(200).json({
        status: "Ok!",
        message: "Successfully fetched users!",
        users: users,
      });
    } catch (error) {
      return res.status(500).json({
        status: "Internal server Error!",
        message: "Internal server Error!",
      });
    }
  }
}


export default new AuthenticationController()