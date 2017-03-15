import {inject} from 'aurelia-framework';

import {ProductionsService} from '../productions-service';
import {GoogleChartService} from '../google-chart-service';
import {date_format, group_by, sort_by} from '../util';

@inject(ProductionsService, GoogleChartService)
export class ProductionsWidget {
  constructor(prod_svc, chart_svc) {
    this.chart_svc = chart_svc;
    this.prod_svc = prod_svc;
    this.prod_svc.all()
      .then((resources) => {
        this.productions = resources;
        this._fill_chart();
      });

    this.chart_id = 'egg-chart-productions';
  }

  _fill_chart() {
    this.chart_svc.loaded()
      .then(() => {
        let grouped = group_by(this.productions, `product`);
        grouped = grouped.map((group) => {
          return sort_by(group, `date`);
        });
        console.log(grouped);
        let data = [[`Date`].concat(grouped.map((group) => { return group[0].product.name }))];
        for (let i = 0; i < grouped[0].length; i++) {
          data.push([grouped[0][i].date.getDate(), grouped[0][i].count, grouped[1][i].count]);
        }
        data = google.visualization.arrayToDataTable(data);

        let options = {
          //title: 'Egg Production',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById(this.chart_id));
        chart.draw(data, options);
      });
  }
}
