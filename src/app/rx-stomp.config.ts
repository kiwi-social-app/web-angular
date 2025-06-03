import { RxStompConfig } from '@stomp/rx-stomp';
import { WsChatService } from './services/ws-chat.service';
import { rxStompServiceFactory } from './rx-stomp-service-factory';
import { environment } from '../environments/environment';

export const myRxStompConfig: RxStompConfig = {
  brokerURL: `${environment.wsUrl}`,
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds
  reconnectDelay: 1200,
};

export function provideRxStomp() {
  return {
    provide: WsChatService,
    useFactory: rxStompServiceFactory,
  };
}
