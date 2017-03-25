import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {DateRangeWidget} from './date-range-widget';
import {GoogleChartService, LINE_CHART} from '../google-chart-service';
import {ExpensesService} from '../expenses-service';
import {AssetEventsService} from '../asset-events-service';
import {ExpenseCalculator} from '../expense-calculator';
import {chart_date_format} from '../util';

@inject(ExpensesService, AssetEventsService, GoogleChartService)
export class ExpensesWidget extends DateRangeWidget {
  constructor(expenses_svc, asset_events_svc, chart_svc) {
    super();
    this.chart_svc = chart_svc;
    this.expenses_svc = expenses_svc;
    this.asset_events_svc = asset_events_svc;

    this.chart_id = 'eggs-chart-expenses';
    this.init_dates();
  }

  make_request() {
    Promise.all([
      this.expenses_svc.all(this.date_params()),
      this.asset_events_svc.all(this.date_params())
    ])
      .then((responses) => {
        this.expenses = responses[0];
        this.asset_events = responses[1];
        this._draw_chart();
      });
  }

  _draw_chart() {
    let options = {
      legend: { position: 'bottom' }
    };

    let calc = new ExpenseCalculator(this.expenses, this.asset_events);
    let daily = calc.calculate(this.start_date, this.end_date);

    let data = this.chart_svc.chart_data(
      daily,
      'amount',
      'Date',
      this.date_range_strings(),
      (e) => { return chart_date_format(e.date); },
      (e) => { return e.asset.name; }
    );

    this.chart_svc.draw(LINE_CHART, this.chart_id, data, options);
  }
}
