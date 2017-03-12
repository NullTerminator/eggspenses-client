import environment from './environment';
import {load} from 'aurelia-environment';

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia) {
  load()
    .then(() => {
      aurelia.use
        .standardConfiguration()
        .feature('resources');

      if (environment.debug) {
        aurelia.use.developmentLogging();
      }

      if (environment.testing) {
        aurelia.use.plugin('aurelia-testing');
      }

      aurelia.start().then(() => aurelia.setRoot());
    });
}
