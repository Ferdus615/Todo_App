import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/database/database.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { ResponseUserDto } from './dto/responseUserDto.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserWithPassword } from './dto/responseWithPassDto.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async createUser(dto: CreateUserDto): Promise<ResponseUserDto> {
    const existingUser = await this.dbService.query(
      'select * from users where email = $1',
      [dto.email],
    );
    if (existingUser.rows.length > 0)
      throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.dbService.query(
      'insert into users (first_name, last_name, email, password) values ($1, $2, $3, $4) returning *',
      [dto.first_name, dto.last_name, dto.email, hashed],
    );

    return plainToInstance(ResponseUserDto, user.rows[0]);
  }

  async getAllUser(): Promise<ResponseUserDto[]> {
    const users = await this.dbService.query(
      'select id, email, first_name, last_name from users',
    );
    return plainToInstance(ResponseUserDto, users.rows);
  }

  async getuserById(id: number): Promise<ResponseUserDto> {
    const user = await this.dbService.query(
      'select id, email, first_name, last_name from users where id = $1',
      [id],
    );

    const idUser = user.rows[0];

    if (!idUser) throw new NotFoundException(`User with id:${id} not found`);

    return plainToInstance(ResponseUserDto, idUser);
  }

  async getUserByEmail(email: string): Promise<UserWithPassword | undefined> {
    const user = await this.dbService.query(
      'select * from users where email = $1',
      [email],
    );

    const emailUser = user.rows[0];

    if (!emailUser) return undefined;

    return emailUser as UserWithPassword;
  }

  async getUserByName(
    first_name: string,
    last_name: string,
  ): Promise<ResponseUserDto | undefined> {
    const user = await this.dbService.query(
      'select * from users where first_name = $1 and last_name = $2',
      [first_name, last_name],
    );

    const nameUser = user.rows[0];

    if (!nameUser) return undefined;

    return plainToInstance(ResponseUserDto, nameUser);
  }

  async deleteUser(id: number): Promise<ResponseUserDto> {
    const result = await this.dbService.query(
      'delete from users where id = $1 returning id, email, first_name, last_name',
      [id],
    );
    if (!result) throw new NotFoundException("User doesn't exists!");

    return plainToInstance(ResponseUserDto, result.rows[0]);
  }
}
