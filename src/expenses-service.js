import {ResourceService} from './resource-service';

export class ExpensesService extends ResourceService {
  constructor(cache_svc, http_svc, eventer) {
    super('expenses', cache_svc, http_svc, eventer);
  }
}
