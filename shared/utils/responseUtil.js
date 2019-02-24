/**
 * Helper functions to create API response.
 */

/**
 * Create an API response body.
 *
 * @param {number} statusCode
 * @param {object} body
 */
function createResponse(body, statusCode) {
  return {
    statusCode: statusCode || 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // required for CORS support to work
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Auth',
    },
    body: JSON.stringify(body || {}),
  };
}

module.exports = {
  createResponse,
};
