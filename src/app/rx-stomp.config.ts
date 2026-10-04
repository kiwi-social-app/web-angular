import { RxStompConfig } from '@stomp/rx-stomp';
import { getAuth } from 'firebase/auth';
import { WsChatService } from './services/ws-chat.service';
import { rxStompServiceFactory } from './rx-stomp-service-factory';
import { environment } from '../environments/environment';

export const myRxStompConfig: RxStompConfig = {
  brokerURL: `${environment.wsUrl}`,
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 1200,
  // Runs before every (re)connect, so each STOMP CONNECT carries a fresh token
  beforeConnect: async (rxStomp) => {
    const auth = getAuth();
    await auth.authStateReady();
    const token = await auth.currentUser?.getIdToken();
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
