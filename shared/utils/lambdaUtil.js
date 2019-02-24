const is = require('is_js');

function isLocal() {
  return process.env.IS_OFFLINE || process.env.IS_LOCAL || !process.env.LAMBDA_TASK_ROOT;
}

/**
 * Depending on the endpoint type the identity information can be at
 * event.requestContext.identity (AWS_PROXY) or at context.identity (AWS)
 *
 * @param {object} lambdaEvent
 * @param {object} lambdaContext
 */
function getIdentity(lambdaEvent, lambdaContext) {
  if (is.propertyDefined(lambdaContext, 'identity')) {
    return lambdaContext.identity;
  }

  if (is.propertyDefined(lambdaEvent, 'requestContext')) {
    return lambdaEvent.requestContext.identity;
  }

  return null;
}

module.exports = {
  isLocal,
  getIdentity,
};
