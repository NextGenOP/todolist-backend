import Profile from '../../controllers/auth/ProfileController';
import AuthController from '../../controllers/auth/AuthController';
import BaseRoutes from '../BaseRouter';
import AccountValidator from '../../validations/auth/authValidator';
import ValidationError from '../../middlewares/validationErrorMiddleware';
import Auth from '../../middlewares/auth/AuthMiddleware';
import RefreshAuth from '../../middlewares/auth/RefreshAuthMiddleware';

class AuthRoutes extends BaseRoutes {
  public routes(): void {
    this.router.post(
      '/register',
      AccountValidator.checkCreateAccount(),
      ValidationError.handleValidationError,
      AuthController.register
    );
    this.router.post(
      '/login',
      AccountValidator.checkLoginAccount(),
      ValidationError.handleValidationError,
      AuthController.login
    );
    this.router.post('/refresh', RefreshAuth, AuthController.refresh);
    this.router.get('/profile', Auth, Profile.index);
    this.router.put(
      '/profile',
      Auth,
      AccountValidator.checkUpdateProfile(),
      ValidationError.handleValidationError,
      Profile.update
    );
  }
}

export default new AuthRoutes().router;
