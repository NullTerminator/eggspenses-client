import {observable} from 'aurelia-framework';

import {today, days_ago} from '../util';

export class DateRangeWidget {
  @observable start_date;
  @observable end_date;

  init_dates() {
    this.start_date = days_ago(6);
    this.end_date = today();
  }

  start_dateChanged(new_val, old_val) {
    if ((new_val && !old_val) || (new_val && old_val && new_val.getTime() !== old_val.getTime())) {
      this._safe_make_request();
    }
  }

  end_dateChanged(new_val, old_val) {
    if ((new_val && !old_val) || (new_val && old_val && new_val.getTime() !== old_val.getTime())) {
      this._safe_make_request();
    }
  }

  _safe_make_request() {
    if (this.start_date && this.end_date) {
      this.make_request();
    }
  }

  _is_in_range(resource) {
    return this.start_date <= resource.date && this.end_date >= resource.date;
  }
}
