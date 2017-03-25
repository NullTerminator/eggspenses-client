import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {ResourceCacheService} from './resource-cache-service';
import extensions from './resource-extensions';
import resource_params from './resource-params';
import events from './events';
import {HttpService} from './http-service';
import {HttpError} from './http-error';

@inject(ResourceCacheService, HttpService, EventAggregator)
export class ResourceService {
  constructor(resource_name, cache_svc, http_svc, eventer) {
    this.eventer = eventer;
    this.cache_svc = cache_svc;
    this.http_svc = http_svc;

    this.resource_name = resource_name;
    this._resources = {};
  }

  create(params) {
    return this.http_svc.post(this._url(), this._safe_params(params))
      .then((response) => {
        return this._resource_from_response(response.data)
          .then((resource) => {
            if (events[this.resource_name]) {
              this.eventer.publish(events[this.resource_name].CREATED, resource);
            }
            return resource;
          });
      });
  }

  save(resource) {
    if (resource.id) {
      return this.update(resource, resource);
    } else {
      return this.create(resource);
    }
  }

  all(params) {
    let prom = this.cache_svc.get(this._promise_key(), `all`);

    if (params === undefined && prom) {
      return prom;
    }

    prom = this.http_svc.get(this._url(), params)
      .then((resp) => {
        return Promise.all(resp.data.map((resource) => {
          return this._resource_from_response(resource);
        }));
      })
      .finally(() => {
        this.cache_svc.remove(this._promise_key(), `all`);
      });

    if (params === undefined) {
      prom = this.cache_svc.set(this._promise_key(), `all`, prom);
    }

    return prom;
  }

  get(id) {
    return this._get_resource(this.resource_name, id);
  }

  update(resource, params) {
    if (!resource.id) {
      return Promise.reject(new Error(`Cannot update an unsaved resource.`));
    }

    return this.http_svc.put(this._url(resource.id), this._safe_params(params))
      .then((response) => {
        return this._resource_from_response(response.data)
          .then((updated) => {
            if (events[this.resource_name]) {
              this.eventer.publish(events[this.resource_name].UPDATED, updated);
            }
            return resource;
          });
      });
  }

  delete(resource) {
    if (!resource.id) {
      return Promise.reject(new Error(`Cannot delete an unsaved resource.`));
    }

    return this.http_svc.delete(this._url(resource.id))
      .then(() => {
        let deleted = this.cache_svc.get(this.resource_name, resource.id);
        if (deleted && events[this.resource_name]) {
          this.eventer.publish(events[this.resource_name].DELETED, deleted);
        }
        this.cache_svc.remove(this.resource_name, resource.id);
      });
  }

  delete_all() {
    return this.all()
      .then((resp) => {
        return Promise.all(resp.map((item) => {
          return this.delete(item);
        }));
      });
  }

  _url(path = null, resource = null) {
    resource = (resource || this.resource_name).replace(/[_-]/g, '_');
    let url = `${window.env.EGGSPENSES_API_HOST}/${resource}`;
    if (path) {
      url = `${url}/${path}`;
    }
    return url;
  }

  _promise_key(type) {
    return `${type || this.resource_name}_promise`;
  }

  _get_resource(type, id) {
    id = parseInt(id);
    let promise_key = this._promise_key(type);
    let prom = this.cache_svc.get(promise_key, id);
    let resource = this.cache_svc.get(type, id);

    if (resource) {
      prom = Promise.resolve(resource);
    } else if (!prom) {
      prom = this.http_svc.get(this._url(id, type))
        .then((resp) => {
          return this._resource_from_response(resp.data, type);
        })
        .finally(() => {
          this.cache_svc.remove(promise_key, id);
        });
      prom = this.cache_svc.set(promise_key, id, prom);
    }

    return prom;
  }

  _resource_from_response(resp_obj, type) {
    return new Promise((resolve) => {
      type = type || this.resource_name;
      let resource = { id: parseInt(resp_obj.id), type: resp_obj.type };
      Object.assign(resource, resp_obj.attributes);
      resource = this.cache_svc.set(type, resource.id, resource);
      let resp_type = resp_obj.type.replace(/[_-]/g, '_');
      if (extensions[resp_type]) {
        extensions[resp_type](resource);
      }
      let promises = [];

      if (resp_obj.relationships) {
        Object.keys(resp_obj.relationships).forEach((rel_name) => {
          let relation = resp_obj.relationships[rel_name].data;

          if (Array.isArray(relation)) {
            function by_id(id) {
              return function(elem) {
                return elem.id === id;
              };
            }

            resource[rel_name] = resource[rel_name] || [];
            relation.forEach((rel) => {
              let rel_id = parseInt(rel.id);
              let rel_type = rel.type.replace(/[_-]/g, '_');
              // is this relation already loaded?
              if (!resource[rel_name].find(by_id(rel_id))) {
                // prep the cache with an object or get one out
                promises.push(this._get_resource(rel_type, rel_id));
                resource[rel_name].push(this.cache_svc.set(rel_type, rel_id, { id: rel_id }));
              }
            });
          } else {
            if (resource[rel_name]) {
              // relation is already there, do we need to do anything?
            } else {
              promises.push(this._get_resource(relation.type, relation.id)
                .then((res) => {
                  resource[rel_name] = res;
                })
              );
            }
          }
        });
      }

      Promise.all(promises)
        .then(() => {
          resolve(resource);
        });
    });
  }

  _safe_params(params) {
    let safe = resource_params[this.resource_name];
    if (safe) {
      params = safe(params);
    }

    return params;
  }
}
