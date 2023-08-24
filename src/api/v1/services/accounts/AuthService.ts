import { Response } from 'express';
import Authentication from '../../utils/Authentication';
import BaseService from '../BaseService';

const db: any = require('../../models');

class AuthService extends BaseService {
  async register(): Promise<Response> {
    const { username, email, password } = this.body;
    const hashedPassword: string = await Authentication.passwordHash(password);

    const checkEmail = await db.user.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return this.res.status(400).json({
        status: false,
        message: 'Account already exists',
        errors: {},
        data: {},
      });
    }

    const createdUser = await db.user.create({
      username,
      email,
      password: hashedPassword,
      refresh_token: 'dummy',
      image: 'default.jpg',
    });

    if (!createdUser) {
      return this.res.status(400).json({
        status: false,
        message: 'Create account failed',
        errors: {},
        data: {},
      });
    }

    const user = await db.user.findOne({
      where: { email },
    });

    if (!user) {
      return this.res.status(400).json({
        status: false,
        message: 'User not found',
        errors: {},
        data: {},
      });
    }

    const token = Authentication.generateToken(user.id);
    const refreshToken = Authentication.generateRefreshToken(user.id);
    const hashedRefreshToken: string = await Authentication.passwordHash(refreshtoken);
    const updateRefreshToken = await Authentication.updateRefreshToken(user.id, hashedRefreshToken);

    if (!updateRefreshToken) {
      return this.res.status(400).json({
        status: false,
        message: 'Create account failed',
        errors: {},
        data: {},
    });}
    return this.res.status(201).json({
      status: true,
      message: 'Account created successfully',
      errors: {},
      data: {
        token,
        refreshToken,
      },
    });
  }

  async login(): Promise<Response> {
    const { email, password } = this.body;

    const user = await db.user.findOne({
      where: { email },
    });

    if (!user) {
      return this.res.status(400).json({
        status: false,
        message: 'User not found',
        errors: {},
        data: {},
      });
    }

    const compare = await Authentication.passwordCompare(
      password,
      user.password
    );

    if (!compare) {
      this.res.status(400).json({
        status: false,
        message: "Password doesn't match",
        errors: {},
        data: {},
      });
    }

    if (compare) {
      const token = Authentication.generateToken(user.id);
      const refreshToken = Authentication.generateRefreshToken(user.id);
      const hashedRefreshToken: string = await Authentication.passwordHash(refreshToken);
      const updateRefreshToken = await Authentication.updateRefreshToken(user.id, hashedRefreshToken);

      if (!updateRefreshToken) {
        return this.res.status(400).json({
          status: false,
          message: 'Create account failed',
          errors: {},
          data: {},
      });}
      return this.res.status(200).json({
        status: true,
        message: 'Login successfully',
        errors: {},
        data: {
          token,
          refreshToken,
        },
      });
    }

    return this.res.status(400).json({
      status: false,
      message: 'Authentication failed',
      errors: {},
      data: {},
    });
  }
  async refresh(): Promise<Response> {
    const { id } = this.credential;
    const reqtoken: any = this.req.headers.authorization.split(' ')[1];
    const user = await db.user.findOne({
       where: { id },
    });
    const compare = Authentication.passwordCompare(reqtoken, user.refresh_token);
    if (!compare){
      return this.res.status(400).json({
        status: false,
        message: 'Authentication failed',
        errors: {},
        data: {},
      });
    }
    const token = Authentication.generateToken(id);
    const refreshToken = Authentication.generateRefreshToken(id);
    const hashedRefreshToken: string = await Authentication.passwordHash(refreshToken);
    const updateRefreshToken = await Authentication.updateRefreshToken(id, hashedRefreshToken);

    if (!updateRefreshToken) {
      return this.res.status(400).json({
        status: false,
        message: 'Create account failed',
        errors: {},
        data: {},
    });}

    return this.res.status(200).json({
      status: true,
      message: 'Login successfully',
      errors: {},
      data: {
        token,
        refreshToken,
      },
    });
  }
}

export default AuthService;
