import * as routes from './routes';

export class App {
  constructor() {
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
