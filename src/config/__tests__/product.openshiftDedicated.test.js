import { config } from '../product.openshiftDedicated';
import { parseRowCellsListData } from '../../components/inventoryList/inventoryListHelpers';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../types/rhsmApiTypes';

describe('Product OpenShift Dedicated config', () => {
  it('should apply graph configuration', () => {
    const { initialGraphSettings } = config;

    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        data: {
          coreHours: [
            {
              y: 0
            },
            {
              y: 400
            },
            {
              y: 100
            }
          ]
        },
        meta: {
          totalCoreHours: 500
        }
      })
    }).toMatchSnapshot('product action display should display a total value below 1000');

    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        data: {
          coreHours: [
            {
              y: 0
            },
            {
              y: 800000
            },
            {
              y: 100000
            }
          ]
        },
        meta: {
          totalCoreHours: 900000
        }
      })
    }).toMatchSnapshot('product action display should display a total value below 1000000');

    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        data: {
          coreHours: [
            {
              y: 0
            },
            {
              y: 1000
            },
            {
              y: 100
            }
          ]
        },
        meta: {
          totalCoreHours: 1100
        }
      })
    }).toMatchSnapshot('product action display should display a total value');

    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        data: {
          loremIpsum: [
            {
              y: 0
            },
            {
              y: 1000
            },
            {
              y: 100
            }
          ]
        },
        meta: {
          totalCoreHours: undefined
        }
      })
    }).toMatchSnapshot('product action display should NOT display a total value');
  });

  it('should apply hosts inventory configuration', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery } = config;

    const inventoryData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      coreHours: 12.53,
      instanceHours: 20.04,
      lastSeen: 'lorem date obj',
      loremIpsum: 'hello world'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const fallbackInventoryData = {
      ...inventoryData,
      coreHours: null,
      instanceHours: null,
      inventoryId: null,
      lastSeen: null
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

    expect(inventoryQuery[RHSM_API_QUERY_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });
});
