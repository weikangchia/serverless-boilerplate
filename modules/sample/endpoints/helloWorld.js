const handlerWrapper = require('../../../shared/utils/handlerWrapper');
const responseUtil = require('../../../shared/utils/responseUtil');

module.exports.handler = handlerWrapper(async (event) => {
  const response = responseUtil.createResponse({
    data: 'hello world',
  });

  return response;
});
