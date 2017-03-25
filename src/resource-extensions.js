import {parse_api_date} from './util';

export default {
  productions: (production) => {
    if (typeof production.date === 'string') {
      production.date = parse_api_date(production.date);
    }
  }
}
