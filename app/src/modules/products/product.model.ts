import type { User } from '@/lib/models/user.model';

export interface Collaborator {
  id: number;
  user: User;
}

export interface Product {
  id: number;
  name: string;
  collaborators: Collaborator[];
}
