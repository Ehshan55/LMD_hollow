import React, { useCallback, useEffect, useState } from 'react';
import { Banner, Button, Card, Form, FormLayout, Layout, Page, ResourceItem, ResourceList, Stack, TextField, TextStyle, Checkbox, List } from '@shopify/polaris';

import ManagerApiService from '../../../apiservices/managerApiService';
import validateEmail from '../../../utils/validateEmail';
const apiRequest = new ManagerApiService();

const ManageAgent = (props) => {
 
  const [agentName, setAgentName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');

  let DateObj = { user_type: 'manager', address: {} };

  const handelAgentNameChange = useCallback((value) => {
    setAgentName(value);
  }, []);
  const handelEmailChange = useCallback((value) => {
    setEmail(value);
  }, []);
  const handelPasswordChange = useCallback((value) => {
    setPassword(value);
  }, []);
  const handelAddressChange = useCallback((value) => {
    setAddress(value);
  }, []);
  const handelApartmentChange = useCallback((value) => {
    setApartment(value);
  }, []);
  const handelCountryChange = useCallback((value) => {
    setCountry(value);
  }, []);
  const handelStateChange = useCallback((value) => {
    setState(value);
  }, []);
  const handelPincodeChange = useCallback((value) => {
    setPincode(value);
  }, []);
  const handelPhoneChange = useCallback((value) => {
    setPhone(value);
  }, []);

  const [avaliableZones, setAvaliableZones] = useState([]);

  // const [assignedZones, setAssignedZones] = useState([]);
  const [assignedZonesIdsArr, setAssignedZonesIdsArr] = useState([]);
  const makeAssignedZonesIdsArr = (zone_access) => {
    let zone_access_ids = [];
    zone_access.forEach((zone) => {
      zone_access_ids.push(zone._id);
    });
    setAssignedZonesIdsArr(zone_access_ids);
  };
  useEffect(() => {
    props.showLoader(true);
   

    if (props.pageTitle == 'Edit Agent' && props.agentId) {
      // console.log('Get Managr');
      apiRequest.getDeliveryAgentDetailsById(props.agentId, (response) => {
        // console.log(response);
        if (response) {
          let Agent = response;
          setAgentName(Agent?.name);
          setAddress(Agent.address?.address_1);
          setApartment(Agent.address?.address_2);
          setEmail(Agent?.email);
          setCountry(Agent.address?.country);
          setState(Agent.address?.state);
          setPincode(Agent.address?.pincode);
          setPhone(Agent.address?.phone);
          // setAvaliableZones(response.delivery_zone_arr);
          // setAssignedZones(Agent.delivery_zone_access);
          makeAssignedZonesIdsArr(Agent.delivery_zone_access);

          props.showLoader(false);
        }
      });
    }
    apiRequest.getAllDeliveryZones((response) => {
      if (response) {
        // console.log('All avaliable Zones ', response);
        setAvaliableZones(response);
      }
      props.showLoader(false);
    });
    if (props.pageTitle == 'Create Agent') {
      // props.showLoader(false);
      // OrderApiRequestService.listZones((response) => {
      //   console.log(response);
      //   // setAvaliableZones(responseArray);
      // });
    }
  }, []);

  const handelSubmit = () => {
    props.showLoader(true);

    if(agentName==''||email==''||address==''||apartment==''||country==''||state==''||pincode==''||phone==''){
      props.constructTostStates('Please fill all fields');
      props.showLoader(false);
    }
    else if(!validateEmail(email, props.constructTostStates)){
      props.showLoader(false);
    }
    else if(props.pageTitle == 'Create Agent' && password==''){
      props.constructTostStates('Please fill all fields');
      props.showLoader(false);
    }
    else if (assignedZonesIdsArr.length == 0) {
      props.constructTostStates('Please Select a zone');
      props.showLoader(false);
    } else {
    // DataObj.user_type = user_type;
    DateObj.name = agentName;
    DateObj.email = email;
    if(props.pageTitle == 'Create Agent'){
    DateObj.password = password;
    }
    DateObj.address.address_1 = address;
    DateObj.address.address_2 = apartment;
    DateObj.address.country = country;
    DateObj.address.state = state;
    DateObj.address.pincode = pincode;
    DateObj.address.phone = phone;

    DateObj.delivery_zone_access = assignedZonesIdsArr;

      if (props.pageTitle == 'Create Agent') {
        // console.log('Do Create', DateObj);
        apiRequest.postCreateDelveryAgent(DateObj, (response) => {
          if (response) {
            // console.log(response);
            props.constructTostStates(response.msg.toUpperCase(), !response.status);
            if(response.status){
              setTimeout( props.agenstPage , 2000);
            }
            
          }
          props.showLoader(false);
        });
      }
      if (props.pageTitle == 'Edit Agent') {
        // console.log('props.agentId', props.agentId);
        // console.log('Do Edit with', DateObj);
        apiRequest.putUpdateDelveryAgent( props.agentId, DateObj, (response) => {
          if (response) {
              // console.log(response);
              props.constructTostStates(response.msg.toUpperCase(), !response.status);
            
            }
            props.showLoader(false);
          },
        );
      }
    }
  };
  
// to handel checkbox functionality
  const handelCheckBox = useCallback(
    (zoneId) => {
      // console.log(assignedZonesIdsArr, zoneId);
      if (assignedZonesIdsArr.includes(zoneId)) {
        // console.log('remove ', zoneId);
        setAssignedZonesIdsArr(
          assignedZonesIdsArr.filter((id) => id !== zoneId),
        );
      } else {
        // console.log('add ', zoneId);
        setAssignedZonesIdsArr([...assignedZonesIdsArr, zoneId]);
      }
    },
    [assignedZonesIdsArr],
  );


  return (
    <Page
      title={props.pageTitle}
      breadcrumbs={[{ content: 'Agents', onAction: props.agenstPage }]}
    >
      <Layout>
        <Layout.Section>
          <Banner title={props.pageTitle == 'Create Agent'? "Add delivery executive to assign the warehouse orders!":"Delivery executive updating notes"} status="info">
            <List type="bullet">
              <List.Item>All fields are mandatory</List.Item>
              <List.Item>A delivery agent can be assigned with multipal delivery zones</List.Item>
              {/* <List.Item>Green shirt</List.Item> */}
            </List>
          </Banner>
        </Layout.Section>

        <Layout.AnnotatedSection
          title="Delivery Executive Details"
          description="Put Delivery Executive Name and Email for access.
          Same email will be used for logging into dashbaord. Make sure you are putting the right email."
        >
          <Form>
            <FormLayout>
              <Card sectioned>
                <TextField
                  requiredIndicator
                  value={agentName}
                  label="Name"
                  onChange={handelAgentNameChange}
                  autoComplete="off"
                />
                <TextField
                  requiredIndicator
                  value={email}
                  type="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"
                  label="Account email"
                  onChange={handelEmailChange}
                  autoComplete="email"
                  onBlur={()=>validateEmail(email, props.constructTostStates)}
                />
                {props.pageTitle == 'Create Agent' && (
                  <TextField
                    requiredIndicator
                    value={password}
                    label="Password"
                    type="password"
                    onChange={handelPasswordChange}
                  />
                )}<br/>
                <TextStyle variation="positive">  Please save this info. User can login using the same information.</TextStyle>
                
                {/* </FormLayout> */}
              </Card>
              {/* </Layout.AnnotatedSection>

      <Layout.AnnotatedSection
        title="Address"
      // description="This address will appear on your invoices."
      > */}
              <Card sectioned>
                <TextField
                  requiredIndicator
                  value={address}
                  label="Address"
                  onChange={handelAddressChange}
                  autoComplete="off"
                />
                <TextField
                  requiredIndicator
                  value={apartment}
                  label="Apartment, suite, etc."
                  onChange={handelApartmentChange}
                  autoComplete="off"
                />
                {/* <TextField requiredIndicator value={} type="City" label="Account email" onChange={ }} autoComplete="email" /> */}

                <FormLayout>
                  <FormLayout.Group condensed>
                    <TextField
                      requiredIndicator
                      value={country}
                      label="Country/Region"
                      onChange={handelCountryChange}
                      autoComplete="off"
                    />
                    <TextField
                      requiredIndicator
                      value={state}
                      label="State"
                      onChange={handelStateChange}
                      autoComplete="off"
                    />
                    <TextField
                      requiredIndicator
                      value={pincode}
                      label="Pincode"
                      onChange={handelPincodeChange}
                      autoComplete="off"
                    />
                  </FormLayout.Group>
                </FormLayout>
                <TextField
                  requiredIndicator
                  value={phone}
                  label="Phone"
                  onChange={handelPhoneChange}
                  autoComplete="off"
                />
              </Card>
              {/* <Stack alignment="center" distribution="equalSpacing">
                <Button plain destructive>Cancel</Button><Button primary submit>Update</Button>
              </Stack> */}
            </FormLayout>
          </Form>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          title="Zone Access"
          description="Check mark zones to assign this delivery agent"
        >
          <Card sectioned>
            <ResourceList
              // emptyState={emptyStateMarkup}
              // selectedItems={handleImportedAction}
              // onSelectionChange={handleImportedAction}
              resourceName={{ singular: 'zone', plural: 'zones' }}
              items={avaliableZones?.map((zone, index) => {
                return {
                  id: zone._id,
                  name: zone.title,
                  // email: zone.email,
                  zone_address: zone.address?.address_1,
                  // onClick: handleImportedAction,
                  checkbox: (
                    <Checkbox
                      checked={
                        assignedZonesIdsArr.includes(zone._id)
                        // ||
                        // assignedZones.map((AssignedZone) => {
                        //   if (AssignedZone._id == zone._id) return true;
                        //   else return false;
                        // })
                      }
                      onChange={() => handelCheckBox(zone._id)}
                    />
                  ),
                };
              })}
              renderItem={(item) => {
                const { id, name, email, zone_address, checkbox } = item;
                // const shortcutActions = id
                //   ? [
                //       {
                //         content: 'View',
                //         onAction: () =>
                //           props.manageZonePage(id, 'Edit Manager'),
                //       },
                //     ]
                //   : null;
                // const media = <Avatar  size="medium" name={name} />;
                // const checkbox = <Checkbox checked={zones.includes(assignedzone)} onChange={()=>handelCheckBox(value)} />

                return (
                  <ResourceItem
                    id={id}
                    // url={url}
                    // media={checkbox}
                    // checkbox={checkbox}
                    accessibilityLabel={`View details for ${id}`}
                  // shortcutActions={shortcutActions}
                  >
                    <Stack>
                      {checkbox}
                      <h3>
                        <TextStyle variation="strong">{name}</TextStyle>
                      </h3>

                      <div>{zone_address}</div>
                    </Stack>
                  </ResourceItem>
                );
              }}
            />
          </Card>
          <br />
          <Stack alignment="center" distribution="equalSpacing">
            <Button plain destructive onClick={ props.agenstPage}>
              Back
            </Button>
            <Button primary onClick={handelSubmit}>
              {props.pageTitle == 'Edit Agent' ? 'Update' : 'Create'}
            </Button>
          </Stack>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
};

ManageAgent.getInitialProps = async (ctx) => {
  validateLogin(ctx);
  return{}
}

export default ManageAgent;
