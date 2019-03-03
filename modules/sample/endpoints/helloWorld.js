const log = require('lambda-log');

const handlerWrapper = require('../../../shared/utils/handlerWrapper');
const responseUtil = require('../../../shared/utils/responseUtil');

module.exports.handler = handlerWrapper(async (event) => {
  log.info(${process.env.ENVIRONMENT});
  const response = responseUtil.createResponse({
    data: 'hello world',
  });

  return response;
});
