export default {
  productions: (production) => {
    if (typeof production.date === 'string') {
      let parts = production.date.split('-');
      production.date = new Date(parts[0], parts[1]-1, parts[2]);
    }
  }
}
