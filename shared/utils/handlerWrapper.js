const middy = require('middy');
const {
  httpEventNormalizer,
  httpHeaderNormalizer,
  jsonBodyParser,
  urlEncodeBodyParser,
} = require('middy/middlewares');

const BugsnagLambdaWrapper = require('./BugsnagLambdaWrapper');

const handlerWrapper = handler => middy(BugsnagLambdaWrapper.handler(handler))
  .use(httpEventNormalizer())
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(urlEncodeBodyParser());

module.exports = handlerWrapper;
