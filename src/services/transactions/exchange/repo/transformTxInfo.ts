import { pick, compose } from 'ramda';
import { renameKeys } from 'ramda-adjunct';
import { BigNumber } from '@waves/data-entities';

import { transformTxInfo } from '../../_common/transformTxInfo';

import { ExchangeTx, ExchangeTxDbResponse } from './types';

const createOrder = (prefix: string) => <T extends Record<string, any>>({
  [`${prefix}_id`]: id,
  [`${prefix}_version`]: version,
  [`${prefix}_sender_public_key`]: senderPublicKey,
  [`${prefix}_sender`]: sender,
  [`${prefix}_type`]: orderType,
  [`${prefix}_price`]: price,
  [`${prefix}_amount`]: amount,
  [`${prefix}_time_stamp`]: timestamp,
  [`${prefix}_expiration`]: expiration,
  [`${prefix}_signature`]: signature,
  [`${prefix}_matcher_fee`]: matcherFee,
  [`${prefix}_matcher_fee_asset_id`]: matcherFeeAssetId,
  price_asset: priceAsset,
  amount_asset: amountAsset,
  sender_public_key: matcherPublicKey,
}: T) => {
  const tx = {
    id,
    senderPublicKey,
    matcherPublicKey,
    assetPair: {
      amountAsset,
      priceAsset,
    },
    orderType,
    price,
    sender,
    amount,
    timestamp,
    expiration,
    matcherFee,
    signature,
  };
  return version === '3' ? { ...tx, matcherFeeAssetId } : tx;
};

type ExchangeTxFields = {
  buyMatcherFee: BigNumber;
  sellMatcherFee: BigNumber;
  amount: BigNumber;
  price: BigNumber;
};

/** transformTx:: RawTxInfo -> TxInfo */
export default (tx: ExchangeTxDbResponse): ExchangeTx => {
  const commonFields = compose(
    transformTxInfo,
    pick([
      'id',
      'time_stamp',
      'height',
      'tx_type',
      'tx_version',
      'signature',
      'proofs',
      'fee',
      'status',
      'sender',
      'sender_public_key',
    ])
  )(tx);

  const exchangeTxFields = compose(
    renameKeys<ExchangeTxFields>({
      buy_matcher_fee: 'buyMatcherFee',
      sell_matcher_fee: 'sellMatcherFee',
    }),
    pick(['buy_matcher_fee', 'sell_matcher_fee', 'price', 'amount'])
  )(tx);

  return {
    ...commonFields,
    ...exchangeTxFields,
    order1: createOrder('o1')(tx),
    order2: createOrder('o2')(tx),
  };
};
