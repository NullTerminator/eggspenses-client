import {HttpError} from '../../src/http-error';

describe('HttpError', () => {
  let err;
  let message = 'Message';
  let path = '/foos';
  let params = { foo: 'bar' };
  let body = { bar: 'baz' };

  beforeEach(() => {
    err = new HttpError(message, path, params, body);
  });

  it('is an Error', () => {
    expect(err instanceof Error).toBe(true);
  });

  it('is an HttpError', () => {
    expect(err instanceof HttpError).toBe(true);
  });

  it('sets attrs', () => {
    expect(err.path).toEqual(path);
    expect(err.params).toEqual(params);
    expect(err.body).toEqual(body);
  });

  it('has a message', () => {
    expect(err.message).toEqual(message);
  });

  it('has a stack attr', () => {
    expect(err.stack).not.toBe(null);
  });
});
