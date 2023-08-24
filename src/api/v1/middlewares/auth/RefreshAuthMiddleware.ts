import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const db: any = require('../../models');

const auth = (req: Request, res: Response, next: NextFunction): any => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: false,
      message: 'Unauthorized Error',
      errors: {},
      data: {},
    });
  }

  const secretKey: any = process.env.REFRESH_SECRET_KEY;
  const token: any = req.headers.authorization.split(' ')[1];
  const credential: any = jwt.verify(token, secretKey);
  if (!credential)
  res.status(401).json({
      status: false,
      message: 'Unauthorized Invalid Token',
      errors: {},
      data: {},
    });
    
  const user = await db.user.findOne({
      where: { credential },
  });
  const compare = Authentication.passwordCompare(token, user.refresh_token);
  if (!compare)
  res.status(400).json({
      status: false,
      message: 'Authentication failed',
      errors: {},
      data: {},
    });
  req.app.locals.credential = credential;
  
  return next();
};

export default auth;
