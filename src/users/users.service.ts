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
    const users = await this.dbService.query('select * from users');
    return plainToInstance(ResponseUserDto, users.rows);
  }

  async getuserById(id: number): Promise<ResponseUserDto> {
    const idUser = await this.dbService.query(
      'select * form users where id = $1',
      [id],
    );
    if (!idUser) throw new NotFoundException(`Items with id:${id} not found!`);

    return plainToInstance(ResponseUserDto, idUser.rows[0]);
  }

  async getUserByEmail(email: string): Promise<ResponseUserDto | undefined> {
    const emailUser = await this.dbService.query(
      'select * from users where email = $1',
      [email],
    );
    if (!emailUser) throw new NotFoundException(`${email} doesn't exist!`);

    return plainToInstance(ResponseUserDto, emailUser.rows[0]);
  }

  async getUserByName(
    first_name: string,
    last_name: string,
  ): Promise<ResponseUserDto | undefined> {
    const nameUser = await this.dbService.query(
      'select * from users where first_name = $1 and last_name = $2',
      [first_name, last_name],
    );
    if (!nameUser) throw new NotFoundException('No such user exits!');

    return plainToInstance(ResponseUserDto, nameUser.rows[0]);
  }

  async deleteUser(id: number): Promise<ResponseUserDto> {
    const result = await this.dbService.query(
      'delte from users where id = $1 returning id, email',
      [id],
    );
    if (!result) throw new NotFoundException("User doesn't exists!");

    return plainToInstance(ResponseUserDto, result.rows[0]);
  }
}
