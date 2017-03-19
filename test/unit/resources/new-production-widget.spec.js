import {NewProductionWidget} from '../../../src/resources/new-production-widget';

import {resolving_promise_spy} from '../promise-spy.js';

import {date_format, days_ago, today} from '../../../src/util';

Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});

describe('New Production Widget Element', () => {
  let elem, products_svc, productions_svc;
  let products = [
    { id: 1, name: `Foo` },
    { id: 2, name: `Bar` },
  ];

  beforeEach((done) => {
    products_svc = {
      all: resolving_promise_spy(`products_svc.all`, products)
    };

    productions_svc = {
      all: resolving_promise_spy(`productions_svc.all`, [])
    };

    create_element(done);
  });

  function create_element(done) {
    elem = new NewProductionWidget(products_svc, productions_svc);

    // constructor creates a promise, which creates a promise when it resolves
    // there has to be a better way to do this
    Promise.resolve()
      .then(() => {
        Promise.resolve().then(done);
      });
  }

  it(`gets all products`, () => {
    expect(products_svc.all).toHaveBeenCalledWith();
  });

  it(`queries for today's productions`, () => {
    expect(productions_svc.all).toHaveBeenCalledWith(jasmine.objectContaining({
      from_date: date_format(today()),
      to_date: date_format(today())
    }));
  });

  it(`sets selected product`, () => {
    expect(elem.selected_product).toEqual(products[0]);
  });

  it(`defaults new production's date to today`, () => {
    expect(elem.new_production.date.getTime()).toEqual(today().getTime());
  });

  it(`defaults new production's product to selected product`, () => {
    expect(elem.new_production.product).toEqual(products[0]);
  });

  describe(`when productions exist`, () => {
    let productions;

    beforeEach((done) => {
      productions = [
        { id: 7, count: 69, product: products[0] }
      ];

      productions_svc = {
        all: resolving_promise_spy(`productions_svc.all`, productions)
      };

      create_element(done);
    });

    it(`makes new_production a copy of existing production`, () => {
      expect(elem.new_production).toEqual(jasmine.objectContaining({
        id: productions[0].id,
        count: productions[0].count,
        product: productions[0].product,
      }));
    });
  });

  describe(`saving the production`, () => {
    beforeEach(() => {
      productions_svc.save = resolving_promise_spy(`products_svc.save`, { id: 42, product: products[0] })
    });

    it(`saves with the productions service`, (done) => {
      elem.save()
      .then(() => {
        expect(productions_svc.save).toHaveBeenCalledWith(elem.new_production);
      })
      .then(done);
    });

    it(`new_production's date is still today`, (done) => {
      elem.save()
        .then(() => {
          expect(elem.new_production.date.getTime()).toEqual(today().getTime());
        })
        .then(done);
    });

    it(`updates new_production to created so it can be updated`, (done) => {
      elem.save()
        .then(() => {
          expect(elem.new_production.id).toBe(42);
        })
        .then(done);
    });

    describe(`when date is before today`, () => {
      beforeEach(() => {
        elem.date = days_ago(6);
      });

      it(`new_production is still a new resource`, (done) => {
        elem.save()
          .then(() => {
            expect(elem.new_production.id).toBe(null);
          })
          .then(done);
      });

      it(`moves the date up a day`, (done) => {
        elem.save()
          .then(() => {
            return Promise.resolve()
              .then(() => {
                expect(elem.new_production.date.getTime()).toEqual(days_ago(5).getTime());
                expect(elem.date.getTime()).toEqual(days_ago(5).getTime());
              })
              .then(done);
          });
      });
    });
  });
});
