import React, { createContext, useState, useContext, useEffect } from 'react';

import Router from 'next/router';

import CookiesJs from 'js-cookie';
import CookiesCtx from 'next-cookies';
import LoaderContext from './LoaderContext';

import adminApiService from '../apiservices/adminApiService';
const adminApiRequestService = new adminApiService();

import managerApiService from '../apiservices/managerApiService';
const managerApiRequestService = new managerApiService();

import deliveryApiService from '../apiservices/deliveryApiService';
const deliveryApiRequestService = new deliveryApiService();



const AuthContext = createContext();

export function useAuthentication() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [cookieToken, setCookieToken] = useState(null);
  const [authentication] = React.useState(true);
  const [tenantId, setTenantId] = useState(null);

  const { showLoader } = React.useContext(LoaderContext);

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = CookiesJs.get('token');
      if (token) {
        setCookieToken(token);
      }
    }
    loadUserFromCookies();
  }, []);

  const SignInAdmin = async (token, tenant_id) => {
    showLoader(true);

    adminApiRequestService.postValidateAdmin(token, tenant_id, (response) => {
      if (response) {
        if (response.data.token) {
          let apiResponse = response.data;
          let storeObject = apiResponse.store;

          CookiesJs.set('token', apiResponse.token, { expires: 1000 });
          CookiesJs.set('store_url', storeObject.store_url, { expires: 1000 });
          CookiesJs.set('tenant_id', storeObject.tenant_id, { expires: 1000 });
          CookiesJs.set('store_id', storeObject.store_id, { expires: 1000 });

          setCookieToken(apiResponse.token);
          setTenantId(storeObject.tenant_id);

          if (apiResponse.new_install) {
            Router.push('/admin/setup');
          } else {
            Router.push('/orders');
          }

        } else {
          console.log('Some Error occured, Please try again!');
        }
      } else {
        console.log('Please Check Email/Password.');
      }
      showLoader(false);
    });
  };

  const SignInManager = async (jsonObj, cb) => {

    showLoader(true);

    managerApiRequestService.postSignInManager(jsonObj, (response) => {

      if (response.status == true) {
        let apiResponse = response.data;
        if (apiResponse.token) {

          CookiesJs.set('token', apiResponse.token, { expires: 1000 });
          setCookieToken(apiResponse.token);

          CookiesJs.set('store_url', apiResponse.store_url, { expires: 1000 });
          CookiesJs.set('user_type', apiResponse.user_type, { expires: 1000 });
          CookiesJs.set('store_id', jsonObj.store_id, { expires: 1000 });

          cb(response.msg);
          Router.replace('/manager/dashboard');
        } else {
          cb(response.msg);
        }
      } else {
        cb(response.msg);
      }
      showLoader(false);
    });
  };

  const signInDelivery = async (jsonObj, cb) => {

    showLoader(true);
    deliveryApiRequestService.postSignInDelivery(jsonObj, (response) => {
      if (response.status == true) {
        let apiResponse = response.data;
        if (apiResponse.token) {

          CookiesJs.set('token', apiResponse.token, { expires: 1000 });
          setCookieToken(apiResponse.token);

          CookiesJs.set('store_url', apiResponse.store_url, { expires: 1000 });
          CookiesJs.set('user_type', apiResponse.user_type, { expires: 1000 });
          CookiesJs.set('store_id', jsonObj.store_id, { expires: 1000 });

          cb(response.msg);
          Router.push('/delivery/dashboard');
        } else {
          cb(response.msg);
        }
      } else {
        cb(response.msg);
      }
      showLoader(false);
    });
  };

  const clearCookies = () => {
    CookiesJs.remove('token');
    CookiesJs.remove('store_url');
    CookiesJs.remove('user_type');
    CookiesJs.remove('store_id');
    CookiesJs.remove('orderId');
    CookiesJs.remove('userId');
    setCookieToken(null);

  }




  const logout = () => {
    CookiesJs.remove('token');
    CookiesJs.remove('store_url');
    CookiesJs.remove('user_type');
    CookiesJs.remove('store_id');
    CookiesJs.remove('orderId');
    CookiesJs.remove('userId');
    setCookieToken(null);
    if (process.browser) {
      // Client-side-only code
      if (window) {
        window.location.pathname = '/';
      }
    }
    console.log('You have benn logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        authentication,
        cookieToken,
        SignInAdmin,
        SignInManager,
        signInDelivery,
        logout,
        clearCookies
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function validateLogin(ctx) {
  let apiToken = {};

  if (ctx) {
    apiToken = CookiesCtx(ctx);
  } else {
    apiToken = CookiesJs.get();
  }

  if (apiToken && apiToken.token) {
  } else {
    if (ctx?.req) {

      ctx.res.writeHead(302, { Location: '/LoginPage' });
      ctx.res.end();
      return;
    } else {

      Router.push('/LoginPage');
    }
  }
}
