import { Module } from '@nestjs/common';
import { PostReactionService } from './post_reaction.service';
import { PostReactionController } from './post_reaction.controller';

@Module({
  controllers: [PostReactionController],
  providers: [PostReactionService],
})
export class PostReactionModule {}
