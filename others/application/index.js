import { Heading, Layout, MediaCard } from '@shopify/polaris';
import { Fragment } from 'react';
import SideNavBar from '../../components/sideNavBar';


import { validateLogin } from '../../contexts/AuthContext';


const index = () => {

    const PageContent = () => {
        return (
            <Layout>
                <style jsx>{`
        .box-left{
            padding: 35px 10px 35px 35px;
             max-width: 75%;
              margin-left: auto;
        }
        .box-right{
            padding: 35px 35px 35px 10px;
             max-width: 75%;
              margin-right: auto;
        }
        img: hover{
            cursor: pointer;
        }
        @media screen and (max-width: 1180px) {
            .box-left{
                padding: 35px;
                 max-width: 75%;
                 margin-right: auto;
            }
            .box-right{
                padding: 35px;
                 max-width: 75%;
                 margin-left: auto;
            }
          }
        }
      `}</style>
                <Layout.Section oneHalf>
                    <div className='box-left' >
                        {/* <Heading size="medium">Warehouse Management</Heading> */}
                        <br />
                        <MediaCard
                            // title="Android"
                            // primaryAction={{
                            //     content: 'View Managers',
                            //     // onAction: props.managersPage
                            // }}
                            // description="Each manager has to be assigned with sepcific warehouses "
                            portrait={true}
                        >
                            {/* <p>Each manager has to be assigned with sepcific warehouses </p> */}
                            <div style={{ textAlign: 'center' }}>
                                <a href="https://play.google.com/store/apps/details?id=com.scrollengine.localdelivery&utm_source=dashbaord&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1/" target="_blank">
                                    <img alt="Manager" style={{ padding: 15, width: 100 }} src="../images/android.png" /><br />
                                    <img alt="Manager" style={{ padding: 15, width: 200 }} src="../images/playstore.png" />
                                </a>
                            </div>
                        </MediaCard>
                    </div>
                </Layout.Section>

                <Layout.Section oneHalf>
                    <div className='box-right' >
                        {/* <Heading size="medium">Delivery Management</Heading> */}
                        <br />
                        <MediaCard
                            // title="IOS"
                            // primaryAction={{
                            //     content: 'View Executives',
                            //     // onAction: props.executivesPage
                            // }}
                            // description="Executives can be managed by Admin and by Managers as well"
                            portrait={true}
                        >
                            {/* <p>Delivery executives can be managed by Admin and by Managers as well</p> */}
                            <div style={{ textAlign: 'center' }}>
                                <a href="https://apps.apple.com/in/app/scrollengine-local-delivery/id1594125429/" target="_blank">
                                    <img alt="Delivery" style={{ padding: 15, width: 100 }} src="../images/apple.png" /><br />
                                    <img alt="Delivery" style={{ padding: 15, width: 200 }} src="../images/appstore.png" />
                                </a>
                            </div>
                        </MediaCard>

                    </div>
                </Layout.Section>

            </Layout>
        )
    }

    return (
        <SideNavBar><PageContent /></SideNavBar>
    )
}

index.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}
export default index
