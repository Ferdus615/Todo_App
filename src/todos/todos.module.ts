import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { DatabaseModule } from 'src/database/databse.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
