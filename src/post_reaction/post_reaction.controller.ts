import { Controller } from '@nestjs/common';
import { PostReactionService } from './post_reaction.service';

@Controller('post-reaction')
export class PostReactionController {
  constructor(private readonly postReactionService: PostReactionService) {}
}
