module.exports = Object.freeze({
  STAGES: {
    PROD: 'prod',
    DEV: 'dev',
    TEST: 'test',
  },
  HTTP_ERROR_MESSAGES: {
    INTERNAL_ERROR: 'Something bad has happened',
    INVALID_FIELD: 'Invalid fields',
  },
  HTTP_STATUS_CODES: {
    // 4XX
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    // 5XX
    INTERNAL_SERVER_ERROR: 500,
  },
  HTTP_ERROR_TYPE: {
    INTERNAL_ERROR: 'internal_server_error',
    INVALID_FIELD: 'invalid_fields',
  },
});
