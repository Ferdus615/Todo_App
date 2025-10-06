import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello, Welcome To Ferdus's Todo App!";
  }
}
