import {ResourceService} from './resource-service';

export class ProductionsService extends ResourceService {
  constructor(cache_svc, http_svc) {
    super('productions', cache_svc, http_svc);
  }
}
