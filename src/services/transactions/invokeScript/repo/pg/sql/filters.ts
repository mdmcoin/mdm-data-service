import * as knex from 'knex';
import * as pointFreeKnex from '../../../../../../utils/db/knex';

import * as commonFilters from '../../../../_common/sql/filters';

const byDapp = (dappAddress: string) =>
  pointFreeKnex.where('dapp_address_uid', function(this: knex.QueryBuilder) {
    this.select('uid')
      .from('addresses')
      .where('address', dappAddress)
      .limit(1);
  });

export default {
  ...commonFilters,
  
  timeStart: commonFilters.timeStart(16),
  timeEnd: commonFilters.timeEnd(16),
  dapp: byDapp,
  function: pointFreeKnex.where('function_name'),
};
