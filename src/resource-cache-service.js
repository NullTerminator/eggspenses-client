export class ResourceCacheService {
  constructor() {
    this._cache = {};
  }

  get(type, id) {
    this._cache[type] = this._cache[type] || {};
    return this._cache[type][id];
  }

  set(type, id, resource) {
    this._cache[type] = this._cache[type] || {};

    if (this._cache[type][id]) {
      Object.assign(this._cache[type][id], resource);
    } else {
      this._cache[type][id] = resource;
    }

    return this.get(type, id);
  }

  remove(type, id) {
    if (this._cache[type]) {
      delete this._cache[type][id];
    }
  }
}
