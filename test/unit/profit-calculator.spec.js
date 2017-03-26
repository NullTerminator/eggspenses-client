import {ProfitCalculator} from '../../src/profit-calculator';

import {days_ago} from '../../src/util';

describe(`Profit Calculator`, () => {
  function create_calc(sale_items, productions, daily_expenses) {
    return new ProfitCalculator(sale_items, productions, daily_expenses);
  }

  let asset1 = { name: 'Rocks' };
  let product1 = { name: 'sand', asset: asset1 };
  let sale_item1 = { name: 'Bag O Sand', price: 1.50, product_count: 10, product: product1, expenses: [] }
  let productions1 = [
    { count: 5, date: days_ago(3), product: product1 },
    { count: 15, date: days_ago(2), product: product1 },
    { count: 10, date: days_ago(1), product: product1 },
  ];
  let expenses1 = [
    { amount: 0.1, date: days_ago(3), asset: asset1 },
    { amount: 0.1, date: days_ago(2), asset: asset1 },
    { amount: 0.1, date: days_ago(1), asset: asset1 },
  ];
  let expected1 = [
    { amount: (5 / 10) * 1.5 - 0.1, date: days_ago(3), sale_item: sale_item1 },
    { amount: (15 / 10) * 1.5 - 0.1, date: days_ago(2), sale_item: sale_item1 },
    { amount: (10 / 10) * 1.5 - 0.1, date: days_ago(1), sale_item: sale_item1 },
  ];

  let asset2 = { name: 'Sticks' };
  let product2 = { name: 'splinters', asset: asset2 };
  let sale_item2 = { name: 'Tons O Splinters', price: 0.95, product_count: 50, product: product2, expenses: [] }
  let expense2 = { name: 'Bandaids', price: 0.1, expensable: sale_item2 };
  sale_item2.expenses.push(expense2);
  let productions2 = [
    { count: 10, date: days_ago(3), product: product2 },
    { count: 20, date: days_ago(2), product: product2 },
    { count: 30, date: days_ago(1), product: product2 },
  ];
  let expenses2 = [
    { amount: 0.2, date: days_ago(3), asset: asset2 },
    { amount: 0.2, date: days_ago(2), asset: asset2 },
    { amount: 0.2, date: days_ago(1), asset: asset2 },
  ];
  let expected2 = [
    { amount: (10 / 50) * 0.85 - 0.2, date: days_ago(3), sale_item: sale_item2 },
    { amount: (20 / 50) * 0.85 - 0.2, date: days_ago(2), sale_item: sale_item2 },
    { amount: (30 / 50) * 0.85 - 0.2, date: days_ago(1), sale_item: sale_item2 },
  ];

  describe(`calculating daily profits`, () => {
    let calculated;

    beforeEach(() => {
      let sale_items = [sale_item1, sale_item2];
      let productions = productions1.concat(productions2);
      let expenses = expenses1.concat(expenses2);

      let calc = create_calc(sale_items, productions, expenses);
      calculated = calc.calculate();
    });

    it(`returns an array with a profit / day / sale item`, () => {
      expect(calculated.length).toEqual(6);
    });

    it(`returns an expense for asset1 each day`, () => {
      expected1.forEach((e) => {
        expect(calculated).toContain(jasmine.objectContaining(e));
      });
    });

    it(`returns an expense for asset2 each day`, () => {
      expected2.forEach((e) => {
        expect(calculated).toContain(jasmine.objectContaining(e));
      });
    });

  });
});
