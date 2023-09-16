import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscussionController } from './discussions.controller';
import { Discussion } from './entities/discussion.entity';
import { Like } from './entities/like.entity';
import { ReplyLike } from './entities/reply-like.entity';
import { Reply } from './entities/reply.entity';
import { CreateDiscussionCommand } from './features/discussion/create-discussion.command';
import { FindDiscussionQuery } from './features/discussion/find-discussion.query';
import { FindDiscussionsQuery } from './features/discussion/find-discussions.query';
import { LikeDiscussionCommand } from './features/discussion/like-discussion.command';
import { CreateReplyCommand } from './features/reply/create-reply.command';
import { FindRepliesQuery } from './features/reply/find-replies.query';
import { LikeReplyCommand } from './features/reply/like-reply.command';
import { DiscussionRepository } from './domain/discussion.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discussion, Like, Reply, ReplyLike]),
    CqrsModule,
  ],
  providers: [
    DiscussionRepository,
    FindDiscussionsQuery,
    CreateDiscussionCommand,
    LikeDiscussionCommand,
    FindRepliesQuery,
    FindDiscussionQuery,
    CreateReplyCommand,
    LikeReplyCommand,
  ],
  controllers: [DiscussionController],
  exports: [TypeOrmModule],
})
export class TimelineModule {}
