import { Op } from 'sequelize';
import BaseService from '../BaseService';

const db = require('../../models');

class TodoService extends BaseService {
  getAll = async () => {
    try {
      let { limit = 10 } = this.query;
      const {
        offset = 0,
        order_by = 'ASC',
        s: search = '',
        is_completed = null,
      } = this.query;

      if (limit >= 100) {
        limit = 100;
      }

      console.log("order_by",order_by.toString().toUpperCase())

      const getAlltodos = db.todo.findAndCountAll({
        order: [['deadline', order_by.toString().toUpperCase()]],
        where: {
          user_id: this.credential.id,
          [Op.or]: {
            title: {
              [Op.iLike]: `%${search}%`,
            },
            description: {
              [Op.iLike]: `%${search}%`,
            },
          },
          is_completed: {
            [Op.or]:
              is_completed === null
                ? [true, false]
                : [is_completed, is_completed],
          },
        },
        include: [{ model: db.category }],
        attributes: [
          'id',
          'title',
          'category_id',
          'description',
          'is_completed',
          'deadline',
          'createdAt',
          'updatedAt',
        ],
        offset,
        limit,
      });

      const totalDoneTask = db.todo.count({
        where: {
          user_id: this.credential.id,
          [Op.or]: {
            title: {
              [Op.iLike]: `%${search}%`,
            },
            description: {
              [Op.iLike]: `%${search}%`,
            },
          },
          is_completed: true,
        },
        offset,
        limit,
      });

      const totalInProgressTask = db.todo.count({
        where: {
          user_id: this.credential.id,
          [Op.or]: {
            title: {
              [Op.iLike]: `%${search}%`,
            },
            description: {
              [Op.iLike]: `%${search}%`,
            },
          },
          is_completed: false,
        },
        offset,
        limit,
      });

      const [{ count, rows }, totalInProgress, totalDone] = await Promise.all([
        getAlltodos,
        totalInProgressTask,
        totalDoneTask,
      ]);

      return this.res.status(200).json({
        status: true,
        message: 'Get all TODOs successfully',
        errors: {},
        data: {
          offset,
          limit,
          count,
          totalDone,
          totalInProgress,
          rows,
        },
      });
    } catch (_) {
      return this.res.status(400).json({
        status: true,
        message: 'Get all TODOs failed',
      });
    }
  };

  store = async () => {
    try {
      const {
        title,
        description,
        is_completed,
        deadline,
        category_id = null,
      } = this.body;
      const isOverTime: any = deadline <= Date.now();
      const todo = await db.todo.create({
        user_id: this.credential.id,
        title,
        description,
        is_completed,
        deadline,
        category_id,
        over_time: isOverTime,
      });

      if (!todo) {
        return this.res.status(400).json({
          status: false,
          message: 'Todo not added',
          errors: {},
          data: {},
        });
      }

      return this.res.status(201).json({
        status: true,
        message: 'Todo added',
        errors: {},
        data: todo,
      });
    } catch (_) {
      return this.res.status(400).json({
        status: false,
        message: 'Todo not added',
        errors: {},
        data: {},
      });
    }
  };

  getOne = async () => {
    try {
      const { id } = this.params;
      const todo = await db.todo.findOne({
        where: {
          id,
          user_id: this.credential.id,
        },
        attributes: [
          'id',
          'category_id',
          'title',
          'description',
          'is_completed',
          'deadline',
          'over_time',
          'createdAt',
          'updatedAt',
        ],
      });

      return this.res.status(200).json({
        status: true,
        message: 'Get one todo successfully',
        errors: {},
        data: todo,
      });
    } catch (_) {
      return this.res.status(400).json({
        status: false,
        message: 'Get one todo failed',
        errors: {},
        data: {},
      });
    }
  };

  update = async () => {
    try {
      const { id } = this.params;
      const { title, description, is_completed, deadline } = this.body;

      const todo = await db.todo.update(
        {
          title,
          description,
          is_completed,
          deadline,
        },
        {
          where: {
            id,
            user_id: this.credential.id,
          },
        }
      );
      if (Number(todo) === 0) {
        return this.res.status(400).json({
          status: false,
          message: 'Todo not updated',
          errors: {},
          data: {},
        });
      }

      return this.res.status(200).json({
        status: true,
        message: 'updated successfully',
        errors: {},
        data: {},
      });
    } catch (_) {
      return this.res.status(400).json({
        status: false,
        message: 'Todo not updated',
        errors: {},
        data: {},
      });
    }
  };

  delete = async () => {
    try {
      const { id } = this.params;
      const { id: user_id } = this.credential;
      const result = await db.todo.destroy({
        where: {
          id,
          user_id,
        },
      });

      if (Number(result) === 0) {
        return this.res.status(400).json({
          status: false,
          message: 'Failed to delete todo',
          errors: {},
          data: {},
        });
      }
      return this.res.status(200).json({
        status: true,
        message: 'todo deleted',
        errors: {},
        data: {},
      });
    } catch (_) {
      return this.res.status(400).json({
        status: false,
        message: 'Failed to delete todo',
        errors: {},
        data: {},
      });
    }
  };
}
export default TodoService;
