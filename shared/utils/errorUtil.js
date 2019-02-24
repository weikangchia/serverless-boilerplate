/**
 * Helper functions for errors and error code.
 */
const responseUtil = require('./responseUtil');
const {
  HTTP_STATUS_CODES,
  HTTP_ERROR_MESSAGES,
  HTTP_ERROR_TYPE,
} = require('../constants');

class HttpError extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.type = type;
  }
}

class BadRequestError extends HttpError {
  constructor(message, errorType) {
    super(message, errorType);
    this.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
  }
}

class InternalServerError extends HttpError {
  constructor() {
    super(HTTP_ERROR_MESSAGES.INTERNAL_ERROR, HTTP_ERROR_TYPE.INTERNAL_ERROR);
    this.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }
}

/**
 * Create error response.
 *
 * @param {object} error
 *
 * @public
 */
function createErrorResponse(error) {
  if (error instanceof HttpError) {
    const errorResponseBody = {
      type: error.type,
      message: error.message,
    };
    return responseUtil.createResponse(errorResponseBody, error.statusCode);
  }

  const errorResponseBody = {
    type: HTTP_ERROR_TYPE.INTERNAL_ERROR,
    message: HTTP_ERROR_MESSAGES.INTERNAL_ERROR,
  };
  return responseUtil.createResponse(errorResponseBody, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
}

module.exports = {
  createErrorResponse,
  HttpError,
  BadRequestError,
  InternalServerError,
};
