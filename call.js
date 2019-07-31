//boilerplate code
const call = (promise) =>
  promise.then(r => r == null ? ({result: r}) : r)
  .catch(error => ({error}));

const error = (result, msg) => ({error: result.error, message: msg});

module.exports = {
  call, error,
};