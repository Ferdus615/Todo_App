import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/database/database.service';
import { ResponseTodoDto } from './dto/responseTodoDto.dto';
import { CreateTodoDto } from './dto/createTodoDto.dto';
import { UpdateTodoDto } from './dto/updateTodoDto.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TodosService {
  constructor(private readonly dbService: DbService) {}

  async createTodo(
    dto: CreateTodoDto,
    user_id: number,
  ): Promise<ResponseTodoDto> {
    const task = await this.dbService.query(
      'insert into todos (title, description, isCompleted, isArchived, isDeleted, user_id) values ($1, $2, $3, $4, $5, $6) returning *',
      [dto.title, dto.description, false, false, false, user_id],
    );
    return plainToInstance(ResponseTodoDto, task.rows[0]);
  }

  async getAllTodos(): Promise<ResponseTodoDto[]> {
    const tasks = await this.dbService.query(
      'select * from todos where isArchived = $1 and isDeleted = $2',
      [false, false],
    );

    return plainToInstance(ResponseTodoDto, tasks.rows, {
      excludeExtraneousValues: true,
    });
  }

  async getCompletedTask(): Promise<ResponseTodoDto[]> {
    const isCompletedTask = await this.dbService.query(
      'select * from todos where isCompleted = $1',
      [true],
    );
    return plainToInstance(ResponseTodoDto, isCompletedTask.rows, {
      excludeExtraneousValues: true,
    });
  }

  async getArchivedTask(): Promise<ResponseTodoDto[]> {
    const isArchivedTask = await this.dbService.query(
      'select * from todos where isArchived = $1',
      [true],
    );
    return plainToInstance(ResponseTodoDto, isArchivedTask.rows, {
      excludeExtraneousValues: true,
    });
  }

  async getDeletedTask(): Promise<ResponseTodoDto[]> {
    const isDeletedTask = await this.dbService.query(
      'select * from todos where isDeleted = $1',
      [true],
    );
    return plainToInstance(ResponseTodoDto, isDeletedTask.rows, {
      excludeExtraneousValues: true,
    });
  }

  async getTodoByUser(user_id: number): Promise<ResponseTodoDto[] | undefined> {
    const task = await this.dbService.query(
      'select * from todos where user_id = $1',
      [user_id],
    );

    return plainToInstance(ResponseTodoDto, task.rows, {
      excludeExtraneousValues: true,
    });
  }

  async getOneTodo(id: number): Promise<ResponseTodoDto | undefined> {
    const task = await this.dbService.query(
      'select * from todos where id = $1',
      [id],
    );
    return plainToInstance(ResponseTodoDto, task.rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async updateTodo(
    id: number,
    dto: UpdateTodoDto,
  ): Promise<ResponseTodoDto | undefined> {
    const updateTask = await this.dbService.query(
      'update todos set title = $1, description = $2 where id = $3 returning *',
      [dto.title, dto.description, id],
    );
    return plainToInstance(ResponseTodoDto, updateTask.rows[0], {
      excludeExtraneousValues: true,
    });
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

    return plainToInstance(ResponseTodoDto, updateTaskStatus.rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async deleteTodo(id: number, user_id: number): Promise<void> {
    const result = await this.dbService.query(
      'delete from todos where id = $1 and user_id = $2 and isDeleted = true',
      [id, user_id],
    );

    if (!result)
      throw new NotFoundException(
        `Todo not found or don't belong to this user!`,
      );
  }
}
