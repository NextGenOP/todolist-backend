import { Request, Response } from 'express';
import AuthService from '../../services/accounts/AuthService';

class AuthController {
  register = async (req: Request, res: Response): Promise<Response> => {
    const service: AuthService = new AuthService(req, res);
    const data = await service.register();

    return data;
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const service: AuthService = new AuthService(req, res);
    const data = await service.login();

    return data;
  };

  refresh = async (req: Request, res: Response): Promise<Response> => {
    const service: AuthService = new AuthService(req, res);
    const data = await service.refresh();

    return data;
  };
}

export default new AuthController();
