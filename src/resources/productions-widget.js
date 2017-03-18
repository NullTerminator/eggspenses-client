import {inject} from 'aurelia-framework';

import {ProductionsService} from '../productions-service';
import {GoogleChartService, LINE_CHART} from '../google-chart-service';
import {date_format, months, today, days_ago} from '../util';

@inject(ProductionsService, GoogleChartService)
export class ProductionsWidget {
  constructor(prod_svc, chart_svc) {
    this.chart_svc = chart_svc;
    this.prod_svc = prod_svc;

    this.chart_id = 'egg-chart-productions';

    let params = {
      from_date: date_format(days_ago(6)),
      to_date: date_format(today())
    };
    this.prod_svc.all(params)
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
      (p) => { return chart_date_format(p.date); },
      (p) => { return p.product.name; }
    );

    this.chart_svc.draw(LINE_CHART, this.chart_id, data, options);
  }
}

export function chart_date_format(date) {
  let day = date.getDate();
  let month = date.getMonth();

  return `${months[month]} ${day} ${date.getFullYear()}`;
}
