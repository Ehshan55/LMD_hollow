import { Button, DisplayText, Layout } from '@shopify/polaris'
import React from 'react'

const Greetings = (props) => {
    return (
        // <Layout>
        //     <Layout.Section oneThird>
        //         <div className="block-padding wiz-background-img">
        //             <DisplayText size="large">Welcome to</DisplayText>
        //             <DisplayText size="extraLarge">Local Delivery</DisplayText>
        //             <DisplayText size="small">Lets setup this app.</DisplayText>
        //         </div>
        //     </Layout.Section>
        //     <Layout.Section oneHalf>
        //         <div className="right-section-padding">
        //             <DisplayText size="medium"><strong>Quick 2 minutes setup wizard.</strong></DisplayText><br />
        //             <DisplayText size="small">This wizard will let you add important warehouse and zone related information for order syncing.</DisplayText><br />
        //             <Button primary fullWidth onClick={() => props.setPageCase(1)}>Get Started</Button>
        //         </div>
        //     </Layout.Section>
        // </Layout>

        <div className={"onboardingDiv"}>

            <div className="onboarding_firsthalf">
                <div className="mediaCard">
                    <div className="mediaCardImageHolder">
                        <div className="content_firsthalf">
                            <DisplayText size="large">Welcome to</DisplayText>
                            <DisplayText size="extraLarge"><b>Local Delivery</b></DisplayText>
                            <DisplayText size="small">Lets setup this app.</DisplayText>

                            <img className="helper_img" src="/images/wizard/1.png" />
                        </div>
                    </div>

                </div>
            </div>

            <div className="onboarding_secondhalf">
                <div className="content_secondhalf">
                    <DisplayText size="medium"><strong>Quick 2 minutes setup wizard.</strong></DisplayText><br />
                    <DisplayText size="small">This wizard will let you add important warehouse and zone related information for orders syncing.</DisplayText><br />
                    <Button primary fullWidth onClick={() => props.setPageCase(1)}>Get Started</Button>
                </div>
            </div>
        </div>
    )
}

export default Greetings