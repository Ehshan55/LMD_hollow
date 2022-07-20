import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useIndexResourceState, Card, IndexTable, Tabs, EmptySearchResult } from '@shopify/polaris';
import SearchBar from './searchBar';
import { FILTERCONFIG } from '../../utils/constatValues';
import { DataContext } from '../../contexts/DataContext';

import _ from 'lodash';
// import shortid from 'shortid';
import ComponentLoader from './row_components/componentLoader';
import OrderPagination from './orderPagination';
import extract_idFromArrObj from '../../utils/extract_idFromArrObj';

export default function OrdersTable() {
    const { selectedColumn, getOrderList, orderResponse, setSelectedOrdersIds } = useContext(DataContext);
    const [loading, setLoading] = useState(false);
    const [tableHeading, setTableHeading] = useState([]);
    const [rowItem, setRowitem] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [selected_filter_of, setSelected_filter_of] = useState([]);
    const [tableCellPopup, setTableCellPopup] = useState([false]);

    const promotedBulkActions = [
        {
            content: 'Create Route',
            onAction: () => console.log('Todo: implement bulk edit'),
        },
    ];
    const bulkActions = [
        {
            content: 'Assign To',
            onAction: () => console.log('Todo: implement bulk add tags'),
        },
        {
            content: 'Add tags',
            onAction: () => console.log('Todo: implement bulk remove tags'),
        }
    ];


    const [allFilters, setAllFilters] = useState([
        {
            id: '100000',
            content: 'All',
            accessibilityLabel: 'All',
            panelID: 'all-orders',
        },
        {
            id: '100001',
            content: 'Unfulfilled',
            panelID: 'unfulfilled',
        },
        {
            id: '100002',
            content: 'Open',
            panelID: 'open',
        },
        {
            id: '100003',
            content: 'Closed',
            panelID: 'closed',
        },
    ]);

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelectedFilter(selectedTabIndex),
        [],
    );

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No Order Yet'}
            description={'Try changing the filters or search term'}
            withIllustration
        />
    );

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    const resourceIDResolver = (orderResponse) => {
        return orderResponse._id;
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(orderResponse, { resourceIDResolver });


    const handleSelectedFilterOfRemove = useCallback(() => setSelected_filter_of([]), []);

    const appliedFilters = [];
    if (!isEmpty(selected_filter_of)) {
        const key = 'filterBy';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, (selected_filter_of)),
            onRemove: handleSelectedFilterOfRemove,
        });
    }

    useEffect(() => {
        getOrderList();
    }, []);

    useEffect(() => {
        setSelectedOrdersIds(selectedResources);
    }, [selectedResources]);


    useEffect(() => {
        if (allFilters[selectedFilter].id) {
            // orderServiceApi.getOrderFilter(reqData, () => {
            //     console.log(reqData)
            //     //
            // })
        }
    }, [selectedFilter]);

    useEffect(() => {
        if (orderResponse.length) {
            makeTableHeadersAndRows();
            // makeTableRows();
        }
    }, [selectedColumn, orderResponse])


    const makeTableHeadersAndRows = async () => {
        let headings = [];
        let rowObj = [];
        Object.entries(FILTERCONFIG.column).forEach(async ([key, item]) => {
            if (selectedColumn.includes(key)) {
                headings.push({ title: item.label });
                rowObj.push({ display_key: item.display_key, component: item.component || false });
            }
        })
        // console.log(headings);
        setTableHeading(headings);
        setRowitem(rowObj);
    }


    const rowMarkup = orderResponse.map(
        (order, orderIndex) => (
            <IndexTable.Row
                id={order._id}
                key={orderIndex}
                selected={selectedResources.includes(order._id)}
                position={orderIndex}
                // onNavigation={() => console.log(`I'm about to navigate to ${order._id}`)}
                status={order.location ? 'success' : 'subdued'}
            >
                {rowItem.map((row, row_index) => {
                    if (!row.component) {
                        return (<IndexTable.Cell key={row_index}>{_.get(order, row.display_key, '-')}</IndexTable.Cell>)
                    } else {
                        return (<IndexTable.Cell key={row_index}>
                            <div onClick={(e) => e.stopPropagation()}>
                                <ComponentLoader componentName={row.component} order={order} allOrderIds={extract_idFromArrObj(orderResponse)} orderIndex={orderIndex} />
                            </div>
                        </IndexTable.Cell>)
                    }
                })}
            </IndexTable.Row>
        ),
    );




    return (
        <Card>
            <Tabs tabs={allFilters} selected={selectedFilter} onSelect={handleTabChange} disclosureText="More Filters"></Tabs>
            <SearchBar setAllFilters={setAllFilters} />
            {tableHeading.length > 0 && <IndexTable
                resourceName={resourceName}
                itemCount={orderResponse.length}
                selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                }
                emptyState={!orderResponse.length && emptyStateMarkup}
                onSelectionChange={handleSelectionChange}
                hasMoreItems
                loading={loading}
                bulkActions={bulkActions}
                promotedBulkActions={promotedBulkActions}
                headings={tableHeading}
            >
                {rowMarkup}
            </IndexTable>}
            <Card.Section>
                <OrderPagination />
            </Card.Section>
        </Card >
    );

    function disambiguateLabel(key, value) {
        switch (key) {
            case 'filterBy':
                return ` ${value}`;
            case 'sortBy':
                return `Sort by : ${value}`;
            default:
                return value;
        }
    }

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return value === '' || value == null;
        }
    }
}