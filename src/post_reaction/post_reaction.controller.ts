import { Body, Controller, Post } from '@nestjs/common';
import { PostReactionService } from './post_reaction.service';
import { CreateReactionDto } from './dto/createReactionDto.dto';
import { ResponseReactionDto } from './dto/responseReactionDto.dto';

@Controller('react')
export class PostReactionController {
  constructor(private readonly postReactionService: PostReactionService) {}

  @Post('/')
  async addReaction(
    @Body() dto: CreateReactionDto,
  ): Promise<ResponseReactionDto> {
    return this.postReactionService.addReaction(dto);
  }
}
