export function HttpError(message, path, params, body) {
  this.name = 'HttpError';
  this.stack = (new Error()).stack;
  this.message = message;
  this.path = path;
  this.params = params;
  this.body = body || {};
}

HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;
