import {ResourceService} from './resource-service';

export class SaleItemsService extends ResourceService {
  constructor(cache_svc, http_svc, eventer) {
    super('sale_items', cache_svc, http_svc, eventer);
  }
}
