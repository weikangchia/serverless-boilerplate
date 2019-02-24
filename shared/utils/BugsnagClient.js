const bugsnag = require('@bugsnag/js');

let client = null;

function initClient(bugsnagOptions) {
  client = bugsnag(bugsnagOptions);
  return client;
}

function getClient() {
  return client;
}

module.exports = {
  initClient,
  getClient,
};
