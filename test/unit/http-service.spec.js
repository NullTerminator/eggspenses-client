import {HttpService} from '../../src/http-service';
//import {HttpError} from '../../src/http-error';

describe('Http Service', () => {
  let svc, xhr;
  let orig_XMLHttpRequest = XMLHttpRequest;

  beforeEach(() => {
    xhr = {
      open: jasmine.createSpy('xhr.open'),
      setRequestHeader: jasmine.createSpy('xhr.setRequestHeader'),
      send: jasmine.createSpy('xhr.send')
    };

    XMLHttpRequest = jasmine.createSpy('XMLHttpRequest');
    XMLHttpRequest.and.callFake(function() {
      return xhr;
    });

    svc = new HttpService();
  });

  afterEach(() => {
    XMLHttpRequest = orig_XMLHttpRequest;
  });

  describe('.post', () => {
    let path = 'foo';

    it('posts to the path', () => {
      svc.post(path);

      expect(xhr.open).toHaveBeenCalledWith('post', path);
      expect(xhr.send).toHaveBeenCalled();
    });

    describe('with params', () => {
      let params = {
        foo: 'bar',
        fiz: 123
      };

      it('sends the params as JSON', () => {
        svc.post(path, params);

        expect(xhr.send).toHaveBeenCalledWith(JSON.stringify(params));
      });
    });

    describe('on successful request', () => {
      let response = { foo: 'bar' };

      beforeEach(() => {
        xhr.status = 200;
        xhr.responseText = JSON.stringify(response);
      });

      it('resolves promise with the json response data', (done) => {
        svc.post(path)
          .then((r) => {
            expect(r).toEqual(response);
          })
          .then(done);

        expect(xhr.onload).toEqual(jasmine.any(Function));
        xhr.onload();
      });
    });

    describe('with 204 response status', () => {
      beforeEach(() => {
        xhr.status = 204;
        xhr.responseText = '';
      });

      it('does not try to parse the reponse body', (done) => {
        svc.post(path)
          .then(done)
          .catch(() => {
            fail('an error was raised');
            done();
          });

        xhr.onload();
      });
    });
  });

  describe('when an error occurs', () => {
    let path = 'foo';

    it('rejects the promise with an HttpError', (done) => {
      svc.get(path)
        .catch((err) => {
          expect(err.path).toEqual(path);
          done();
        });

      expect(xhr.onerror).toEqual(jasmine.any(Function));
      xhr.onerror();
    });

    describe('on a bad status', () => {
      let params = { foo: 'bar' };
      let body = { bar: 'baz' };

      it('rejects the promise with an HttpError', (done) => {
        svc.post(path, params)
          .catch((err) => {
            expect(err.path).toEqual(path);
            expect(err.params).toEqual(params);
            expect(err.body).toEqual(body);
            done();
          });

        xhr.responseText = JSON.stringify(body);
        xhr.status = 404;
        xhr.onload();
      });
    });
  });
});
