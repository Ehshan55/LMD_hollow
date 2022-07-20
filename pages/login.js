import { Button, Card, Checkbox, Form, FormLayout, Frame, Page, Select, Stack, TextField, Toast, Tooltip, TopBar } from '@shopify/polaris'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from "next/router"
import { useAuthentication } from '../contexts/AuthContext';
import validate_form from '../utils/validateForm';

const LoginPage = () => {
  const router = useRouter();
  // const { signinAdmin, SignInManager, signInDelivery } = useAuthentication();

  const [storeId, setStoreId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');

  const [active, setActive] = useState(false);
  const [tostMsg, setTostMsg] = useState(false);

  const [isStoreIdEmpty, setIsStoreIdEmpty] = useState(false);

  const [isEmailEmpty, setIsEmailEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isUserTypeEmpty, setIsUserTypeEmpty] = useState(false);

  const options = [
    { label: 'Select', value: '' },
    // { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'Delivery Agent', value: 'delivery' },

  ];

  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const constructActivateToast = useCallback((msg) => {
    setTostMsg(msg);
    setActive(true);
  }, []);

  // On login button click
  const submitHandler = () => {
    if (!storeId) {
      setIsStoreIdEmpty(true);
    } else if (!email) {
      setIsEmailEmpty(true);
    } else if (!password) {
      setIsPasswordEmpty(true);
    } else if (!userType) {
      setIsUserTypeEmpty(true);
    }
    else {
      router.push('/home');
      // const obj = { store_id: storeId, email, password, user_type: userType };
      // if (userType === 'admin')
      //   router.push('/');
      // else if (userType === 'manager')
      //   SignInManager(obj, (responseData) => {
      //     constructActivateToast(responseData);
      //   })
      // else if (userType === 'delivery')
      //   signInDelivery(obj, (responseData) => {
      //     constructActivateToast(responseData);
      //   });
    }
  }

  const toastMarkup = active ? (
    <Toast content={tostMsg} onDismiss={toggleActive} />
  ) : null;

  return (

    <Frame >
      <div style={{ background: "url('images/hero-bg-2.png')no-repeat center center / cover", height: "100vh" }} >
        <TopBar style={{ background: "transparent" }} />
        <Page narrowWidth style={{ background: "red" }}>
          <br /><br /><br /><br /><br />
          <Card title="Login" sectioned >
            <p>Fill User Credentials</p>
            <br />
            <Form onSubmit={submitHandler}>
              <FormLayout>
                <TextField requiredIndicator value={storeId.toUpperCase()} onChange={(value) => { setStoreId(value) }} label="Store ID" pattern=".{2,}" type="text" placeholder="GKT29Y" error={isStoreIdEmpty && 'Reqired'} onBlur={() => setIsStoreIdEmpty(validate_form(storeId))} onFocus={() => setIsStoreIdEmpty(false)} />
                <TextField requiredIndicator value={email} onChange={(value) => { setEmail(value) }} label="Account email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}" type="email" error={isEmailEmpty && 'Reqired'} onBlur={() => setIsEmailEmpty(validate_form(email))} onFocus={() => setIsEmailEmpty(false)} autoComplete="email" />
                <TextField requiredIndicator value={password} onChange={(value) => { setPassword(value) }} label="Account password" pattern=".{2,}" type="password" error={isPasswordEmpty && 'Reqired'} onBlur={() => setIsPasswordEmpty(validate_form(password))} onFocus={() => setIsPasswordEmpty(false)} />
                <Select requiredIndicator value={userType} onChange={(value) => { setUserType(value) }} options={options} label="Select User" error={isUserTypeEmpty && 'Reqired'} onBlur={() => setIsUserTypeEmpty(validate_form(userType))} onFocus={() => setIsUserTypeEmpty(false)} />

                <br />
                <Stack alignment="center" distribution="equalSpacing">
                  <Stack.Item fill>
                    {/* <Tooltip dismissOnMouseOut content="Please Contact your Admin">
                    <Button plain>Difficulty in Login?</Button>
                  </Tooltip> */}
                  </Stack.Item>
                  <Button primary submit>Login</Button>
                </Stack>
                <br />
              </FormLayout>
            </Form>
          </Card>
        </Page>
        {toastMarkup}

      </div>
    </Frame>
  )
}

export default LoginPage
