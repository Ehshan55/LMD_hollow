import { Frame, TopBar } from '@shopify/polaris'
import React, { useContext, useState } from 'react'

import Greetings from '../../components/wizard/greetings';
import KnowMore from '../../components/wizard/knowMore';
import ScriptEnableing from '../../components/wizard/scriptEnableing';
import Warehouse from '../../components/wizard/warehouse';
import WarehouseZoneInfo from '../../components/wizard/warehouseZoneInfo';
import Zone from '../../components/wizard/zone';

import { validateLogin } from '../../contexts/AuthContext';
import { DataContext } from '../../contexts/DataContext';

const Setup = () => {
    const [pageCase, setPageCase] = useState(0);
    const { constructTostStates, toastMarkup } = useContext(DataContext);
    return (
        <Frame >
            <TopBar />
            {pageCase == 0 && <Greetings setPageCase={setPageCase} />}
            {pageCase == 1 && <Warehouse setPageCase={setPageCase} constructTost={constructTostStates} />}
            {pageCase == 2 && <Zone setPageCase={setPageCase} constructTost={constructTostStates} />}
            {pageCase == 3 && <WarehouseZoneInfo setPageCase={setPageCase} />}
            {pageCase == 4 && <ScriptEnableing setPageCase={setPageCase} constructTost={constructTostStates} />}
            {pageCase == 5 && <KnowMore />}

            {toastMarkup}
        </Frame>
    )
}

Setup.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}

export default Setup