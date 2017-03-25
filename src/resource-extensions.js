import {parse_api_date} from './util';

export default {
  productions: (production) => {
    if (typeof production.date === 'string') {
      production.date = parse_api_date(production.date);
    }
  },

  expenses: (expense) => {
    if (typeof expense['start-date'] === 'string') {
      expense.start_date = parse_api_date(expense['start-date']);
    }
    if (typeof expense['end-date'] === 'string') {
      expense.end_date = parse_api_date(expense['end-date']);
    }
  },

  asset_events: (event) => {
    if (typeof event.date === 'string') {
      event.date = parse_api_date(event.date);
    }
  },
}
