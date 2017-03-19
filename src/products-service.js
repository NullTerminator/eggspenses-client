import {ResourceService} from './resource-service';

export class ProductsService extends ResourceService {
  constructor(cache_svc, http_svc) {
    super('products', cache_svc, http_svc);
  }
}
