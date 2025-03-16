import { WsChatService } from './services/ws-chat.service';
import { myRxStompConfig } from './rx-stomp.config';

export function rxStompServiceFactory() {
  const rxStomp: WsChatService = new WsChatService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}
