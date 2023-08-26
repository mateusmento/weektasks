import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from './contact.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/domain/user.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private contactRepo: Repository<ContactEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) {}

  async findContacts(userId: number) {
    const contacts = await this.contactRepo
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

    for (const contact of contacts)
      if (contact.type === 'direct')
        contact.speakingTo = contact.peers.find((p) => p.id !== userId);

    return contacts;
  }

  async createDirectContact(meId: number, peerUserName: string) {
    const peers = await this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.credential', 'cred')
      .where('cred.username = :peerUserName', { peerUserName })
      .orWhere('user.id = :meId', { meId })
      .getMany();
    console.log(peers);
    if (peers.length < 2) throw new NotFoundException('User not found');
    const contact = await this.contactRepo.save({ type: 'direct', peers });
    contact.speakingTo = contact.peers.find((p) => p.id !== meId);
    return contact;
  }
}
