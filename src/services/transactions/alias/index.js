const { propEq } = require('ramda');

const { Transaction } = require('../../../types');

const getByIdPreset = require('../../presets/pg/getById');
const mgetByIdsPreset = require('../../presets/pg/mgetByIds');
const searchWithPaginationPreset = require('../../presets/pg/searchWithPagination');

const transformTxInfo = require('../_common/transformTxInfo');

const sql = require('./sql');

const {
  result: resultSchema,
  inputSearch: inputSearchSchema,
} = require('./schema');

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'transactions.alias.get',
      sql: sql.get,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset({
      name: 'transactions.alias.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      resultTypeFactory: Transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset({
      name: 'transactions.alias.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),
  };
};
