const { DEFAULT_NOT_FOUND_MESSAGE } = require('../../errorHandling');
const { captureErrors } = require('../../utils/captureErrors');
const { handleError } = require('../../utils/handleError');
const { select } = require('../utils/selectors');

const createGetMiddleware = (url, service) => {
  const handleError = ({ ctx, error }) => {
    ctx.eventBus.emit('ERROR', error);
    error.matchWith({
      Db: () => {
        ctx.status = 500;
        ctx.body = 'Database Error';
      },
      Resolver: () => {
        ctx.status = 500;
        ctx.body = `Error resolving ${url}/:id`;
      },
      Validation: () => {
        ctx.status = 400;
        ctx.body = `Invalid query, check params, got: ${ctx.querystring}`;
      },
    });
  };

  return captureErrors(handleError)(async ctx => {
    if (!service.get) {
      ctx.status = 404;
      ctx.body = {
        message: DEFAULT_NOT_FOUND_MESSAGE,
      };
      return;
    }

    const { id } = select(ctx);

    ctx.eventBus.emit('ENDPOINT_HIT', {
      url: ctx.originalUrl,
      resolver: `${url}/:id`,
      id,
    });

    const x = await service
      .get(id)
      .run()
      .promise();

    ctx.eventBus.emit('ENDPOINT_RESOLVED', {
      value: x,
    });

    x.matchWith({
      Just: ({ value }) => (ctx.state.returnValue = value),
      Nothing: () => {
        ctx.status = 404;
        ctx.body = {
          message: DEFAULT_NOT_FOUND_MESSAGE,
        };
      },
    });
  });
};

module.exports = createGetMiddleware;
