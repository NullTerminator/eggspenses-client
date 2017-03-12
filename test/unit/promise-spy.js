export function resolving_promise_spy(name, retval) {
  return jasmine.createSpy(name).and.callFake(() => {
    return Promise.resolve(retval);
  });
}

export function rejecting_promise_spy(name, retval) {
  return jasmine.createSpy(name).and.callFake(() => {
    return Promise.reject(retval);
  });
}
