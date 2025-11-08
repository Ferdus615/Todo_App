import { Injectable } from '@nestjs/common';
import { DbService } from 'src/database/database.service';
import { ResponseTodoDto } from './dto/responseTodoDto.dto';
import { CreateTodoDto } from './dto/createTodoDto.dto';
import { UpdateTodoDto } from './dto/updateTodoDto.dto';

@Injectable()
export class TodosService {
  constructor(private readonly dbService: DbService) {}

  async createTodo(dto: CreateTodoDto): Promise<ResponseTodoDto> {
    const task = await this.dbService.query(
      'insert into todos (title, description, isCompleted, isArchived, isDeleted) values ($1, $2, $3, $4, $5) returning *',
      [dto.title, dto.description, false, false, false],
    );
    return task.rows[0];
  }

  async getAllTodos(): Promise<ResponseTodoDto[]> {
    const tasks = await this.dbService.query(
      'select * from todos where isArchived = $1 and isDeleted = $2',
      [false, false],
    );
    return tasks.rows;
  }

  async getCompletedTask(): Promise<ResponseTodoDto[]> {
    const isCompletedTask = await this.dbService.query(
      'select * from todos where isCompleted = $1',
      [true],
    );
    return isCompletedTask.rows;
  }

  async getArchivedTask(): Promise<ResponseTodoDto[]> {
    const isArchivedTask = await this.dbService.query(
      'select * from todos where isArchived = $1',
      [true],
    );
    return isArchivedTask.rows;
  }

  async getDeletedTask(): Promise<ResponseTodoDto[]> {
    const isDeletedTask = await this.dbService.query(
      'select * from todos where isDeleted = $1',
      [true],
    );
    return isDeletedTask.rows;
  }

  async getOneTodo(id: number): Promise<ResponseTodoDto | undefined> {
    const task = await this.dbService.query(
      'select * from todos where id = $1',
      [id],
    );
    return task.rows[0];
  }

  async updateTodo(
    id: number,
    dto: UpdateTodoDto,
  ): Promise<ResponseTodoDto | undefined> {
    const updateTask = await this.dbService.query(
      'update todos set title = $1, description = $2 where id = $3 returning *',
      [dto.title, dto.description, id],
    );
    return updateTask.rows[0];
  }

  async updateStatus(
    id: number,
    dto: UpdateTodoDto,
  ): Promise<ResponseTodoDto | undefined> {
    const existing = await this.dbService.query(
      'select * from todos where id = $1',
      [id],
    );

    const todoWithId = existing.rows[0];
    if (!todoWithId) return undefined;

    console.log('todoWithId', todoWithId);

    const updateTaskStatus = await this.dbService.query(
      'update todos set iscompleted = $1, isarchived = $2, isdeleted = $3 where id = $4 returning *',
      [
        dto.isCompleted ?? todoWithId.iscompleted,
        dto.isArchived ?? todoWithId.isarchived,
        dto.isDeleted ?? todoWithId.isdeleted,
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
