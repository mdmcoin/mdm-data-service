const commonFilters = require('../../../_common/sql/filters');
const commonFiltersOrder = require('../../../_common/sql/filtersOrder');

module.exports = {
  filters: {
    ...commonFilters,

    timeStart: commonFilters.timeStart(8),
    timeEnd: commonFilters.timeEnd(8),
  },
  filtersOrder: [...commonFiltersOrder, 'recipient'],
};
