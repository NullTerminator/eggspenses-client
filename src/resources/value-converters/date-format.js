import {date_format} from '../../util';

export class DateFormatValueConverter {
  toView(value) {
    return date_format(value);
  }

  fromView(value) {
    let parts = value.split('-');
    return new Date(parts[0], parts[1]-1, parts[2]);
  }
}
