import { Button, Icon, TextStyle } from "@shopify/polaris"
import { DeleteMinor } from '@shopify/polaris-icons';

const RItemContent = ({ title, getZoneById, _id, description, initials, removeZoneById }) => {
    const truncateString = (str, max, suffix) => str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`;

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ width: "60%", display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                <div style={{ display: 'flex' }}>
                    <div id="container" style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50px',
                        background: '#26495c',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                    }}>
                        <div id="name" style={{
                            width: '100%',
                            textAlign: 'center',
                            color: 'white',
                            fontSize: '14px',
                            lineHeight: '40px',
                            fontWeight: 'bold',

                        }}>

                            {initials}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '24px' }}>

                    <h3>
                        <TextStyle variation="strong">{title}</TextStyle>
                    </h3>
                    <div style={{}}>{truncateString(description, 40, '...')}</div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <div style={{ display: 'flex', marginTop: 'auto', marginBottom: 'auto', height: 'fit-content', color: '#26495c' }}>
                    <Button monochrome outline onClick={() => getZoneById(_id)} >Edit Zone</Button>
                </div>

                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <div style={{ marginTop: "auto", marginBottom: "auto" }} onClick={() => removeZoneById(_id)}>
                    <Icon
                        source={DeleteMinor}
                        color="critical"

                    />
                </div>


            </div>

        </div>
    )
}

export default RItemContent