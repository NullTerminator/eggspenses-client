export class GoogleChartService {
  constructor() {
    this._promise = new Promise((resolve) => {
      this._resolver = resolve;
    });
  }

  load() {
    this._resolver();
  }

  loaded() {
    return this._promise;
  }
}
