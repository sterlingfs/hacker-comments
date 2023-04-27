import { NetworkStatus } from 'src/enums/NetworkStatus';

export interface NetworkState<Req = any, Res = any> {
  status: NetworkStatus;
  request?: Req;
  response?: Res;
  error?: Error | any;
}
