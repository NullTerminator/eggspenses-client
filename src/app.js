import {inject} from 'aurelia-framework';

import {GoogleChartService} from './google-chart-service';
import * as routes from './routes';

@inject(GoogleChartService)
export class App {
  constructor(chart_svc) {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(chart_svc.load.bind(chart_svc));
  }

  configureRouter(config, router) {
    config.title = `Eggspenses`;

    let mapped_routes = [
      { route: ``, moduleId: `summary`, name: routes.SUMMARY },
      { route: `productions`, moduleId: `productions`, name: routes.PRODUCTIONS },
    ];

    config.map(mapped_routes);

    this.router = router;
  }
}
