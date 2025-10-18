import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { PostReactionModule } from './post_reaction/post_reaction.module';

@Module({
  imports: [TodosModule, PostReactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
