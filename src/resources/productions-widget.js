import {inject} from 'aurelia-framework';

import {ProductionsService} from '../productions-service';
import {GoogleChartService, LINE_CHART} from '../google-chart-service';
import {date_format} from '../util';

@inject(ProductionsService, GoogleChartService)
export class ProductionsWidget {
  constructor(prod_svc, chart_svc) {
    this.chart_svc = chart_svc;
    this.prod_svc = prod_svc;

    this.chart_id = 'egg-chart-productions';

    this.prod_svc.all()
      .then((productions) => {
        this.productions = productions;
        this._draw_chart();
      });
  }

  _draw_chart() {
    let options = {
      legend: { position: 'bottom' }
    };

    let data = this.chart_svc.chart_data(
      this.productions,
      'count',
      'Date',
      (p) => { return date_format(p.date); },
      (p) => { return p.product.name; }
    );

    this.chart_svc.draw(LINE_CHART, this.chart_id, data, options);
  }
}
