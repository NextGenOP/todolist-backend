import { Request, Response } from 'express';
import IController from '../Interface';
import TodoService from '../../services/todos/TodoService';

class Todo implements IController {
  index = async (req: Request, res: Response): Promise<Response> => {
    const service: TodoService = new TodoService(req, res);
    const todos = await service.getAll();

    return todos;
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const service: TodoService = new TodoService(req, res);
    const todo = await service.store();

    return todo;
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const service: TodoService = new TodoService(req, res);
    const todo = await service.getOne();

    return todo;
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const service: TodoService = new TodoService(req, res);
    const update = await service.update();

    return update;
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const service: TodoService = new TodoService(req, res);
    const result = await service.delete();

    return result;
  };
}

export default new Todo();
