import {ResourceService} from './resource-service';

export class ProductionsService extends ResourceService {
  constructor(cache_svc, http_svc, eventer) {
    super('productions', cache_svc, http_svc, eventer);
  }
}
