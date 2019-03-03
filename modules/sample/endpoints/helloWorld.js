const log = require('lambda-log');

const handlerWrapper = require('../../../shared/utils/handlerWrapper');
const responseUtil = require('../../../shared/utils/responseUtil');

module.exports.handler = handlerWrapper(async (event) => {
  console.log(process.env);
  const response = responseUtil.createResponse({
    data: 'hello world',
  });

  return response;
});
