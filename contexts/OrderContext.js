import { createContext, useState } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [allPopoverActive, setallPopoverActive] = useState(false);
    

    return (
        <OrderContext.Provider
            value={{
                allPopoverActive,
                setallPopoverActive
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};