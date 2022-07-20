import { Button, ButtonGroup, Card, Combobox, DatePicker, Form, Icon, Modal, OptionList, Popover, Scrollable, Select, Stack, Tag, TextField, TextStyle } from '@shopify/polaris'
import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import {
    SearchMinor, FilterMajor, CalendarMinor,
    SortMinor, ColumnWithTextMajor, AddNoteMajor,
    MobileHorizontalDotsMajor, MobileCancelMajor, DeleteMinor, FavoriteMajor, SearchMajor,
    SortAscendingMajor, SortDescendingMajor
} from '@shopify/polaris-icons';
import { FILTERCONFIG } from '../../utils/constatValues';
import { DataContext } from '../../contexts/DataContext';
import { createObjectCopy } from '../../utils/helper';


const SearchBar = (props) => {

    const { orderFilter, setOrderFilter, selectedColumn, setSelectedColumn, getOrderList, orderResponse } = useContext(DataContext);

    const [value, setValue] = useState('');
    const [textFiledvalue, setTextFiledValue] = useState('');

    // * Table data regex
    const handleChange = useCallback((value) => {
        setValue(value);
        let onTableSearchText = new RegExp(value);
        let result = orderResponse.filter(function (el) {
            return onTableSearchText.test(el.name);
        });
        if (result.length) {
            for (const [key, value] of Object.entries(result[0])) {
                let keyStr = ''
                // console.log('value', value);
                if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                    for (const [key_, value_] of Object.entries(value)) {
                        keyStr = (key + '.' + key_);
                        // console.log('value', value);
                        if (typeof value_ === 'object' && !Array.isArray(value_) && value_ !== null) {
                            for (const [key__, value__] of Object.entries(value_)) {
                                console.log(keyStr + '.' + key__);
                                // console.log(keyStr);
                            }
                        } else {
                            console.log(keyStr);
                        }

                    }
                } else {
                    console.log(key);
                }
            }
        }
        console.log(result);
    }, []);


    const handleSubmit = useCallback((_event) => {
        console.log('Form Submmited');
    }, []);


    const [durationPopover, setDurationPopover] = useState(false);
    const [filterPopoverActive, setFilterPopoverActive] = useState(false);
    const [filterByKeyPopover, setFilterByKeyPopover] = useState([false]);
    const [filterByValuesPopover, setFilterByValuesPopover] = useState([false]);
    const [showColumnsPopover, setShowColumnsPopover] = useState(false);
    const [showSortPopover, setshowSortPopover] = useState(false);
    const [columnOptions, setColumnOptions] = useState([]);

    const [activateSaveModal, setActivateSaveModal] = useState(false);

    // *DURATION popup activate/deactivate toggle
    const toggleDurationPopover = () => {
        setDurationPopover((durationPopover) => !durationPopover);

        // * closing filter popover
        closeFilterPopoverExplectly(durationPopover);
    }

    // *FILTERS popup activate/deactivate toggle
    const toggleMainFilterPopover = () => {
        setFilterPopoverActive((filterPopoverActive) => !filterPopoverActive);
    }

    // *COLUMNS popup activate/deactivate toggle. Column options are made dinamically here
    const toggleColumnsPopover = () => {
        if (!columnOptions.length) {
            let column_options = [];
            Object.entries(FILTERCONFIG.column).forEach(([key, value]) => {
                column_options.push({ label: value.label, value: key, disabled: (value.disabled || false) })
            });
            setColumnOptions(column_options);
            console.log(column_options);
        }
        setShowColumnsPopover((showColumnsPopover) => !showColumnsPopover);

        // * closing filter popover
        closeFilterPopoverExplectly(showColumnsPopover);
    }

    // *SORT popup activate/deactivate toggle
    const toggleSortingPopover = () => {
        setshowSortPopover((showSortPopover) => !showSortPopover);

        // * closing filter popover
        closeFilterPopoverExplectly(showSortPopover);
    }

    // *Closing Filter Popover independent other popup active state
    const closeFilterPopoverExplectly = (currenAcivePopuverState) => {
        // * closing filter popover
        if (filterPopoverActive && !currenAcivePopuverState) {
            setFilterPopoverActive(false);
        }
    }

    // *FILTER nested popover activate/deactivate toggle
    // TODO simplify this code
    const toggleFilterByKeyPopover = (index) => {
        let popoverObjectTemp = [...filterByKeyPopover];
        if (popoverObjectTemp[index]) {
            popoverObjectTemp[index] = false;
            setFilterByKeyPopover(popoverObjectTemp)
        }
        else {
            popoverObjectTemp[index] = true;
            setFilterByKeyPopover(popoverObjectTemp)
        }
    }
    const toggleFilterByValuePopover = (index) => {
        let popoverObjectTemp = [...filterByValuesPopover];
        if (popoverObjectTemp[index]) {
            popoverObjectTemp[index] = false;
            setFilterByValuesPopover(popoverObjectTemp)
        }
        else {
            popoverObjectTemp[index] = true;
            setFilterByValuesPopover(popoverObjectTemp)
        }
    }

    const preventParentPopoverDismiss = () => { /**On close is required in a popover. 
Calling an empty state to prevent closing of parent popover when there is a selection in child popover */}

    const onChangeFilterKeyHandler = (value, index) => {
        let currentFilterCopy = createObjectCopy(orderFilter)
        if (currentFilterCopy.filters.fqlFilters[index]["key"] != value[0]) {
            currentFilterCopy.filters.fqlFilters[index]["values"] = []
        }
        currentFilterCopy.filters.fqlFilters[index]["key"] = value[0];
        setOrderFilter(currentFilterCopy);
        toggleFilterByKeyPopover(index);
    }

    const onChangeFilterValueHandler = (value, index) => {
        let currentFilterCopy = createObjectCopy(orderFilter)
        currentFilterCopy.filters.fqlFilters[index].values = value
        setOrderFilter(currentFilterCopy);
        toggleFilterByValuePopover(index);
    }

    const setVisibleColumns = (columns) => {
        selectedColumn = []
        columns.forEach(column => {
            selectedColumn.push(column)
        });
        setSelectedColumn(selectedColumn);
    }

    const onChangeShowColumnsHandler = ((value, index) => {
        let currentFilterCopy = createObjectCopy(orderFilter)
        currentFilterCopy.filters.columns = value;
        setVisibleColumns(currentFilterCopy.filters.columns)
        setOrderFilter(currentFilterCopy);
        getOrderList(currentFilterCopy);
    })

    const onChangeShowSortHandler = ((value, index) => {
        let currentFilterCopy = createObjectCopy(orderFilter)
        currentFilterCopy.filters.sort.key = value[0];
        setOrderFilter(currentFilterCopy);
        toggleSortingPopover()
    })

    const onDeleteFilterHandler = (index) => {
        if (orderFilter.filters.fqlFilters.length > 1) {
            deleteFilter(index, 1)
        }
    }

    useEffect(() => {
        if (orderFilter.filters.fqlFilters.length == 0) {
            addfilter();
        }
        if (orderFilter.filters.columns.length > 0) {
            // console.log(orderFilter.filters.columns)
            setVisibleColumns(orderFilter.filters.columns)
        }
    }, [orderFilter]);

    const removeTag = useCallback((index) => () => {
        deleteFilter(index, 1)
        setFilterPopoverActive(false)
    });

    const addfilter = () => {
        let currentFilterCopy = createObjectCopy(orderFilter)
        currentFilterCopy.filters.fqlFilters.push({
            key: "",
            values: [],
            condition: "equal"
        })
        setOrderFilter(currentFilterCopy);
    }

    const deleteFilter = (index, deleteCount) => {
        let currentFilterCopy = createObjectCopy(orderFilter)
        currentFilterCopy.filters.fqlFilters.splice(index, deleteCount);
        setOrderFilter(currentFilterCopy);
    }

    const getFilterKeys = () => {
        let values = []
        let selectedFilters = [];
        orderFilter.filters.fqlFilters.forEach(filter => {
            selectedFilters.push(filter.key)
        });
        for (const [key, value] of Object.entries(FILTERCONFIG.filters)) {
            if (!selectedFilters.includes(key)) {
                values.push({ "label": value.label, "value": key });
            }
        }
        return values
    }

    const setDurationFilter = (duration) => {
        let currentFilterCopy = createObjectCopy(orderFilter)
        currentFilterCopy.filters.duration = duration[0]
        setOrderFilter(currentFilterCopy);
        toggleDurationPopover()
        getDurationLabel()

    }
    const regexFilterValueHandler = (value, index) => {
        setTextFiledValue(value);
        let currentFilterCopy = createObjectCopy(orderFilter)
        currentFilterCopy.filters.fqlFilters[index].values['$regex'] = textFiledvalue;
        console.log(currentFilterCopy);
        setOrderFilter(currentFilterCopy);
    }

    const getDurationLabel = () => {
        let filtered = FILTERCONFIG.durationValues.filter(durationType => durationType.value === orderFilter.filters.duration)[0];
        return filtered?.label || "Duration"
    }

    let tagMarkup = orderFilter.filters.fqlFilters.map((filter, index) => (
        <div key={index} style={{ paddingTop: 10 }}>
            {
                filter.values.length > 0
                &&
                <Tag key={filter} onRemove={removeTag(index)} >
                    {filter.values.join(",")}
                </Tag>
            }

        </div>
    ));
    let durationTag = (orderFilter.filters.dateRange &&
        <div style={{ paddingTop: 10 }}>
            {
                <Tag >
                    {"Order date: "
                        + ((new Date(orderFilter.filters.dateRange.start)).toDateString())
                        + "-"
                        + (new Date(orderFilter.filters.dateRange.end)).toDateString()}
                </Tag>
            }

        </div>
    )

    return (<Fragment>
        <div style={{ padding: 15 }}>
            <Form onSubmit={handleSubmit}>
                <Stack alignment="center" distribution="center" style={{ paddingTop: 20 }}>
                    <Stack.Item fill>
                        <TextField
                            placeholder="Search"
                            prefix={<Icon source={SearchMinor} />}
                            value={value}
                            onChange={handleChange}
                            // pattern={(value == 'order_id') && "[0-9]+"}
                            selectTextOnFocus
                            clearButton
                            onClearButtonClick={() => setValue('')}
                            connectedRight={
                                <ButtonGroup segmented>
                                    {/* <DURATION POPUP> */}
                                    <Popover
                                        active={durationPopover}
                                        activator={
                                            <Button icon={CalendarMinor} onClick={toggleDurationPopover}>
                                                {getDurationLabel()}
                                            </Button>}
                                        onClose={toggleDurationPopover}
                                    >
                                        <OptionList
                                            title="Duration Filter"
                                            onChange={setDurationFilter}
                                            options={FILTERCONFIG.durationValues}
                                            selected={orderFilter.filters.duration}
                                        />
                                        <div style={{ padding: '0px 10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5 }}>
                                            <div onClick={(e) => e.stopPropagation()}><RangeDatePicker /></div>
                                            <div style={{ paddingInline: 20 }}><Button plain >Clear</Button></div>
                                        </div>
                                    </Popover>

                                    {/* <FITERE NESTED POPUP> */}
                                    <Popover
                                        active={filterPopoverActive}
                                        activator={<Button icon={FilterMajor} onClick={toggleMainFilterPopover}>Filter</Button>}
                                        onClose={preventParentPopoverDismiss}
                                        fullHeight={true}
                                    >
                                        <div style={{ padding: 15, marginBottom: 0, paddingBottom: 0, display: "flex", justifyContent: "space-between" }}>
                                            <TextStyle variation="subdued"> Filter by </TextStyle>
                                            <div onClick={toggleMainFilterPopover} style={{ cursor: 'pointer' }}>
                                                <Icon source={MobileCancelMajor} color="base" />
                                            </div>
                                        </div>

                                        {orderFilter.filters.fqlFilters.map((filter, index) => {
                                            return (
                                                <ButtonGroup key={index} fullWidth={true}>
                                                    <div style={{ minWidth: 'fit-content', overflow: "hidden" }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0fr', alignItems: 'center', paddingBlock: 10, paddingInline: 15, gap: 15 }}>
                                                            <Popover
                                                                zIndexOverride={5000}
                                                                active={filterByKeyPopover[index]}
                                                                activator={
                                                                    <Button
                                                                        disabled={Number(filter.values.length) >= 0 || filter.values instanceof Object ? false : true}
                                                                        disclosure
                                                                        onClick={() => { toggleFilterByKeyPopover(index); }}
                                                                    >
                                                                        {filter.key != '' ? filter.key : "Select filter"}
                                                                    </Button>
                                                                }
                                                                onClose={() => { toggleFilterByKeyPopover(index) }}
                                                                fullWidth={true}
                                                            >
                                                                <OptionList
                                                                    onChange={(value) => { onChangeFilterKeyHandler(value, index) }}
                                                                    options={getFilterKeys()}
                                                                    selected={filter.key}
                                                                />
                                                            </Popover>
                                                            {filter.key && FILTERCONFIG.filters[filter.key].fieldType == "select" ? <Popover
                                                                zIndexOverride={5000}
                                                                active={filterByValuesPopover[index]}
                                                                activator={(
                                                                    <Button onClick={() => { toggleFilterByValuePopover(index) }}
                                                                        disabled={filter.key == '' ? true : false}
                                                                        disclosure>
                                                                        <span style={{ display: 'inline-block', width: 100, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                            {filter?.values != '' ? filter?.values.join(",") : "Select value"}
                                                                        </span>
                                                                    </Button>
                                                                )}
                                                                onClose={() => { toggleFilterByValuePopover(index) }}
                                                                fullWidth={true}
                                                            >
                                                                <OptionList
                                                                    title={"Filter Values"}
                                                                    onChange={(value) => { onChangeFilterValueHandler(value, index) }}
                                                                    options={filter.key && FILTERCONFIG.filters[filter.key].values}
                                                                    selected={filter.values}
                                                                    allowMultiple={filter.key && FILTERCONFIG.filters[filter.key].allowMultiple}
                                                                />
                                                                <div style={{ paddingInline: 20 }}>
                                                                    <Button plain >Clear</Button>
                                                                </div>
                                                            </Popover> : <TextField
                                                                value={textFiledvalue}
                                                                onChange={(value) => regexFilterValueHandler(value, index)}
                                                                autoComplete="off"
                                                            />}
                                                            <Button
                                                                disabled={orderFilter.filters.fqlFilters.length == 1}
                                                                icon={DeleteMinor}
                                                                onClick={() => onDeleteFilterHandler(index)} />
                                                        </div>
                                                    </div>
                                                </ButtonGroup>
                                            )
                                        })}
                                        {
                                            <div style={{ padding: "10px 20px 10px 20px", borderTop: "1px solid lightgray" }}>
                                                <Button icon={AddNoteMajor}
                                                    onClick={() => {
                                                        addfilter();
                                                        setFilterByKeyPopover([...filterByKeyPopover, false])
                                                    }}
                                                    disabled={Object.keys(FILTERCONFIG.filters).length == orderFilter.filters.fqlFilters.length}
                                                    outline
                                                >
                                                    Add Filter
                                                </Button>
                                            </div>
                                        }
                                    </Popover>

                                    {/* <COLUMNS POPUP> */}
                                    <Popover
                                        active={showColumnsPopover}
                                        activator={
                                            <Button icon={ColumnWithTextMajor}
                                                onClick={toggleColumnsPopover}>
                                                Columns
                                            </Button>
                                        }
                                        onClose={toggleColumnsPopover}
                                        fullHeight={true}
                                    >
                                        <OptionList
                                            title="Select Columns"
                                            onChange={onChangeShowColumnsHandler}
                                            options={columnOptions}
                                            selected={orderFilter.filters.columns}
                                            allowMultiple
                                        />
                                    </Popover>

                                    {/* <SORT POPUP> */}
                                    <Popover
                                        active={showSortPopover}
                                        activator={
                                            <Button icon={SortMinor}
                                                onClick={toggleSortingPopover}>
                                                Sort
                                            </Button>
                                        }
                                        onClose={toggleSortingPopover}
                                        fullHeight={true}
                                    >
                                        <div style={{ height: '32vh' }}>
                                            <Scrollable shadow style={{ height: '200px' }}>
                                                <OptionList
                                                    title="Sort By"
                                                    onChange={onChangeShowSortHandler}
                                                    options={FILTERCONFIG.sortBy}
                                                    selected={orderFilter.filters.sort.key} />
                                            </Scrollable>
                                            <div style={{ padding: '15px 10px 0px 10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5 }}>
                                                <SortOrder />
                                            </div>
                                        </div>
                                    </Popover>
                                </ButtonGroup>
                            }
                        />
                    </Stack.Item>
                    <Stack.Item>
                        <Button submit icon={SearchMajor} onClick={() => { getOrderList(); closeFilterPopoverExplectly(false) }} primary>
                            Search
                        </Button>
                        {/* <Button
                            connectedDisclosure={{
                                accessibilityLabel: 'Other save actions',
                                actions: [{ content: 'Save as draft' }],
                            }}>
                            Save
                        </Button> */}
                    </Stack.Item>
                    <Stack.Item>
                        <Button onClick={() => setActivateSaveModal(true)} icon={FavoriteMajor}></Button>
                    </Stack.Item>
                </Stack>
                {<Stack spacing="tight">{tagMarkup}{orderFilter.filters.duration == 'z' && durationTag}</Stack>}
            </Form>
        </div>
        {activateSaveModal && <ViewSaveModal activateSaveModal={activateSaveModal} setActivateSaveModal={setActivateSaveModal} setAllFilters={props.setAllFilters} />}
    </Fragment>)

}

export default SearchBar


// * Duration Range Calender Picker Component
export function RangeDatePicker() {
    const { orderFilter, setOrderFilter } = useContext(DataContext);

    const [popoverActive, setPopoverActive] = useState(false);

    const togglePopoverActive = useCallback(
        (e) => setPopoverActive((popoverActive) => !popoverActive),
        []);

    const [{ month, year }, setDate] = useState({ month: (new Date().getMonth()), year: (new Date().getFullYear()) });
    const [selectedDates, setSelectedDates] = useState({
        start: new Date(),
        end: new Date(),
    });

    const handleMonthChange = useCallback(
        (month, year) => setDate({ month, year }),
        [],
    );

    const activator = (
        <Button onClick={togglePopoverActive} disclosure>
            Date range
        </Button>
    );

    const submitCustomDate = () => {
        let date_range = { start: selectedDates.start.getTime(), end: selectedDates.end.getTime() };
        // console.log('selectedDates', date_range)
        let currentFilterCopy = createObjectCopy(orderFilter);
        currentFilterCopy.filters.duration = 'z';
        currentFilterCopy.filters.dateRange = date_range;
        // console.log('currentFilterCopy', currentFilterCopy)
        setOrderFilter(currentFilterCopy);
        setPopoverActive(false);
    }
    // useEffect(() => {
    //     setSelectedDates({
    //         start: new Date(orderFilter.filters?.dateRange.start),
    //         end: new Date(orderFilter.filters?.dateRange.end),
    //     })
    // },[])

    return (
        <Popover
            active={popoverActive}
            activator={activator}
            autofocusTarget="first-node"
            onClose={() => { togglePopoverActive }}
            fullHeight
            zIndexOverride={512}
        >
            <Card sectioned
                // actions={[{ content: 'Set', onAction: () => console.log('selectedDates', selectedDates) }, { content: 'Close', onAction: () => setPopoverActive(false) }]}
                primaryFooterAction={{ content: 'Done', onAction: submitCustomDate }}
                secondaryFooterActions={[{ content: 'Close', onAction: () => setPopoverActive(false) }]}
            >
                <DatePicker
                    month={month}
                    year={year}
                    onChange={setSelectedDates}
                    onMonthChange={handleMonthChange}
                    selected={selectedDates}
                    multiMonth
                    allowRange
                    disableDatesAfter={new Date()}
                /></Card>
        </Popover>
    );
}


// * Assending and deassendig sort button component
function SortOrder() {
    const { orderFilter, setOrderFilter } = useContext(DataContext);
    const [isAscending, setIsAscending] = useState(true);

    const handleAscendingButtonClick = useCallback(() => {
        let currentFilterCopy = createObjectCopy(orderFilter);
        currentFilterCopy.filters.sort.direction = -1;
        setOrderFilter(currentFilterCopy);
        if (isAscending) return;
        setIsAscending(true);
    }, [isAscending]);

    const handleDescendingButtonClick = useCallback(() => {
        let currentFilterCopy = createObjectCopy(orderFilter);
        currentFilterCopy.filters.sort.direction = 1;
        setOrderFilter(currentFilterCopy);
        if (!isAscending) return;
        setIsAscending(false);
    }, [isAscending]);

    return (
        <Fragment >
            <Button icon={SortAscendingMajor} size="slim" plain pressed={isAscending} onClick={handleAscendingButtonClick}>
                Ascending
            </Button>
            <Button icon={SortDescendingMajor} size="slim" plain pressed={!isAscending} onClick={handleDescendingButtonClick}>
                Descending
            </Button>
        </Fragment>
    );
}


// * View Save Modal
function ViewSaveModal(props) {
    const [viewName, setViewName] = useState();

    const handleViewSave = () => {
        props.setAllFilters((prevState) => [...prevState, {
            id: Math.floor(1000 + Math.random() * 9000),
            content: viewName,
        }]);
        props.setActivateSaveModal(false);
    }

    return (
        <Modal
            open={props.activateSaveModal}
            onClose={() => props.setActivateSaveModal(false)}
            title="Save as new view"
            primaryAction={{
                content: 'Save',
                onAction: handleViewSave,
                disabled: viewName ? false : true
            }}
            secondaryActions={[{
                content: 'Cancel',
                onAction: () => props.setActivateSaveModal(false),
            }]}
        >
            <Modal.Section>
                <TextField
                    label="View name"
                    value={viewName}
                    onChange={(value) => { setViewName(value) }}
                    autoComplete="off"
                    helpText="New views will be saved as tabs at the top of this page."
                />

            </Modal.Section>
        </Modal>
    );
}
