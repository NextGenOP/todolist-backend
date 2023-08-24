import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
const db: any = require('../../models');

class Authentication {
  public static passwordHash = (password: string): Promise<string> =>
    hash(password, 10);

  public static passwordCompare = async (
    text: string,
    encryptedText: string
  ): Promise<boolean> => {
    const result = await compare(text, encryptedText);
    return result;
  };

  public static saveRefreshToken = async (
    encryptedRefreshtoken: string
  ): Promise<boolean> => {
    const updateRefreshToken = await db.user.update(
      {
        ...body,
        refresh_token: encryptedRefreshToken,
      },
      {
        where: {
          user.id,
        },
      }
    );
    return updateRefreshToken;
  }

  public static generateToken = (id: number): string => {
    const secretKey: string | any = process.env.JWT_SECRET_KEY;

    const token: string = jwt.sign({ id }, secretKey, {
      expiresIn: '1d', // '86400',
    });

    return token;
  }
  public static generateRefreshToken = (id: number): string => {
    const secretKey: string | any = process.env.REFRESH_SECRET_KEY;

    const refreshtoken: string = jwt.sign({ id }, secretKey, {
      expiresIn: '7d', // '604800',
    });

    return refreshtoken;
  };
}

export default Authentication;
