import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {DateRangeWidget} from './date-range-widget';
import {ProductionsService} from '../productions-service';
import {GoogleChartService, LINE_CHART} from '../google-chart-service';
import {date_format, months, chart_date_format} from '../util';
import events from '../events';

@inject(ProductionsService, GoogleChartService, EventAggregator)
export class ProductionsWidget extends DateRangeWidget {
  constructor(prod_svc, chart_svc, eventer) {
    super();
    this.chart_svc = chart_svc;
    this.prod_svc = prod_svc;

    this.chart_id = 'eggs-chart-productions';
    this.init_dates();

    eventer.subscribe(events.productions.CREATED, this._check_add_production.bind(this));
    eventer.subscribe(events.productions.UPDATED, this._check_add_production.bind(this));
    eventer.subscribe(events.productions.DELETED, this._check_remove_production.bind(this));
  }

  make_request() {
    this.prod_svc.all(this.date_params())
      .then((productions) => {
        this.productions = productions;
        this._draw_chart();
      });
  }

  _draw_chart() {
    if (this.productions.length === 0) {
      return;
    }

    let options = {
      legend: { position: 'bottom' }
    };

    let data = this.chart_svc.chart_data(
      this.productions,
      'count',
      'Date',
      this.date_range_strings(),
      (p) => { return chart_date_format(p.date); },
      (p) => { return p.product.name; }
    );

    this.chart_svc.draw(LINE_CHART, this.chart_id, data, options);
  }

  _check_add_production(production) {
    if (this._is_in_range(production)) {
      if (this.productions.indexOf(production) === -1) {
        this.productions.push(production);
      }
      this._draw_chart();
    }
  }

  _check_remove_production(production) {
    let i = this.productions.indexOf(production);
    if (i !== -1) {
      this.productions.splice(i, 1);
      this._draw_chart();
    }
  }
}
