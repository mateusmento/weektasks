import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './chat.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/domain/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepo: Repository<ChatEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) {}

  async findChats(userId: number) {
    const chats = await this.chatRepo
      .createQueryBuilder('c')
      .innerJoin('c.peers', 'peer', 'peer.id = :userId', { userId })
      .leftJoinAndSelect('c.peers', 'p')
      .leftJoinAndSelect('c.meeting', 'm')
      .leftJoinAndSelect('c.lastMessage', 'msg')
      .orderBy(
        'CASE WHEN msg.id is null THEN c.createdAt ELSE msg.sentAt END',
        'DESC'
      )
      .getMany();

    for (const chat of chats)
      if (chat.type === 'direct')
        chat.speakingTo = chat.peers.find((p) => p.id !== userId);

    return chats;
  }

  async createDirectChat(meId: number, peerUserName: string) {
    const peers = await this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.credential', 'cred')
      .where('cred.username = :peerUserName', { peerUserName })
      .orWhere('user.id = :meId', { meId })
      .getMany();
    if (peers.length < 2) throw new NotFoundException('User not found');
    const chat = await this.chatRepo.save({ type: 'direct', peers });
    chat.speakingTo = chat.peers.find((p) => p.id !== meId);
    return chat;
  }
}
