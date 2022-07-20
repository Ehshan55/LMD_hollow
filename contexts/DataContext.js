import { Loading } from "@shopify/polaris";
import { createContext, useContext, useState } from "react";
import OrdersService from "../apiservices/OrdersService";
import ToastUp from "../components/toast";
import LoaderContext from "./LoaderContext";
const orderServiceApi = new OrdersService()

export const DataContext = createContext();


export const DataProvider = ({ children }) => {
    const { showLoader } = useContext(LoaderContext);

    const [orderFilter, setOrderFilter] = useState({
        userid: "4ystr",
        Name: "Ehsan's Filter",
        internal: false,
        filters: {
            fqlFilters: [
                {
                    key: "name",
                    values: { $regex: "#10" },
                    condition: "equal",
                }
            ],
            sort: {
                key: "created_at",
                direction: -1
            },
            columns: [
                "name",//required
                "shipping_address",//default reduired for city and zip
                // "city",
                // "zip",
                "customer",
                "total_price_usd",
                "financial_status",
                "fulfillment_status",
                "line_items",
                "location",
                // below keys will not make and row item. they will be used for condation handlling
                "location_request_token",
                "store_url"//default required for customer and item redirection.
            ],
            duration: "m"
        },

    });
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
    });

    const [orderResponse, setOrderResponse] = useState([]);
    const [selectedOrdersIds, setSelectedOrdersIds] = useState([]);


    const [selectedColumn, setSelectedColumn] = useState([]);


    const [warehouseData, setWarehouseData] = useState({});

    const [storeName, setStoreName] = useState();

    const [ordreAnalytics, setOrdreAnalytics] = useState([]);

    const [isLoading, setTopLoading] = useState(false);

    const [toastActiveDuration, setToastActiveDuration] = useState(1500);
    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastErrorMessage, setToastErrorMessage] = useState(false);

    const changeWarehouseData = (state) => {
        setWarehouseData(state);
    }

    const loadingMarkup = isLoading ? <Loading /> : null;

    const constructTostStates = (msg, errorMsg, duration) => {
        // console.log(msg)
        setToastMessage(msg);
        setToastErrorMessage(errorMsg);
        setToastActive(true);
        setToastActiveDuration(duration);
    }

    const getOrderList = (filter) => {
        showLoader(true);
        try {
            let orderFilterWithPagination = {};
            if (filter instanceof Object) {
                orderFilterWithPagination = { ...filter, pagination };
            } else {
                orderFilterWithPagination = { ...orderFilter, pagination };

            }
            // console.log('pagination', { ...orderFilter, pagination })
            orderServiceApi.getOrdersList(orderFilterWithPagination, (data, pagination) => {
                if (data) {
                    // console.log(pagination);
                    setOrderResponse(data);
                    setPagination(pagination);
                    showLoader(false);
                }
            })
        } catch (error) {
            console.log(error);
            showLoader(false);
        }

    }
    const toastMarkup = toastActive ? (
        <ToastUp text={toastMessage} toastErrorMessage={toastErrorMessage} toggleToastActive={() => setToastActive((toastActive) => !toastActive)} toastActiveDuration={toastActiveDuration} />
    ) : null;

    return (
        <DataContext.Provider
            value={{
                storeName, setStoreName,
                ordreAnalytics, setOrdreAnalytics,
                orderFilter, setOrderFilter,
                selectedColumn, setSelectedColumn,
                orderResponse, setOrderResponse,
                warehouseData, changeWarehouseData,
                loadingMarkup, setTopLoading,
                selectedOrdersIds, setSelectedOrdersIds,
                pagination, setPagination,
                toastMarkup,
                constructTostStates,
                getOrderList,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};