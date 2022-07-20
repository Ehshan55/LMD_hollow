import { AppProvider } from '@shopify/polaris';
import React from 'react';
import LoginPage from "./login";
const Dashboard = () => {


    return (
        <AppProvider i18n >
            <LoginPage />
        </AppProvider>
    );
}

export default Dashboard;
