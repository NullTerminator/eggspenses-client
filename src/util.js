const months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export function date_format(date) {
  let day = date.getDate();
  let month = date.getMonth();

  return `${months[month]} ${day} ${date.getYear()}`;
}

export function sort_by(arr, key) {
  return arr.sort(function(a, b) {
    return a[key] - b[key];
  });
}

export function group_by(arr, key) {
  let group_keys = [];
  let grouped = [];

  arr.forEach((i) => {
    let group_key = i[key];
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
