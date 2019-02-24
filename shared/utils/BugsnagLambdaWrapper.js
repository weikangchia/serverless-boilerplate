const is = require('is_js');
const log = require('lambda-log');
const {
  promisify,
} = require('util');

const {
  BUGSNAG,
} = require('../configs');
const {
  STAGES,
} = require('../constants');
const BugsnagClient = require('./BugsnagClient');
const errorUtil = require('./errorUtil');
const lambdaUtil = require('./lambdaUtil');

let timeoutWarning = null;
let timeoutError = null;

function installTimers(bugsnagClient, lambdaContext) {
  const timeRemaining = lambdaContext.getRemainingTimeInMillis();

  function timeoutWarningFunc() {
    log.error('Lambda function timeout warning', {
      time_remaining_in_msec: lambdaContext.getRemainingTimeInMillis(),
    });
    bugsnagClient.notify(new Error('Lambda function timeout warning', {
      severity: 'warning',
      metaData: {
        TimeRemainingInMsec: lambdaContext.getRemainingTimeInMillis(),
      },
    }));
  }

  function timeoutErrorFunc() {
    log.error('Lambda function timeout warning', {
      time_remaining_in_msec: lambdaContext.getRemainingTimeInMillis(),
    });
    bugsnagClient.notify(new Error('Lambda function timed out'), {
      severity: 'error',
      metaData: {
        TimeRemainingInMsec: lambdaContext.getRemainingTimeInMillis(),
      },
    });
  }

  // By default we schedule warning at half the maximum execution time and
  // the error a few milliseconds before the actual timeout happens.
  timeoutWarning = setTimeout(timeoutWarningFunc, timeRemaining / 2);
  timeoutError = setTimeout(timeoutErrorFunc, Math.max(timeRemaining - 500, 0));
}

function clearTimers() {
  if (timeoutWarning) {
    clearTimeout(timeoutWarning);
    timeoutWarning = null;
  }

  if (timeoutError) {
    clearTimeout(timeoutError);
    timeoutError = null;
  }
}

class BugsnagLambdaWrapper {
  static handler(originalHandler) {
    const bugsnagOptions = {
      apiKey: BUGSNAG.API_KEY,
      appType: 'web_server',
      notifyReleaseStages: [STAGES.PROD, STAGES.DEV],
    };

    if (lambdaUtil.isLocal()) {
      bugsnagOptions.releaseStage = STAGES.TEST;
      log.options.debug = true;
    } else {
      bugsnagOptions.releaseStage = process.env.ENVIRONMENT;
    }

    const bugsnagClient = BugsnagClient.initClient(bugsnagOptions);

    return (event, context, callback) => {
      log.info('Lambda function running', {
        event,
      });
      const promise = originalHandler(event, context, callback);

      bugsnagClient.metaData = {
        event,
        context,
      };

      const identity = lambdaUtil.getIdentity(event, context);

      if (is.not.null(identity)) {
        // Track the caller's Cognito identity
        // id, username and ip_address are key fields in Sentry
        bugsnagClient.user = {
          id: identity.cognitoIdentityId || undefined,
          username: identity.user || undefined,
          ip_address: identity.sourceIp || undefined,
          cognito_identity_pool_id: identity.cognitoIdentityPoolId,
          cognito_authentication_type: identity.cognitoAuthenticationType,
          user_agent: identity.userAgent,
        };
      }

      installTimers(bugsnagClient, context);

      return promise
        .then((...data) => {
          clearTimers();
          return Promise.resolve(...data);
        })
        .catch(async (error) => {
          clearTimers();

          if (!(error instanceof errorUtil.HttpError)) {
            log.error('Unhandled error', {
              error,
            });
          }

          if (!lambdaUtil.isLocal() && !(error instanceof errorUtil.HttpError)) {
            // Wait for bugsnag to send the report before freezing the lambda container
            await promisify(bugsnagClient.notify)(error, {
              severity: 'error',
            });
          }

          const errorResponse = errorUtil.createErrorResponse(error);
          return Promise.resolve(errorResponse);
        });
    };
  }
}

module.exports = BugsnagLambdaWrapper;
