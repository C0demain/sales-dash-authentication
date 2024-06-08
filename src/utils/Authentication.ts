import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface Payload {
  userId: number;
  email: string;
  name: string;
  cpf: string;
}

class Authentication {
  public static passwordHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public static async passwordCompare(
    text: string,
    encryptedText: string
  ): Promise<boolean> {
    return await bcrypt.compare(text, encryptedText);
  }

  public static generateToken(
    id: number,
    email: string,
    name: string,
    cpf: string
  ): string {
    const secretKey: string = process.env.JWT_SECRET_KEY || "sales-dash-secret";
    const payload: Payload = {
      userId: id,
      email: email,
      name: name,
      cpf: cpf
    };
    const option = { expiresIn: '24h' }; //tempo para um usuário ficar logado com o mesmo token

    return jwt.sign(payload, secretKey, option);
  }

  public static validateToken(token: string): Payload | null {
    try {
      const secretKey: string = process.env.JWT_SECRET_KEY || "sales-dash-secret";
      return jwt.verify(token, secretKey) as Payload;
    } catch (err) {
      return null;
    }
  }
}

export default Authentication;
