import {inject, observable} from 'aurelia-framework';

import {by, date_format, today} from '../util';
import {ProductsService} from '../products-service';
import {ProductionsService} from '../productions-service';

@inject(ProductsService, ProductionsService)
export class NewProductionWidget {
  @observable selected_product
  @observable date

  constructor(products_svc, productions_svc) {
    this.products_svc = products_svc;
    this.productions_svc = productions_svc;

    this.new_production = {};
    this.products = [];
    this.selected_product = null;
    this.date = today();

    let params = {
      from_date: date_format(today()),
      to_date: date_format(today())
    };
    this.products_svc.all()
      .then((products) => {
        this.products = products;

        if (this.products.length > 0) {
          this.selected_product = this.products[0];
        }
      });
  }

  save() {
    return this.productions_svc.save(this.new_production)
      .then((prod) => {
        if (this.new_production.date < today()) {
          this.increment_day();
        } else {
          Object.assign(this.new_production, prod);
        }
      });
  }

  delete() {
    if (confirm(`Are you sure you want to delete this production?`)) {
      return this.productions_svc.delete(this.new_production)
        .then(() => {
          this.new_production.id = null;
          this.new_production.count = 0;
        });
    }
  }

  increment_day() {
    // Need to assign a new obj to date to trigger observable changed
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() + 1);
  }

  decrement_day() {
    // Need to assign a new obj to date to trigger observable changed
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1);
  }

  dateChanged() {
    this._set_new_production();
  }

  selected_productChanged(new_val, old_val) {
    if (new_val !== old_val) {
      this._set_new_production();
    }
  }

  _set_new_production() {
    if (!this.date || !this.selected_product) {
      return;
    }

    let params = {
      for_product_id: this.selected_product.id,
      from_date: date_format(this.date),
      to_date: date_format(this.date)
    };
    //TODO:? store productions in here and find locally first?
    this.productions_svc.all(params)
      .then((productions) => {
        if (productions.length > 0) {
          Object.assign(this.new_production, productions[0]);
        } else {
          this.new_production.id = null;
          this.new_production.count = 0;
          this.new_production.product = this.selected_product;
          this.new_production.date = this.date;
        }
      });
  }
}
