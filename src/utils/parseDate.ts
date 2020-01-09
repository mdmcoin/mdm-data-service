import { Error as error, Ok as ok } from 'folktale/result';
import { ParseError } from '../errorHandling';
import { Parser } from '../http/_common/filters/types';
import { isNil } from 'ramda';

export type ParseDate = Parser<Date | undefined>;

export const parseDate: ParseDate = str => {
  if (isNil(str)) return ok(undefined);

  const d = new Date(/^-?\d+$/.test(str) ? parseInt(str) : str);
  return isNaN(d.getTime())
    ? error(new ParseError('Date is not valid'))
    : ok(d);
};
