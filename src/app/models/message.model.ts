import { UserBasic } from './userBasic.model';

export interface Message {
  sender: UserBasic;
  content: string;
  timestamp: Date;
}
