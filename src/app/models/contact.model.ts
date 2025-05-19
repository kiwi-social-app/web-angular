export interface Contact {
  id: string;
  user1Id: string;
  user2Id: string;
  user1Username: string;
  user2Username: string;
  status: ContactStatus;
  conversationId: string;
}

export enum ContactStatus {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}
