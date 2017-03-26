export const months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export function date_format(date) {
  return date.toJSON().slice(0, 10);
}

export function chart_date_format(date) {
  let day = date.getDate();
  let month = date.getMonth();

  return `${months[month]} ${day} ${date.getFullYear()}`;
}

export function parse_api_date(date) {
  let parts = date.split('-');
  return new Date(parts[0], parts[1]-1, parts[2]);
}

export function date_range(from, to) {
  let range = [];
  let date = new Date(from.getTime());
  while (true) {
    range.push(new Date(date.getTime()));
    if (date.getTime() === to.getTime()) {
      break;
    }
    date.setDate(date.getDate() + 1);
  }
  return range;
}

export function today() {
  let d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function days_ago(ago) {
  let d = today();
  d.setDate(d.getDate() - ago);
  return d;
}

export function months_ago(ago) {
  let d = today();
  d.setMonth(d.getMonth() - ago);
  return d;
}

export function years_ago(ago) {
  let d = today();
  d.setFullYear(d.getFullYear() - ago);
  return d;
}

export function sort_by(arr, key_func) {
  key_func = ensure_attr_func(key_func);

  return arr.sort(function(a, b) {
    return key_func(a) - key_func(b);
  });
}

export function by(key_func, val) {
  key_func = ensure_attr_func(key_func);

  return (i) => {
    return key_func(i) === val;
  }
}

export function sum(arr, key_func) {
  key_func = ensure_attr_func(key_func);
  return arr.reduce((sum, i) => { return sum + key_func(i); }, 0.0);
}

export function group_by(arr, key_func) {
  key_func = ensure_attr_func(key_func);
  let group_keys = [];
  let grouped = [];

  arr.forEach((i) => {
    let group_key = key_func(i);
    let index = group_keys.indexOf(group_key);
    if (index === -1) {
      group_keys.push(group_key);
      grouped.push([i]);
    } else {
      grouped[index].push(i);
    }
  });

  return grouped;
}

export function unique(v, i, arr) {
  return arr.indexOf(v) === i;
}

export function ensure_attr_func(func) {
  if (typeof func !== 'function') {
    return (i) => { return i[func]; };
  }
  return func;
}

export function ensure_val_func(func) {
  if (typeof func !== 'function') {
    return (i) => { return func; };
  }
  return func;
}
