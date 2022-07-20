import React, { Fragment, useState, useCallback, useEffect, useContext } from 'react';
import { Card, Tabs, Page, Icon, Select, Button, Layout, Heading, Checkbox, Tag, TextField, Modal, Stack, RadioButton, ResourceItem, ResourceList, Avatar, TextStyle, ButtonGroup } from '@shopify/polaris';
import SideNavBar from '../../../components/sideNavBar';
import MessageModal from '../../../components/messageModal';

import SettingsApiService from '../../../apiservices/settingsService';
import {
    DeleteMinor, CircleDisableMinor
} from '@shopify/polaris-icons';
import { validateLogin } from '../../../contexts/AuthContext';
// import { response } from 'express';
import LoaderContext from '../../../contexts/LoaderContext';


const SettingsApi = new SettingsApiService();
var permisionList = []


function SettingsNew() {
    const [selectedTab, setSelectedTab] = useState(0);
    const { showLoader } = useContext(LoaderContext);

    const [activeOrderModal, setActiveOrderModal] = useState(false);
    const [activeRolesModal, setActiveRolesModal] = useState(false);
    const [activePasswordChangeModal, setActivePasswordChangeModal] = useState(false);
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [userEmailAddress, setUserEmailAddress] = useState('nawneet.sharma@gmail.com');
    const [userPhone, setUserPhone] = useState('');
    const [userAddress_1, setUserAddress_1] = useState('');
    const [userAddress_2, setUserAddress_2] = useState('');
    const [userCity, setUserCity] = useState('');
    const [userState, setUserState] = useState('');
    const [userPinCode, setUserPinCode] = useState('');
    const [userCountry, setUserCountry] = useState('');
    const [userAddressPhone, setUserAddressPhone] = useState('');
    const [userPassword, setUserPassword] = useState('321098766')
    const [userNewPassword, setUserNewPassword] = useState('')
    const [userConfirmPassword, setUserConfirmPassword] = useState('')


    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [customeMessage, setCustomMessage] = useState('');
    const [, setSelectedRoles] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [successRoleModal, setSuccessRoleModal] = useState(false);
    const [successInvitationModal, setSuccessInvitationModal] = useState(false);
    const [successTitle, setSuccessTitle] = useState('Password changes successfully');
    const [checkedPermissionState, setCheckedPermissionState] = useState(
        new Array(permisionList?.length).fill(false)
      );
    const [checkedPermissionId, setCheckedPermissionId] = useState([]);
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const [roleList, setRoleList] = useState([]);
    const [updateRolesCard, setUpdateRolesCard] = useState(true);
    const [updateRegisterUser, setUpdateRegisterUser] = useState(true);
    const [updatePendingInvite, setUpdatePendingInvite] = useState(true);


    const [inviteUserFirstName, setInvitUserFirstName] = useState('');
    const [inviteUserLastName, setInviteUserLastName] = useState('');
    const [inviteUserEmailAddress, setInviteUserEmailAddress] = useState('');
    const [pendingInvites, setPendingInvites] = useState([]);
    const [registerInvites, setRegisterInvites] = useState([]);
    const [rolesOptions, setRoleOptions] = useState([
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Delivery Agent', value: 'agent' },
    ]);


    const handleChangePermissionState = (position) => {

        const tempPermissionList = checkedPermissionId;

        const updatedCheckedState = checkedPermissionState.map((item, index) =>
          index === position ? !item : item
        );
        if(tempPermissionList.indexOf(permisionList[position]._id) > -1){
            const temp = tempPermissionList.filter(item => item !== permisionList[position]._id)

            setCheckedPermissionId(temp)

        }
        else {
            tempPermissionList.push(permisionList[position]._id)
            setCheckedPermissionId(tempPermissionList)

        }
        console.log("tempPermissionList ", checkedPermissionId)
        
        setCheckedPermissionState(updatedCheckedState);
    }

    const handleSelectRoles = (registered_user_id, role_id) => {
        showLoader(true);

        const obj = {   
            role_id: role_id,
        }
        SettingsApi.updateRegisterUserRoles(registered_user_id, obj, (response) => {
            if (response) {
                showLoader(false);
                setUpdateRegisterUser(!updateRegisterUser)
            }
            else {
                console.log('Fail response ', )
            }

        })
    };  


    const handleRolesModal = () => {
        setActiveRolesModal(!activeRolesModal)
    }
    const handleInviteModal = () => {
        setActiveOrderModal(!activeOrderModal)
    }
    const handlePasswordChangeModal = () => {
        setActivePasswordChangeModal(!activePasswordChangeModal)
    }
    const handleSucessChangeModal = () => {
        setSuccessModal(!successModal)

    }
    const handleSucessRoleChangeModal = () => {
        setSuccessRoleModal(!successRoleModal)
    }
    const handleSucessInvitationModal = () => {
        setSuccessInvitationModal(!successInvitationModal)
    }
    
    const [valueRoles, setValueRoles] = useState('');

    const handleRolesChange = useCallback(
        (_checked, newValue) => (setValueRoles(newValue), console.log("newValue ", newValue)),
        [],
    );

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelectedTab(selectedTabIndex),
        [],
    );

    const cancelPendingInvite = (invitation_id) => {
        showLoader(true);

        SettingsApi.cancelPendingInvite(invitation_id, (response) => {
            if (response) {
                showLoader(false);
                setUpdatePendingInvite(!pendingInvites)
            }
            else {
                showLoader(false);

                console.log('Fail response ', )
            }

        })
    };  

    const removeUserFromStore = (registered_user_id) => {
        showLoader(true);

        SettingsApi.removeUserFromStore(registered_user_id, (response) => {
            if (response) {
                showLoader(false);
                setUpdateRegisterUser(!updateRegisterUser)
            }
            else {
                showLoader(false);

                console.log('Fail response ', )
            }

        })
    };  


    const updateProfile = () => {
        showLoader(true);
        const obj = {
            "first_name": firstName,
            "last_name": lastName,
            "email": emailAddress,
            "address": {
                "address_1": userAddress_1,
                "address_2": userAddress_2,
                "city": userCity,
                "state": userCity,
                "pincode": userPinCode,
                "country": userCountry,
                "phone": userCountry
            }        }
        console.log(' object ', obj)

        SettingsApi.updateUserProfile(obj, (response) => {
            console.log(' response ', response)
            if (response?.status) {
                setSuccessTitle(response?.msg)
                showLoader(false);
                // setActivePasswordChangeModal(false)
                setSuccessModal(!successModal)
                console.log(' response ', response)
            }
            else {
                console.log(' response ', response)
            }

        })
    };

    const updatePassword = () => {
        showLoader(true);
        const obj = {
            password: userNewPassword,
        }
        console.log(' object ', obj)

        SettingsApi.updateUserPassword(obj, (response) => {
            console.log(' response ', response)
            if (response?.status) {
                setSuccessTitle('Password Updated')
                
                showLoader(false);

                setActivePasswordChangeModal(false)
                setSuccessModal(!successModal)
                setUserNewPassword('')
                setUserConfirmPassword('')
                console.log(' response ', response)
            }
            else {
                console.log(' response ', response)
            }

        })
    };

    const createNewRoles = () => {
        showLoader(true);
        const obj = {
            "title": roleName,
            "description": roleDescription,
            "user_permissions":checkedPermissionId
        }
        console.log(' object ', obj)
        // getAllRoles();
        // setActiveRolesModal(!activeRolesModal)
        SettingsApi.createRoles(obj, (response) => {
            console.log(' response ', response)
            if (response?.status) {
                
                showLoader(false);
                setSuccessRoleModal(!successRoleModal)
                setRoleName('')
                setRoleDescription('')
                setCheckedPermissionId([])
                setSuccessTitle(response?.msg)
                setCheckedPermissionState(new Array(permisionList?.length).fill(false))
                setActiveRolesModal(!activeRolesModal)
                getAllRoles();
                console.log(' response ', response)
            }
            else {
                console.log(' response ', response)
            }

        })
    };

    const inviteUser = () => {
        showLoader(true);
        const obj = {
            "first_name": inviteUserFirstName,
            "last_name": inviteUserLastName,
            "email": inviteUserEmailAddress,
            "user_role": valueRoles,
            "phone": "+918092229211",
            "custom_msg": customeMessage,


        }
        SettingsApi.inviteUser(obj, (response) => {
            console.log(' response ', response)
            if (response?.status) {
                
                showLoader(false);
                setSuccessInvitationModal(!successInvitationModal)
                setInvitUserFirstName('')
                setInviteUserLastName('')
                setInviteUserEmailAddress('')
                setValueRoles('')
                setSuccessTitle(response?.msg)
                setActiveOrderModal(!activeOrderModal)
                setUpdatePendingInvite(!pendingInvites)
                console.log(' response ', response)
            }
            else {
                console.log(' response ', response)
            }

        });
               
    }
    const reInviteUser = (first_name, last_name, email, user_role) => {
        showLoader(true);
        const obj = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "user_role": user_role,
        }

        SettingsApi.inviteUser(obj, (response) => {
            console.log(' response ', response)
            if (response?.status) {
                
                showLoader(false);
                setSuccessInvitationModal(!successInvitationModal)
                setSuccessTitle(response?.msg)
                setUpdatePendingInvite(!pendingInvites)
                console.log(' response ', response)
            }
            else {
                console.log(' response ', response)
            }

        });
               
    }

    const getAllRoles = () => {
        SettingsApi.getAllRoles((response) => {
            if (response) {
                // setCheckedPermissionState(new Array(response?.length).fill(false))
                console.log(" getAllRoles getAllRoles Success ", response);
                setRoleList(response)
                setUpdateRolesCard(false)
                showLoader(false);

                
            }
            else {
                console.log(" getAllRoles response Error ", response);
            }

        })
    }



    const tabs = [
        {
            id: 'accepts-marketing-1',
            content: 'Profile',
            panelID: 'accepts-marketing-content-1',
            view: <>
                {/* For Sending Invitation */}
                <Layout>

                    {/* Invitation Modal */}
                    <Layout.Section secondary>
                        <Heading section="h3">User Profile</Heading>
                        <br />
                        <p>Verify the details associated. Make changes if needed. Click on Update to update the field or click on Change Password to change the password.</p>
                        <br />


                    </Layout.Section>

                    {/* List of people accepted and their roles */}
                    <Layout.Section>
                        <Card>
                            <Card.Section>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ width: "45%" }}>
                                        <TextField
                                            label={<b>First name</b>}
                                            value={userFirstName}
                                            onChange={(value) => setUserFirstName(value)}
                                            autoComplete="off"
                                            type='text'

                                        />
                                    </div>

                                    <div style={{ width: "45%" }}>
                                        <TextField
                                            label={<b>Last name</b>}
                                            value={userLastName}
                                            onChange={(value) => setUserLastName(value)}
                                            autoComplete="off"
                                            type='text'
                                        />
                                    </div>

                                </div>
                                <br></br>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ width: "45%" }}>
                                        <TextField
                                            label={<span><b>Email Address</b>&nbsp; {emailVerified ? '✅' : ''}</span>}
                                            value={userEmailAddress}
                                            onChange={(value) => setUserEmailAddress(value)}
                                            autoComplete="off"
                                            type='email'
                                            disabled
                                        />


                                    </div>

                                    <div style={{ width: "45%" }}>
                                        <TextField
                                            label={<b>Phone</b>}
                                            value={userPhone}
                                            onChange={(value) => setUserPhone(value)}
                                            autoComplete="off"
                                            type='text'
                                        />
                                    </div>
                                </div>

                                <br></br>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                    <div style={{ width: "45%" }}>
                                        <TextField
                                            label={<b>Password</b>}
                                            value={userPassword}
                                            onChange={(value) => setUserPassword(value)}
                                            autoComplete="off"
                                            type='password'
                                            disabled
                                        />
                                    </div>
                                    <div style={{ width: "45%" }}>
                                        <TextField
                                            label={<b>Address 1</b>}
                                            value={userAddress_1}
                                            onChange={(value) => setUserAddress_1(value)}
                                            autoComplete="off"
                                            type='email'
                                        />
                                    </div>

                                </div>

                                <br></br>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                                    <div style={{ width: "30%" }}>
                                        <TextField
                                            label={<b>Address 2</b>}
                                            value={userAddress_2}
                                            onChange={(value) => setUserAddress_2(value)}
                                            autoComplete="off"
                                            type='text'
                                        />
                                    </div>
                                    <div style={{ width: "30%" }}>
                                        <TextField
                                            label={<b>City</b>}
                                            value={userCity}
                                            onChange={(value) => setUserCity(value)}
                                            autoComplete="off"
                                            type='email'
                                        />
                                    </div>

                                    <div style={{ width: "30%" }}>
                                        <TextField
                                            label={<b>State</b>}
                                            value={userState}
                                            onChange={(value) => setUserState(value)}
                                            autoComplete="off"
                                            type='text'
                                        />
                                    </div>

                                </div>

                                <br></br>

                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                    <div style={{ width: "30%" }}>
                                        <TextField
                                            label={<b>Pincode</b>}
                                            value={userPinCode}
                                            onChange={(value) => setUserPinCode(value)}
                                            autoComplete="off"
                                            type='text'
                                        />
                                    </div>
                                    <div style={{ width: "30%" }}>
                                        <TextField
                                            label={<b>Country</b>}
                                            value={userCountry}
                                            onChange={(value) => setUserCountry(value)}
                                            autoComplete="off"
                                            type='email'
                                        />
                                    </div>

                                    <div style={{ width: "30%" }}>
                                        <TextField
                                            label={<b>Address Phone</b>}
                                            value={userAddressPhone}
                                            onChange={(value) => setUserAddressPhone(value)}
                                            autoComplete="off"
                                            type='text'
                                        />
                                    </div>
                                </div>

                                <br></br>
                                <br></br>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <ButtonGroup>
                                        <Button onClick={handlePasswordChangeModal}>Change Password</Button>
                                        <Button primary onClick={updateProfile}>Update</Button>
                                    </ButtonGroup>
                                </div>

                                <Modal
                                    small
                                    open={activePasswordChangeModal}
                                    title={<b>Change Password</b>}
                                    onClose={handlePasswordChangeModal}

                                >

                                    <Card.Section>

                                        <TextField
                                            label={<b>New Password</b>}
                                            value={userNewPassword}
                                            onChange={(value) => setUserNewPassword(value)}
                                            autoComplete="off"
                                            type='password'
                                        />

                                        <br></br>

                                        <TextField
                                            label={<b>Confirm Password</b>}
                                            value={userConfirmPassword}
                                            onChange={(value) => setUserConfirmPassword(value)}
                                            autoComplete="off"
                                            type='password'
                                        />

                                        <br></br>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <ButtonGroup>
                                                <Button onClick={handlePasswordChangeModal}>Cancel</Button>
                                                <Button primary onClick={updatePassword} disabled={!(userNewPassword === userConfirmPassword && userNewPassword.length > 3) ? true : false}>Update Password</Button>
                                            </ButtonGroup>
                                        </div>

                                    </Card.Section>
                                </Modal>

                                {/* Sucess Modal */}
                                {successModal?<MessageModal activeMessageModal={successModal} description={successTitle} handleSucessChangeModal={handleSucessChangeModal} />:<></>} 

                            </Card.Section>
                        </Card>
                    </Layout.Section>
                </Layout>
                <br></br>
                <br></br>


            </>
        },
        {
            id: 'all-customers-2',
            content: 'User',
            accessibilityLabel: 'All customers',
            panelID: 'all-customers-content-1',
            view: <>
                {/* For Sending Invitation */}
                <Layout>

                    {/* Invitation Modal */}
                    <Layout.Section secondary>
                        <Heading section="h3">Users</Heading>
                        <br />
                        <p>Invite user by click on click invite. Add their first name, last name & email address. Add their first name, last name & email address.</p>
                        <br />
                        <Button primary onClick={handleInviteModal}>Invite People</Button>
                        <Modal
                            small
                            open={activeOrderModal}
                            title={<b>Invite Member</b>}
                            onClose={handleInviteModal}
                            primaryAction={{
                                content: 'Invite',
                                onAction: inviteUser,
                            }}
                            secondaryActions={[
                                {
                                    content: 'Cancel',
                                    onAction: handleInviteModal,
                                },
                            ]}

                        >
                              {/* Sucess Modal */}

                            <Card.Section>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextField
                                        label={<b>First name</b>}
                                        value={inviteUserFirstName}
                                        onChange={(value) => setInvitUserFirstName(value)}
                                        autoComplete="off"
                                        type='text'

                                    />
                                    <span>&nbsp;&nbsp;</span>
                                    <TextField
                                        label={<b>Last name</b>}
                                        value={inviteUserLastName}
                                        onChange={(value) => setInviteUserLastName(value)}
                                        autoComplete="off"
                                        type='text'
                                    />
                                </div>
                                <br></br>
                                <TextField
                                    label={<b>Email Address</b>}
                                    value={inviteUserEmailAddress}
                                    onChange={(value) => setInviteUserEmailAddress(value)}
                                    autoComplete="off"
                                    type='email'
                                />
                                <br></br>
                                <Stack vertical spacing='tight'>
                                    <Heading section="h4">Roles</Heading>
                                    <div style={{maxHeight: '200px', overflow:'auto', display:'flex', flexDirection:'column'}}>
                                    {roleList?.map((item, index) => {
                                        return (
                                            <RadioButton
                                            label={item?.title}
                                            helpText={item?.description}
                                            checked={valueRoles === item?._id}
                                            id={item?._id}
                                            name={item?.title}
                                            onChange={handleRolesChange}
                                            key={index}
                                        />
                                        )})}
                                    </div>
                            

                                </Stack>
                                <br></br>
                                <TextField
                                    label={<b>Custom Message</b>}
                                    value={customeMessage}
                                    onChange={(value) => setCustomMessage(value)}
                                    autoComplete="off"
                                    type='text'
                                    multiline={3}
                                    placeholder='Optional, provide custom additional message...'
                                />
                            </Card.Section>
                        </Modal>
                        {successInvitationModal?<MessageModal activeMessageModal={successInvitationModal} description={successTitle} handleSucessChangeModal={handleSucessInvitationModal} />:<></>} 


                    </Layout.Section>

                    {/* List of people accepted and their roles */}
                    <Layout.Section>
                        <Card>
                            <Card.Section>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={registerInvites}
                                    renderItem={(item) => {
                                        const { _id, url, first_name, last_name, email, user_role,store_admin } = item;
                                        var initials = first_name.charAt(0) + "" + last_name.charAt(0);


                                        return (
                                            <ResourceItem
                                                id={_id}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <div style={{ width: "48%", display: 'flex', flexDirection: 'row' }}>
                                                        <div id="container" style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50px',
                                                            background: '#E4E9F2',
                                                            marginRight: '24px'
                                                        }}>
                                                            <div id="name" style={{
                                                                width: '100%',
                                                                textAlign: 'center',
                                                                color: 'white',
                                                                fontSize: '14px',
                                                                lineHeight: '40px',
                                                                fontWeight: 'bold',
                                                                color: 'black'

                                                            }}>

                                                                {initials}
                                                            </div>
                                                        </div>
                                                        <div >

                                                            <h3>
                                                                <TextStyle variation="strong">{first_name + ' ' + last_name}</TextStyle>
                                                            </h3>
                                                            <div style={{}}>{email}</div>
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                                        <Select
                                                            // label={user_role?.title}
                                                            options={rolesOptions}
                                                            onChange={(value) => handleSelectRoles(_id, value)}
                                                            value={user_role?._id}
                                                            disabled={store_admin}
                                                        />
                                                        <span>&nbsp;&nbsp;</span>
                                                        {store_admin?<Icon
                                                            source={CircleDisableMinor}
                                                            color="critical" />:<div  onClick={()=>removeUserFromStore(_id)} style={{marginTop:"auto", marginBottom:"auto"}}>
                                                                <Icon
                                                            source={DeleteMinor}
                                                            color="base" 
                                                           
                                                            />
                                                            </div>
                                                            
                                                            }
                                                        
                                                    </div>

                                                </div>

                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card.Section>
                        </Card>
                    </Layout.Section>
                </Layout>
                <br></br>
                <br></br>

                {/* For Pending Invitation */}
                <Layout>

                    <Layout.Section secondary>
                        <Heading section="h3">Pending Invites</Heading>
                        <br />
                        <p>Invitation has been sent. Still have not accepted by the users.</p>
                        <br />

                    </Layout.Section>

                    {/* List of people pending and if remove or resend invitation */}
                    <Layout.Section>
                        <Card>
                            <Card.Section>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={pendingInvites}
                                    renderItem={(item) => {
                                        const { _id,  first_name, last_name, email, user_role , } = item;
                                        var initials = first_name.charAt(0) + "" + last_name.charAt(0);
                                        return (
                                            <ResourceItem
                                                id={_id}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <div style={{ width: "48%", display: 'flex', flexDirection: 'row' }}>
                                                        <div id="container" style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50px',
                                                            background: '#008F72',
                                                            marginRight: '24px'
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
                                                        <div >

                                                            <h3>
                                                                <TextStyle variation="strong">{first_name + ' ' + last_name}</TextStyle> <span style={{marginLeft: '8px', fontSize: '8px', padding: '3px', background:'#E4E9F2', borderRadius: '5px'}}>{user_role?.title}</span>
                                                            </h3>
                                                            
                                                            <div style={{}}>{email}</div>
                                                        </div>
                                                    </div>
                                                    <ButtonGroup>
                                                        <Button primary size="slim" onClick= {() => reInviteUser(first_name, last_name, email, user_role?._id) }>Resend Invite</Button>
                                                        <div style={{ color: '#bf0711' }}>
                                                            <Button monochrome outline size="slim" onClick={()=>cancelPendingInvite(_id)} >
                                                                Revoke Invite
                                                            </Button>
                                                        </div>
                                                    </ButtonGroup>
                                                </div>

                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card.Section>
                        </Card>
                    </Layout.Section>
                </Layout>
            </>
        },
        {
            id: 'accepts-marketing-3',
            content: 'Roles',
            panelID: 'accepts-marketing-content-1',
            view: <>
                {/* For Sending Invitation */}
                <Layout>

                    {/* Invitation Modal */}
                    <Layout.Section secondary>
                        <Heading section="h3">Roles</Heading>
                        <br />
                        <p>Select the roles assigned to each users. Also give them the permission from the selected list</p>
                        <br />
                        <Button primary onClick={handleRolesModal}>Create Roles</Button>
                        <Modal
                            small
                            open={activeRolesModal}
                            title={<b>Create Roles</b>}
                            onClose={handleRolesModal}
                            primaryAction={{
                                content: 'Create Role',
                                onAction: createNewRoles,
                                
                            }}
                            secondaryActions={[
                                {
                                    content: 'Cancel',
                                    onAction: handleRolesModal,
                                },
                            ]}

                        >

                            <Card.Section>

                                <TextField
                                    label={<b>Role name</b>}
                                    value={roleName}
                                    onChange={(value) => setRoleName(value)}
                                    autoComplete="off"
                                    type='text'

                                />
                                <br></br>
                                <TextField
                                    label={<b>Role Description</b>}
                                    value={roleDescription}
                                    onChange={(value) => setRoleDescription(value)}
                                    autoComplete="off"
                                    type='text'
                                    multiline={3}
                                    placeholder='Optional, provide custom additional message...'
                                />


                                <br></br>
                                <Stack vertical spacing='tight'>
                                    <Heading section="h4">Permission List</Heading>
                                    <div style={{maxHeight: '200px', overflow:'auto', display:'flex', flexDirection:'column'}}>
                                    {permisionList.map((item, index) => {
                                        return(
                                            <Checkbox
                                                label={item?.title}
                                                checked={checkedPermissionState[index]}
                                                onChange={() => handleChangePermissionState(index)}
                                                key={index}
                                            />
                                        )
                                    })}
                                    </div>
                                  
                              
                                </Stack>
                                <br></br>

                            </Card.Section>
                        </Modal>
                         {/* Sucess Modal */}
                         {successRoleModal?<MessageModal description={successTitle} activeMessageModal={successRoleModal} handleSucessChangeModal={handleSucessRoleChangeModal} />:<></>} 


                    </Layout.Section>

                    {/* List of people accepted and their roles */}
                    <Layout.Section>
                        <Card>
                            <Card.Section>
                            <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={roleList}
                                    renderItem={(item) => {
                                        const { _id, title , internal, user_permissions } = item;
                                        var initials = title.charAt(0) + "" + title.charAt(1);


                                        return (
                                            <ResourceItem
                                                id={_id}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <div style={{ width: "60%", display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                        <div style={{display:'flex'}}>
                                                        <div id="container" style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50px',
                                                            background: '#E4E9F2',
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
                                                                color: 'black'

                                                            }}>

                                                                {initials}
                                                            </div>
                                                        </div>
                                                        </div>
                                                       
                                                        <div style={{display:'flex', flexDirection:'column', marginLeft:'24px'}}>

                                                            <h3>
                                                                <TextStyle variation="strong">{title}</TextStyle>
                                                            </h3>
                                                            <div style={{}}>{user_permissions.map(item=>item?.title).join(", ")}</div>
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                                        <div style={{display: 'flex', marginTop:'auto', marginBottom:'auto', height:'fit-content'}}>
                                                        <Button outline disabled={internal}>Edit Permission</Button>
                                                        </div>
                                                     
                                                        <span>&nbsp;&nbsp;</span>
                                                        {internal?<Icon
                                                            source={CircleDisableMinor}
                                                            color="critical" />:<div  style={{marginTop:"auto", marginBottom:"auto"}}>
                                                                <Icon
                                                            source={DeleteMinor}
                                                            color="base" 
                                                           
                                                            />
                                                            </div>
                                                            
                                                            }
                                                    </div>

                                                </div>

                                            </ResourceItem>
                                        );
                                    }}
                                />
                                {/* {updateRolesCard?
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={roleList}
                                    renderItem={(item) => {
                                        const { _id, title , description, user_permissions } = item;
                                        var initials = title.charAt(0) + "" + title.charAt(1);


                                        return (
                                            <ResourceItem
                                                id={_id}


                                            >
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <div style={{ width: "60%", display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                        <div style={{display:'flex'}}>
                                                        <div id="container" style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50px',
                                                            background: '#E4E9F2',
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
                                                                color: 'black'

                                                            }}>

                                                                {initials}
                                                            </div>
                                                        </div>
                                                        </div>
                                                       
                                                        <div style={{display:'flex', flexDirection:'column', marginLeft:'24px'}}>

                                                            <h3>
                                                                <TextStyle variation="strong">{title}</TextStyle>
                                                            </h3>
                                                            <div style={{}}>{user_permissions.map(item=>item?.title).join(", ")}</div>
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                                        <div style={{display: 'flex', marginTop:'auto', marginBottom:'auto', height:'fit-content'}}>
                                                        <Button outline>Edit Permission</Button>
                                                        </div>
                                                     
                                                        <span>&nbsp;&nbsp;</span>
                                                        <Icon
                                                            source={DeleteMinor}
                                                            color="base" />
                                                    </div>

                                                </div>

                                            </ResourceItem>
                                        );
                                    }}
                                />:<></>} */}
                                
                            </Card.Section>
                        </Card>
                    </Layout.Section>
                </Layout>
                <br></br>
                <br></br>


            </>
        },

    ];

    useEffect(() => {
        showLoader(true);
        SettingsApi.getUserProfile((response) => {
            if (response) {
                showLoader(false);

                // console.log("getUserProfile response Success ", response);
                setUserFirstName(response.first_name)
                setUserLastName(response.last_name)
                setUserEmailAddress(response.email)
                setUserAddress_1(response.address?.address_1)
                setUserAddress_2(response.address?.address_2)
                setUserCity(response.address?.city)
                setUserState(response.address?.state)
                setUserPinCode(response.address?.pincode)
                setUserCountry(response.address?.country)
                setUserPhone(response.address?.phone)
                setEmailVerified(response.email_verified)
            }
            else {
                console.log(" getUserProfile response Error ", response);
            }

        })

    }, []);

    useEffect(() => {
        showLoader(true);
        SettingsApi.getAllPermission((response) => {
            if (response) {
                showLoader(false);
                permisionList = response;
                setCheckedPermissionState(new Array(response?.length).fill(false))
                // console.log(" getAllPermission response Success ", permisionList);
                
            }
            else {
                console.log(" getAllPermission response Error ", response);
            }

        })


    }, []);

    useEffect(() => {
        showLoader(true);
        SettingsApi.getAllRoles((response) => {
            if (response) {
                showLoader(false);
                // setCheckedPermissionState(new Array(response?.length).fill(false))
                console.log(" getAllRoles response Success ", response);
                setRoleList(response)
                const newRoles = response.map((item) => {
                    return (
                        {roles_id: item?._id, label: item?.title, description: item?.description, internal: item?.internal, value: item?._id}
                    )
                })
                console.log("\n  newRoles ", newRoles);
                setRoleOptions(newRoles);
                
            }
            else {
                console.log(" getAllRoles response Error ", response);
            }

        })


    }, [updateRolesCard]);

    useEffect(() => {
        showLoader(true);
        SettingsApi.getPendingInvites((response) => {
            if (response) {
                showLoader(false);
                // setCheckedPermissionState(new Array(response?.length).fill(false))
                console.log(" getPendingInvites response Success ", response);
                setPendingInvites(response);
                
            }
            else {
                console.log(" getPendingInvites response Error ", response);
            }

        })


    }, [updatePendingInvite]);

    useEffect(() => {
        showLoader(true);
        SettingsApi.getRegisterInvites((response) => {
            if (response) {
                showLoader(false);
                // setCheckedPermissionState(new Array(response?.length).fill(false))
                console.log(" getPendingInvites response Success ", response);
                setRegisterInvites(response)
                
            }
            else {
                console.log(" getPendingInvites response Error ", response);
            }

        })


    }, [updateRegisterUser]);


    return (
        <SideNavBar>
            <Page title="Settings" fullWidth>
                <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
                    <Card.Section>
                        {tabs[selectedTab]?.view}
                    </Card.Section>
                </Tabs>
            </Page>
        </SideNavBar>
    );
}
SettingsNew.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}

export default SettingsNew;