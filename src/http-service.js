import {HttpError} from './http-error';

export class HttpService {
  post(path, params) {
    return request(path, 'post', params);
  }

  put(path, params) {
    return request(path, 'put', params);
  }

  get(path, params) {
    if (params) {
      path += `?` + Object.keys(params).map((k) => {
        return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
      }).join(`&`);
    }

    return request(path, 'get');
  }

  delete(path) {
    return request(path, 'delete');
  }
}

function request(path, method, params={}) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, path);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = function() {
      let body;
      try {
        if (xhr.status !== 204) {
          body = JSON.parse(xhr.responseText);
        }
      } catch(err) {
        let message = `${method.toUpperCase()} call to ${path} `;
        if (xhr.responseType === 'json') {
          message += 'received invalid JSON';
        } else {
          message += `expected type "json", but got: "${xhr.responseType}"`;
        }
        reject(new HttpError(message, path, params));
      }
      if (xhr.status >= 200 && xhr.status <= 299) {
        resolve(body);
      } else {
        let message = `${method.toUpperCase()} call to ${path} failed with status: ${xhr.status}`;
        reject(new HttpError(message, path, params, body));
      }
    };

    xhr.onerror = function() {
      reject(new HttpError('Server could not be reached', path, params));
    };

    //if (window.env.REQUEST_CREDENTIALS) {
      //xhr.withCredentials = true;
    //}

    xhr.send(JSON.stringify(params));
  });
}
