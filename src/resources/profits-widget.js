import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {DateRangeWidget} from './date-range-widget';
import {GoogleChartService, LINE_CHART} from '../google-chart-service';
import {ExpensesService} from '../expenses-service';
import {AssetEventsService} from '../asset-events-service';
import {SaleItemsService} from '../sale-items-service';
import {ProductionsService} from '../productions-service';
import {ExpenseCalculator} from '../expense-calculator';
import {ProfitCalculator} from '../profit-calculator';
import {chart_date_format, sum} from '../util';
import events from '../events';

@inject(ExpensesService, AssetEventsService, SaleItemsService, ProductionsService, GoogleChartService, EventAggregator)
export class ProfitsWidget extends DateRangeWidget {
  constructor(expenses_svc, asset_events_svc, sale_items_svc, prod_svc, chart_svc, eventer) {
    super();
    this.chart_svc = chart_svc;
    this.expenses_svc = expenses_svc;
    this.asset_events_svc = asset_events_svc;
    this.sale_items_svc = sale_items_svc;
    this.productions_svc = prod_svc;

    this.chart_id = 'eggs-chart-profits';
    this.init_dates();

    eventer.subscribe(events.productions.CREATED, this._check_add_production.bind(this));
    eventer.subscribe(events.productions.UPDATED, this._check_add_production.bind(this));
    eventer.subscribe(events.productions.DELETED, this._check_remove_production.bind(this));
  }

  make_request() {
    Promise.all([
      this.expenses_svc.all(this.date_params()),
      this.asset_events_svc.all(this.date_params()),
      this.productions_svc.all(this.date_params()),
      this.sale_items_svc.all()
    ])
      .then((responses) => {
        this.expenses = responses[0];
        this.asset_events = responses[1];
        this.productions = responses[2];
        this.sale_items = responses[3];
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

    let expenses_calc = new ExpenseCalculator(this.expenses, this.asset_events);
    let daily_expenses = expenses_calc.calculate(this.start_date, this.end_date);

    let profits_calc = new ProfitCalculator(this.sale_items, this.productions, daily_expenses);
    let daily_profits = profits_calc.calculate(this.start_date, this.end_date);
    this.total_profit = sum(daily_profits, `amount`);

    let data = this.chart_svc.chart_data(
      daily_profits,
      'amount',
      'Date',
      this.date_range_strings(),
      (p) => { return chart_date_format(p.date); },
      (p) => { return p.sale_item.name; }
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
