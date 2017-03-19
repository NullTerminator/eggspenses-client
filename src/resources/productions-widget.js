import {inject} from 'aurelia-framework';

import {DateRangeWidget} from './date-range-widget';
import {ProductionsService} from '../productions-service';
import {GoogleChartService, LINE_CHART} from '../google-chart-service';
import {date_format, months} from '../util';

@inject(ProductionsService, GoogleChartService)
export class ProductionsWidget extends DateRangeWidget {
  constructor(prod_svc, chart_svc) {
    super();
    this.chart_svc = chart_svc;
    this.prod_svc = prod_svc;

    this.chart_id = 'egg-chart-productions';
    this.init_dates();
  }

  make_request() {
    let params = {
      from_date: date_format(this.start_date),
      to_date: date_format(this.end_date)
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

    let date_range = [];
    let date = this.start_date;
    while (true) {
      date_range.push(chart_date_format(date));
      if (date.getTime() === this.end_date.getTime()) {
        break;
      }
      date.setDate(date.getDate() + 1);
    }

    let data = this.chart_svc.chart_data(
      this.productions,
      'count',
      'Date',
      date_range,
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
