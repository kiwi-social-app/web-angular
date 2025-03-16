import { RxStompConfig } from '@stomp/rx-stomp';
import { WsChatService } from './services/ws-chat.service';
import { rxStompServiceFactory } from './rx-stomp-service-factory';

export const myRxStompConfig: RxStompConfig = {
  brokerURL: 'ws://localhost:8080/ws',
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds
  reconnectDelay: 1200,

  debug: (msg: string): void => {
    console.log(new Date(), msg);
  },
};

export function provideRxStomp() {
  return {
    provide: WsChatService,
    useFactory: rxStompServiceFactory,
  };
}
