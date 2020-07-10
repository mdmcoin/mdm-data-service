const { curryN } = require('ramda');

const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

const byOrderSender = curryN(2, (orderSender, q) =>
  q
    .clone()
    .whereRaw(
      `array[t.order1_sender_uid, t.order2_sender_uid] @> array[(select uid from addresses where address = '${orderSender}' limit 1)]`
    )
);

const byOrder = curryN(2, (orderId, q) =>
  q
    .whereRaw(`array[o1.order->>'id', o2.order->>'id'] @> array['${orderId}']`)
    .limit(1)
);

const byAsset = (assetType) =>
  curryN(2, (assetId, q) =>
    assetId === 'WAVES'
      ? q.whereNull(`t.${assetType}_asset_uid`)
      : q.where(`t.${assetType}_asset_uid`, function () {
        this.select('uid')
          .from('assets_data')
          .where('asset_id', assetId)
          .limit(1);
      })
  );

module.exports = {
  filters: {
    ...commonFilters,
    
    timeStart: commonFilters.timeStart(7),
    timeEnd: commonFilters.timeEnd(7),
    matcher: commonFilters.sender,
    sender: byOrderSender,
    amountAsset: byAsset('amount'),
    priceAsset: byAsset('price'),
    orderId: byOrder,
  },
  filtersOrder: [
    ...commonFiltersOrder,
    'matcher',
    'amountAsset',
    'priceAsset',
    'orderId',
  ],
};
