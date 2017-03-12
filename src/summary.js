import {inject} from 'aurelia-framework';

import {AssetService} from './asset-service';

@inject(AssetService)
export class Summary {
  constructor(asset_svc) {
    this.asset_svc = asset_svc;
    this.asset_svc.get(1)
      .then((ass) => {
        this.asset = ass;
      });
  }
}
