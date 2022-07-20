import { Button, OptionList, Pagination, Popover, Stack, TextField, TextStyle } from "@shopify/polaris";
import { useCallback, useContext, useEffect, useState } from "react";
import { DataContext } from "../../contexts/DataContext";


const OrderPagination = (props) => {
    const { orderResponse, setPagination, pagination, getOrderList } = useContext(DataContext);;
    const [isPageChange, setIsPageChange] = useState(false)

    const paginationHandler = (changePage) => {
        setPagination((prevState) => ({ ...prevState, page: changePage }));
        setIsPageChange(isPageChange => !isPageChange);
    }


    useEffect(() => {
        getOrderList();
    }, [isPageChange]);

    return (
        <Stack alignment="center" >
            <Stack.Item fill>
                <TextStyle variation="strong"> {pagination.totalCount} orders loaded {pagination?.total_order_count != orderResponse?.length && (" (" + orderResponse.length + " visible due to filters/view)")}</TextStyle><br />
                {/* <TextStyle variation="subdued">Last 60 Days Orders</TextStyle> */}
            </Stack.Item>
            <Stack.Item>
                <OrderView setIsPageChange={setIsPageChange} />
            </Stack.Item>
            <Stack.Item>
                <PaginationPopup setIsPageChange={setIsPageChange} />
            </Stack.Item>
            <Stack.Item>
                <Pagination
                    label={<span>Page  < b > {pagination.page}</b></span>}
                    hasPrevious={pagination?.page != 1}
                    onPrevious={() => {
                        paginationHandler(pagination?.page - 1);
                    }}
                    hasNext={pagination?.page != pagination?.totalPages}
                    onNext={() => {
                        paginationHandler(pagination?.page + 1);
                    }}
                />
            </Stack.Item>
        </Stack >
    )
}

export default OrderPagination

export const PaginationPopup = (props) => {

    const { setPagination, pagination } = useContext(DataContext);
    const [selectedPage, setSelectedPage] = useState([]);
    const [popoverActive, setPopoverActive] = useState(false);
    const [pageOptions, setPageOptions] = useState([]);

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );
    const pageJumpSettingHandller = (selection) => {
        setSelectedPage(selection);
        orderFilterObjSettingHandller(selection[0]);
    }

    const orderFilterObjSettingHandller = value => {
        setPagination((prevState) => ({ ...prevState, page: value }));
        setPopoverActive(false);
        props.setIsPageChange(isPageChange => !isPageChange);
    }

    const setPageJumpOptions = () => {
        let pageOptions = [];
        for (let index = 1; index <= pagination?.totalPages; index++) {
            let optionObj = { value: index, label: 'Page ' + index };
            pageOptions.push(optionObj);
        }
        // console.log('pageOptions', pageOptions)
        setPageOptions(pageOptions);
        setSelectedPage([pagination?.page]);
    }


    useEffect(() => {
        setPageJumpOptions();
        // console.log('pageOptions', pagination)
    }, [pagination])

    return (
        <Popover
            active={popoverActive}
            activator={<Button onClick={togglePopoverActive} disclosure>
                Page Jump
            </Button>}
            onClose={togglePopoverActive}
        >
            <OptionList
                title="Go to"
                onChange={pageJumpSettingHandller}
                options={pageOptions}
                selected={selectedPage}
            />
        </Popover>)
}

export const OrderView = (props) => {

    const { setPagination, pagination } = useContext(DataContext);
    const [selected, setSelected] = useState([pagination.size]);
    const [popoverActive, setPopoverActive] = useState(false);
    const [value, setValue] = useState(40);
    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    const viewSizeSettingHandller = (selection) => {
        if (selection[0] != 'custom') {
            setSelected(selection);
            orderFilterObjSettingHandller(selection[0]);
            setPopoverActive(false);
        }
    }
    const orderFilterObjSettingHandller = value => {
        setPagination((prevState) => ({ ...prevState, size: value, page: 1 }));
        props.setIsPageChange(isPageChange => !isPageChange);
        setPopoverActive(false);
    }
    const setCustomeValueHandller = () => {
        if (value) {
            setSelected('custom');
            orderFilterObjSettingHandller(value);
            setPopoverActive(false);
        }
    }

    return (
        <Popover
            active={popoverActive}
            activator={<Button onClick={togglePopoverActive} disclosure>
                Order View
            </Button>}
            onClose={togglePopoverActive}
        >
            <OptionList
                title="View"
                onChange={viewSizeSettingHandller}
                options={[
                    { value: 5, label: '5 orders', },
                    { value: 10, label: '10 orders' },
                    { value: 15, label: '15 orders', },
                    { value: 20, label: '20 orders' },
                    { value: 25, label: '25 orders' },
                    {
                        value: 'custom', label: <div style={{ width: 70, textAlign: "end" }}><TextField
                            label="Custom"
                            type="number"
                            value={value}
                            onChange={(value) => { setValue(value) }}
                            autoComplete="off"
                        />
                            <div style={{ paddingTop: 2 }}><Button onClick={setCustomeValueHandller} size="slim">Set</Button></div>
                        </div>
                    },
                ]}
                selected={selected}
            />
        </Popover>)
}
