import {ResourceService} from '../../src/resource-service';
import {ResourceCacheService} from '../../src/resource-cache-service';
import events from '../../src/events';

import {resolving_promise_spy} from './promise-spy.js';

describe('Resource Service', () => {
  let svc, cache_svc, http_svc, old_env, eventer;
  let resource = 'foos';
  let items = [
    { id: 42 },
    { id: 711 }
  ];
  let api_host = 'fiz.com';

  beforeAll(() => {
    old_env = window.env;
    window.env = {
      EGGSPENSES_API_HOST: api_host
    };
  });

  afterAll(() => {
    window.env = old_env;
  });

  beforeEach(() => {
    eventer = {
      publish: jasmine.createSpy(`event_aggregator.publish`)
    };
    http_svc = {};
    cache_svc = new ResourceCacheService();

    svc = new ResourceService(resource, cache_svc, http_svc, eventer);
  });

  describe('creating', () => {
    let created = {
      id: '29'
    };

    beforeEach(() => {
      http_svc.post = resolving_promise_spy('http_svc.post', { data: created });
    });

    it('posts the params via the http service', (done) => {
      let params = { name: 'bar' };

      svc.create(params)
        .then((resp) => {
          expect(http_svc.post).toHaveBeenCalledWith(`${api_host}/${resource}`, params);
        })
        .then(done);
    });

    it('returns a promise that resolves with the created resources', (done) => {
      svc.create()
        .then((resp) => {
          expect(resp).toEqual(jasmine.objectContaining({
            id: 29
          }));
        })
        .then(done);
    });

    it(`publishes a resource created event`, (done) => {
      svc.resource_name = 'productions';

      svc.create({ product: { id: 12 } })
        .then(() => {
          expect(eventer.publish).toHaveBeenCalledWith(events.productions.CREATED, jasmine.objectContaining({
            id: 29
          }));
        })
        .then(done);
    });
  });

  describe('getting one', () => {
    let item = {
      id: '24',
      attributes: {
        name: 'foo'
      }
    };

    beforeEach(() => {
      http_svc.get = resolving_promise_spy('http_svc.get', { data: item });
    });

    it('gets the resource from the http service', (done) => {
      let id = 88;

      svc.get(id)
        .then((resp) => {
          expect(http_svc.get).toHaveBeenCalledWith(`${api_host}/${resource}/${id}`);
        })
        .then(done);
    });

    it('returns a promise that resolves with the resource', (done) => {
      svc.get(12)
        .then((resp) => {
          expect(resp).toEqual(jasmine.objectContaining({
            id: 24,
            name: 'foo'
          }));
        })
        .then(done);
    });
  });

  describe('retrieving all', () => {
    beforeEach(() => {
      let resp = {
        data: items
      };
      http_svc.get = resolving_promise_spy('http_svc.get', resp);
    });

    it('gets the resources from the http service', (done) => {
      svc.all()
        .then((resp) => {
          expect(http_svc.get).toHaveBeenCalledWith(`${api_host}/${resource}`, undefined);
        })
        .then(done);
    });

    it('returns a promise that resolves with the array of resources', (done) => {
      svc.all()
        .then((resp) => {
          expect(resp).toContain(items[0]);
          expect(resp).toContain(items[1]);
        })
        .then(done);
    });

    describe('when there are no resources on the server', () => {
      beforeEach(() => {
        http_svc.get = resolving_promise_spy('http_svc.get', { data: [] });
      });

      it('returns a promise that resolves with an empty array', (done) => {
        svc.all()
        .then((resp) => {
          expect(resp).toEqual([]);
        })
        .then(done);
      });
    });
  });

  describe('updating', () => {
    let item;
    let params = { foo: 'bar' };

    beforeEach(() => {
      item = {};
      http_svc.put = resolving_promise_spy('http_svc.put', { data: item });
    });

    describe(`when resource is saved`, () => {
      beforeEach(() => {
        item.id = 42;
      });

      it(`updates using the http service`, (done) => {
        svc.update(item, params)
          .then(() => {
            expect(http_svc.put).toHaveBeenCalledWith(`${api_host}/${resource}/${item.id}`, params);
          })
          .then(done);
      });

      it(`publishes a resource updated event`, (done) => {
        svc.resource_name = 'productions';

        svc.update(item, { product: { id: 12 } })
          .then(() => {
            expect(eventer.publish).toHaveBeenCalledWith(events.productions.UPDATED, item);
          })
          .then(done);
      });
    });

    describe(`when resource isn't saved`, () => {
      it(`rejects the promise`, (done) => {
        svc.update(item, params)
          .then((e) => {
            fail(`expected error`);
          })
          .then(done)
          .catch((err) => {
            expect(err.message).toEqual(`Cannot update an unsaved resource.`);
            done();
          });
      });
    });
  });

  describe('deleting', () => {
    let item;
    let params = { foo: 'bar' };

    beforeEach(() => {
      item = {};
      http_svc.delete = resolving_promise_spy('http_svc.delete');
    });

    describe(`when resource is saved`, () => {
      beforeEach(() => {
        item.id = 42;
      });

      it(`deletes using the http service`, (done) => {
        svc.delete(item)
          .then(() => {
            expect(http_svc.delete).toHaveBeenCalledWith(`${api_host}/${resource}/${item.id}`);
          })
          .then(done);
      });

      it(`publishes a resource deleted event`, (done) => {
        svc.resource_name = 'productions';
        cache_svc.set(svc.resource_name, item.id, item);

        svc.delete(item)
          .then(() => {
            expect(eventer.publish).toHaveBeenCalledWith(events.productions.DELETED, item);
          })
          .then(done);
      });
    });

    describe(`when resource isn't saved`, () => {
      it(`rejects the promise`, (done) => {
        svc.delete(item)
          .then((e) => {
            fail(`expected error`);
          })
          .then(done)
          .catch((err) => {
            expect(err.message).toEqual(`Cannot delete an unsaved resource.`);
            done();
          });
      });
    });
  });

  describe('deleting all', () => {
    beforeEach(() => {
      let resp = {
        data: items
      };
      http_svc.get = resolving_promise_spy('http_svc.get', resp);
      http_svc.delete = resolving_promise_spy('http_svc.delete');
    });

    it('calls delete on each metric', (done) => {
      svc.delete_all()
        .then(() => {
          expect(http_svc.delete).toHaveBeenCalledWith(`${api_host}/${resource}/${items[0].id}`);
          expect(http_svc.delete).toHaveBeenCalledWith(`${api_host}/${resource}/${items[1].id}`);
          done();
        });
    });
  });
});

