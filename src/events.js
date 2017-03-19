let events = {};

[`productions`].forEach((resource) => {
  let res_obj = {};

  [`CREATED`, `UPDATED`, `DELETED`].forEach((event) => {
    res_obj[event] = `${resource.toUpperCase()}_${event}`;
  });

  events[resource] = res_obj;
});

export default events;
