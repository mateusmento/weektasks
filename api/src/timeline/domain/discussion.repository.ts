import { DataSource, Repository } from 'typeorm';
import { Discussion } from '../entities/discussion.entity';
import { groupBy } from 'lodash';
import { Reply } from '../entities/reply.entity';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/user.entity';

@Injectable()
export class DiscussionRepository extends Repository<Discussion> {
  constructor(private dataSource: DataSource) {
    super(Discussion, dataSource.createEntityManager());
  }

  async findTimelineDiscussions(
    productId: number,
    page: number,
    pageSize: number
  ) {
    const rawdiscussions: any[] = await this.query(
      `
      with dis as
      (
          select
            d.*,
            usr.id "usr_id",
            usr.name "usr_name"
          from discussion d
          left join "users" usr on usr.id = d.author_id
          where product_id = $3
          order by d.id desc
          offset $1 limit $2
      ), rep as
      (
          select
            r.*,
            usr.id "usr_id",
            usr.name "usr_name",
            ROW_NUMBER() over (partition by discussion_id order by r.id desc) as RowNum
          from reply r
          left join "users" usr on usr.id = r.author_id
      )
      select
        dis.id "dis_id",
        dis.type "dis_type",
        dis.text "dis_text",
        dis.product_id "dis_productId",
        dis.likes "dis_likes",
        dis.issue_id "dis_issueId",
        dis.author_id "dis_authorId",
        dis.created_at "dis_createdAt",
        dis."usr_id" "dis_author_id",
        dis."usr_name" "dis_author_name",
        rep.id "rep_id",
        rep.text "rep_text",
        rep.likes "rep_likes",
        rep.discussion_id "rep_discussionId",
        rep.created_at "rep_createdAt",
        rep.author_id "rep_authorId",
        rep."usr_id" "rep_author_id",
        rep."usr_name" "rep_author_name"
      from dis
      left join rep on rep.discussion_id = dis.id and rep.RowNum <= 3
      order by dis.id desc, rep.id asc
    `,
      [(page - 1) * pageSize, pageSize, productId]
    );

    const repliesByDiscussion = groupBy(rawdiscussions, 'dis_id');
    const discussionIds = rawdiscussions.map((v) => v.dis_id as number);
    const uniqueDiscussionIds = [...new Set(discussionIds)];
    return uniqueDiscussionIds.map((discussionId) => {
      const replies = repliesByDiscussion[discussionId];
      const [first] = replies;
      const discussion = new Discussion({
        id: first.dis_id,
        type: first.dis_type,
        text: first.dis_text,
        productId: first.dis_productId,
        likes: first.dis_likes,
        issueId: first.dis_issueId,
        authorId: first.dis_authorId,
        createdAt: first.dis_createdAt,
        author: new UserEntity({
          id: first.dis_author_id,
          name: first.dis_author_name,
        }),
      });
      discussion.replies = replies
        .filter((r) => r.rep_id)
        .map(
          (reply) =>
            new Reply({
              id: reply.rep_id,
              text: reply.rep_text,
              likes: reply.rep_likes,
              discussionId: reply.rep_discussionId,
              createdAt: reply.rep_createdAt,
              authorId: reply.rep_authorId,
              author: new UserEntity({
                id: reply.rep_author_id,
                name: reply.rep_author_name,
              }),
            })
        );
      return discussion;
    });
  }
}
