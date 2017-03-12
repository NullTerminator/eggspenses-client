import {ResourceService} from './resource-service';

export class AssetService extends ResourceService {
  constructor(cache_svc, http_svc) {
    super('assets', cache_svc, http_svc);
  }
}
