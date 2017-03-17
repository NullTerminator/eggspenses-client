export const LINE_CHART = `LineChart`;

import {sort_by, ensure_attr_func, unique} from './util';

export class GoogleChartService {
  constructor() {
    this._promise = new Promise((resolve) => {
      this._resolver = resolve;
    });
  }

  load() {
    this._resolver();
  }

  loaded() {
    return this._promise;
  }

  draw(chart_type, elem_id, data, options) {
    this.loaded()
      .then(() => {
        data = google.visualization.arrayToDataTable(data);
        var chart = new google.visualization[chart_type](document.getElementById(elem_id));
        chart.draw(data, options);
      });
  }

  // Convert an array of objects into an array of data ready for charting
  //
  //  data:       array of objects
  //
  //  value_func: string of attr name or function to call with an object
  //              to get its value.  The result of either is used for the
  //              value in the chart
  //
  //  row_title:  string title of the first column
  //
  //  row_func:   string of attr name or function to call with an object
  //              to get its value.  The result of either is used to determine
  //              which row the object will be placed in
  //
  //  col_title_func:  a function to call with an object that will return the
  //                   title of the column it belongs in
  chart_data(data, value_func, row_title, row_func, col_title_func) {
    value_func = ensure_attr_func(value_func);
    row_func = ensure_attr_func(row_func);

    let results = [];
    // Populate titles
    let titles = [row_title].concat(data.map(col_title_func).filter(unique).sort());
    results.push(titles);

    let row_vals = data.map(row_func).filter(unique).sort();

    //prepare with 0s
    row_vals.forEach((row_val) => {
      let zeros = new Array(titles.length - 1).fill(0);
      results.push([row_val].concat(zeros));
    });

    //populate from data
    data.forEach((d) => {
      let row_i = row_vals.indexOf(row_func(d)) + 1; // Add one to offset title row
      let col_i = titles.indexOf(col_title_func(d));
      results[row_i][col_i] += value_func(d);
    });

    return results;
  }
}
