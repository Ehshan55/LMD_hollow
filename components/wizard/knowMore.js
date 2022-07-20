import { Button, Card, DisplayText, Layout, Stack } from '@shopify/polaris'
import React from 'react'

const KnowMore = () => {
    return (
        <div className={"onboardingDiv"}>

            <div className="onboarding_firsthalf">
                <div className="mediaCard">
                    <div className="mediaCardImageHolder">
                        <div className="content_firsthalf">
                            <DisplayText size="extraLarge">Almost done!</DisplayText><br />
                            {/* <DisplayText size="large">Now we will be syncing the unfulfilled past </DisplayText>
                            <DisplayText size="large">30 days orders from your store.</DisplayText> */}

                            <img className="helper_img" src="/images/wizard/6.png" />
                        </div>
                    </div>

                </div>
            </div>

            <div className="onboarding_secondhalf">
                <div className="content_secondhalf">
                    <DisplayText size="large">Choose to navigate</DisplayText><br />
                    <Card>
                        <Card.Section>
                            <Stack spacing="loose" vertical>
                                <p> Head to dashboard </p>
                                <Stack distribution="trailing">
                                    <Button size="slim" url="/admin/dashboard" >{'Dashboard >'}</Button>
                                </Stack>
                            </Stack>
                        </Card.Section>
                    </Card>
                    <Card>
                        <Card.Section>
                            <Stack spacing="loose" vertical>
                                <p> Create delivery executive to assign delivery order tasks </p>
                                <Stack distribution="trailing">
                                    <Button size="slim" url="/admin/users/executives/add" >{'Delivery Executives >'}</Button>
                                </Stack>
                            </Stack>
                        </Card.Section>
                    </Card>
                    <Card>
                        <Card.Section>
                            <Stack spacing="loose" vertical>
                                <p> Get our cross-platform mobile application for delivery executives </p>
                                <Stack distribution="trailing">
                                    <Button size="slim" url="/admin/application" >{'Mobile Application  >'}</Button>
                                </Stack>
                            </Stack>
                        </Card.Section>
                    </Card>
                </div>
            </div>

        </div>
    )
}


export default KnowMore