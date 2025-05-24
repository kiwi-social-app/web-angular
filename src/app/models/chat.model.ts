import { Message } from './message.model';
import { User } from './user.model';

export interface Chat {
  id: string;
  messages?: Message[];
  participants?: User[];
}
