import { Injectable } from '@nestjs/common';
import { DbService } from 'src/database/database.service';


interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

@Injectable()
export class TodosService {
  constructor(private readonly dbService: DbService) {}

  async createTodo(title: string, description: string): Promise<Todo> {
    const task = await this.dbService.query(
      'insert into todos (title, description, completed) values ($1, $2, $3) returning *',
      [title, description, false],
    );
    return task.rows[0];
  }

  async getAllTodos(): Promise<Todo[]> {
    const tasks = await this.dbService.query('select * from todos');
    return tasks.rows;
  }

  async getOneTodo(id: number): Promise<Todo | undefined> {
    const task = await this.dbService.query(
      'select * from todos where id = $1',
      [id],
    );
    return task.rows[0];
  }

  async updateStatus(
    id: number,
    completed: boolean,
  ): Promise<Todo | undefined> {
    const task = await this.dbService.query(
      'update todos set completed = $1 where id = $2 returning *',
      [completed, id],
    );
    return task.rows[0];
  }

  async updateTodo(
    id: number,
    title: string,
    description: string,
  ): Promise<Todo | undefined> {
    const task = await this.dbService.query(
      'update todos set title = $1, description = $2 where id = $3 returning *',
      [title, description, id],
    );
    return task.rows[0];
  }

  async deleteTodo(id: number): Promise<void> {
    await this.dbService.query('delete from todos where id = $1', [id]);
  }
}
