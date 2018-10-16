const Joi = require('../../../utils/validation/joi');

const commonFields = require('../_common/commonFieldsSchemas');

const result = Joi.object().keys({
  ...commonFields,

  asset_id: Joi.string()
    .base58()
    .required(),
  amount: Joi.object()
    .bignumber()
    .required(),
});

module.exports = {
  result,
  inputSearch: require('../../presets/pg/searchWithPagination/commonFilterSchemas'),
};
