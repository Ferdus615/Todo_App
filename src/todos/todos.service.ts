import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { DbService } from 'src/database/database.service';

export interface Todo {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isArchived: boolean;
  isDeleted: boolean;
}

@Injectable()
export class TodosService {
  constructor(private readonly dbService: DbService) {}

  async createTodo(title: string, description: string): Promise<Todo> {
    const task = await this.dbService.query(
      'insert into todos (title, description, isCompleted) values ($1, $2, $3) returning *',
      [title, description, false],
    );
    return task.rows[0];
  }

  async getAllTodos(): Promise<Todo[]> {
    const tasks = await this.dbService.query('select * from todos');
    return tasks.rows;
  }

  async getCompletedTask(): Promise<Todo[]> {
    const isCompletedTask = await this.dbService.query(
      'select * from todos where isCompleted = true',
    );
    return isCompletedTask.rows;
  }

  async getOneTodo(id: number): Promise<Todo | undefined> {
    const task = await this.dbService.query(
      'select * from todos where id = $1',
      [id],
    );
    return task.rows[0];
  }

  async updateTodo(
    id: number,
    title: string,
    description: string,
  ): Promise<Todo | undefined> {
    const updateTask = await this.dbService.query(
      'update todos set title = $1, description = $2 where id = $3 returning *',
      [title, description, id],
    );
    return updateTask.rows[0];
  }

  async updateStatus(
    id: string,
    isCompleted?: boolean,
    isArchived?: boolean,
    isDeleted?: boolean,
  ): Promise<Todo | undefined> {
    const isTodoExistWithId = await this.dbService.query(
      'select * from todos where id = $1',
      [id],
    );
    const todoWithId = isTodoExistWithId.rows[0];
    if (!todoWithId) return undefined;

    const updateTaskStatus = await this.dbService.query(
      'update todos set isCompleted = $1, isArchived =$2, isDeleted = $3 where id = $4 returning *',
      [
        isCompleted ?? todoWithId.isCompleted,
        isArchived ?? todoWithId.isArchived,
        isDeleted ?? todoWithId.isDeleted,
        id,
      ],
    );

    return updateTaskStatus.rows[0];
  }

  async deleteTodo(id: number): Promise<void> {
    await this.dbService.query(
      'delete from todos where id = $1 and isDeleted = true',
      [id],
    );
  }
}
