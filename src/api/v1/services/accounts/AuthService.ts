import { Response } from 'express';
import Authentication from '../../utils/Authentication';
import BaseService from '../BaseService';

const db = require('../../models');

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
      image: 'default.jpg',
    });

    if (!createdUser) {
      return this.res.status(400).json({
        status: false,
        message: 'User not created',
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

    const token = Authentication.generateToken(user.id);

    return this.res.status(201).json({
      status: true,
      message: 'Account created successfully',
      errors: {},
      data: {
        token,
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

      return this.res.status(200).json({
        status: true,
        message: 'Login successfully',
        errors: {},
        data: {
          token,
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
}

export default AuthService;
