const months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export function date_format(date) {
  let day = date.getDate();
  let month = date.getMonth();

  return `${months[month]} ${day} ${date.getYear()}`;
}

export function sort_by(arr, key_func) {
  key_func = ensure_attr_func(key_func);

  return arr.sort(function(a, b) {
    return key_func(a) - key_func(b);
  });
}

export function by(key_func) {
  key_func = ensure_attr_func(key_func);

  return (i) => {
    return key_func(i);
  }
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
