import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { patchObject } from 'src/object.functions';
import { CreateDiscussion } from './features/discussion/create-discussion.command';
import { FindDiscussion } from './features/discussion/find-discussion.query';
import { FindDiscussions } from './features/discussion/find-discussions.query';
import { LikeDiscussion } from './features/discussion/like-discussion.command';
import { CreateReply } from './features/reply/create-reply.command';
import { FindReplies } from './features/reply/find-replies.query';
import { LikeReply } from './features/reply/like-reply.command';

@UseGuards(JwtAuthGuard)
@Controller()
export class DiscussionController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Get('/products/:productId/discussions')
  findDiscussions(
    @Param('productId') productId: number,
    @Query() command: FindDiscussions,
    @AuthUser() user: any
  ) {
    return this.queryBus.execute(
      patchObject(command, { productId, userId: user.id })
    );
  }

  @Post('/products/:productId/discussions')
  createDiscussion(
    @Param('productId') productId: number,
    @Body() command: CreateDiscussion,
    @AuthUser() user: any
  ) {
    return this.commandBus.execute(
      patchObject(command, { productId, authorId: user.id })
    );
  }

  @Put('/discussions/:id/like')
  likeDiscussion(@Param('id') postId, @AuthUser() user: any) {
    return this.commandBus.execute(
      new LikeDiscussion({ discussionId: postId, userId: user.id })
    );
  }

  @Get('/discussions/:id')
  findDiscussion(@Param('id') id: number, @AuthUser() user: any) {
    return this.queryBus.execute(new FindDiscussion({ id, userId: user.id }));
  }

  @Get('/discussions/:id/replies')
  findReplies(@Param('id') discussionId: number, @AuthUser() user: any) {
    return this.queryBus.execute(
      new FindReplies({ discussionId, userId: user.id })
    );
  }

  @Post('/discussions/:id/replies')
  createReply(
    @Param('id') id: number,
    @Body() command: CreateReply,
    @AuthUser() user: any
  ) {
    return this.commandBus.execute(
      patchObject(command, { discussionId: id, authorId: user.id })
    );
  }

  @Put('/replies/:id/like')
  likeReply(@Param('id') replyId, @AuthUser() user: any) {
    return this.commandBus.execute(new LikeReply({ replyId, userId: user.id }));
  }
}
