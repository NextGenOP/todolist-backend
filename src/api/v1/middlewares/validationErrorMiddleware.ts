import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

class ValidationError {
  handleValidationError(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors: errors.array(),
        data: {},
      });
    }
    return next();
  }
}

export default new ValidationError();
