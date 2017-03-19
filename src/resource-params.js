export default {
  productions: (production) => {
    return {
      count: production.count,
      date: production.date,
      product_id: production.product.id
    };
  }
}
