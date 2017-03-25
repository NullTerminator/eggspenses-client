import {ExpenseCalculator} from '../../src/expense-calculator';

import {days_ago} from '../../src/util';

describe(`Expense Calculator`, () => {
  let calc, expenses, events;

  beforeEach(() => {
    expenses = [];
    events = [];
  });

  function create_calc() {
    calc = new ExpenseCalculator(expenses, events);
  }

  describe(`calculating daily expenses`, () => {
    let calculated;
    let asset1 = { name: 'Rocks' };
    let asset2 = { name: 'Sticks' };
    let event1 = { count: 5, asset: asset1, date: days_ago(6) };
    let event1a = { count: 7, asset: asset1, date: days_ago(1) };
    let event2 = { count: 10, asset: asset2, date: days_ago(2) };
    let expense1 = { price: 0.5, expensable: asset1 }
    let expense1_dated = { price: 0.1, expensable: asset1, start_date: days_ago(2), end_date: days_ago(2) }
    let expense2 = { price: 1.0, expensable: asset2 }
    let sale_item = { };
    let sale_item_expense = { price: 5.0, expensable: sale_item };

    let expected1 = [
      { date: days_ago(3), amount: 5 * 0.5, asset: asset1 },
      { date: days_ago(2), amount: 5 * 0.6, asset: asset1 },
      { date: days_ago(1), amount: 7 * 0.5, asset: asset1 },
    ];
    let expected2 = [
      { date: days_ago(3), amount: 0, asset: asset2 },
      { date: days_ago(2), amount: 10, asset: asset2 },
      { date: days_ago(1), amount: 10, asset: asset2 },
    ];

    beforeEach(() => {
      let from = days_ago(3);
      let to = days_ago(1);

      expenses = [expense1, expense1_dated, expense2, sale_item_expense];
      events = [event1, event1a, event2];

      create_calc();
      calculated = calc.calculate(from, to);
    });

    it(`returns an array with an expense / day / asset`, () => {
      expect(calculated.length).toEqual(6);
    });

    it(`returns an expense for asset1 each day`, () => {
      expected1.forEach((e) => {
        expect(calculated).toContain(jasmine.objectContaining(e));
      });
    });

    it(`returns an expense with 0 amount before asset was aquired`, () => {
      expect(calculated).toContain(jasmine.objectContaining(
        { date: days_ago(3), amount: 0, asset: asset2 }
      ));
    });

    it(`returns an expense for asset2 each day after it's aquired`, () => {
      expect(calculated).toContain(jasmine.objectContaining(
        { date: days_ago(2), amount: 10, asset: asset2 }
      ));
      expect(calculated).toContain(jasmine.objectContaining(
      { date: days_ago(1), amount: 10, asset: asset2 }
      ));
    });
  });
});
