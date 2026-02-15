import { RxStompConfig } from '@stomp/rx-stomp';
import { WsChatService } from './services/ws-chat.service';
import { rxStompServiceFactory } from './rx-stomp-service-factory';
import { environment } from '../environments/environment';

export const myRxStompConfig: RxStompConfig = {
  brokerURL: `${environment.wsUrl}`,
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 1200,
  beforeConnect: (rxStomp) => {
    const token = localStorage.getItem('firebase_jwt_token');
    if (token) {
      rxStomp.configure({
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  },
};

export function provideRxStomp() {
  return {
    provide: WsChatService,
    useFactory: rxStompServiceFactory,
  };
}
