import {GoogleChartService} from '../../src/google-chart-service';

describe(`Google Chart Service`, () => {
  let svc;

  beforeEach(() => {
    svc = new GoogleChartService();
  });

  describe(`getting chart data from an array of objects`, () => {
    let foo1 = { name: 'Barzy' };
    let foo2 = { name: 'Foozy' };
    let data = [
      { bar: 7, count: 4, foo: foo1 },
      { bar: 3, count: 1, foo: foo1 },
      { bar: 7, count: 7, foo: foo2 },
      { bar: 3, count: 3, foo: foo2 },
      { bar: 3, count: 8, foo: foo2 },
      { bar: 9, count: 13, foo: foo2 },
    ];
    let rows = [3, 7, 9];

    let results;
    beforeEach(() => {
      results = svc.chart_data(data, 'count', 'Zar', rows, 'bar', (i) => { return i.foo.name; });
    });

    it(`populates titles row`, () => {
      expect(results[0]).toEqual(['Zar', 'Barzy', 'Foozy']);
    });

    it(`populates data rows`, () => {
      expect(results.length).toEqual(4);
      expect(results[1]).toEqual([3, 1, 11]);
      expect(results[2]).toEqual([7, 4, 7]);
      expect(results[3]).toEqual([9, null, 13]);
    });
  });
});
