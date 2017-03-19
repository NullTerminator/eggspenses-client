import {bindable} from 'aurelia-framework';

import {days_ago, months_ago, years_ago, today} from '../util';

const THIS_WEEK = `1wk`;
const THIS_MONTH = `1mo`;
const THREE_MONTHS = `3mo`;
const SIX_MONTHS = `6mo`;
const ONE_YEAR = `1yr`;
const CUSTOM = 'Custom';

@bindable('startDate')
@bindable('endDate')
export class DateChooser {
  constructor() {
    this.options = [
      CUSTOM,
      ONE_YEAR,
      SIX_MONTHS,
      THREE_MONTHS,
      THIS_MONTH,
      THIS_WEEK,
    ];
    this.selected_option = THIS_WEEK;
    this.custom = false;
  }

  date_changed() {
    this.custom = this.selected_option === CUSTOM;
    this.endDate = today();

    switch(this.selected_option) {
      case THIS_WEEK:
        this.startDate = days_ago(6);
        break;
      case THIS_MONTH:
        this.startDate = months_ago(1);
        break;
      case THREE_MONTHS:
        this.startDate = months_ago(3);
        break;
      case SIX_MONTHS:
        this.startDate = months_ago(6);
        break;
      case ONE_YEAR:
        this.startDate = years_ago(1);
        break;
      default:
        break;
    };

    return true;
  }
}
