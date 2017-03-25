import {ResourceService} from './resource-service';

export class AssetEventsService extends ResourceService {
  constructor(cache_svc, http_svc, eventer) {
    super('asset_events', cache_svc, http_svc, eventer);
  }
}
