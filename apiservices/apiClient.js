import axios from 'axios';
import CookiesCtx from 'next-cookies';
import CookiesJs from 'js-cookie';
import { enviornment } from '../utils/envConfig';

let baseUrl = enviornment.API_CLIENT.URL;
let version = '3';
let API_URL = baseUrl + '/api/v' + version + '/';

class AxiosClientProvider {
  constructor(ctx) {
    this.axiosClient;
    this.authToken;
    this.header;
    this.defaultOptions;
    this.instance;
    this.defaultOptions = {
      baseURL: API_URL,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };

    let apiToken = {};

    if (ctx) {
      apiToken = CookiesCtx(ctx);
    } else {
      apiToken = CookiesJs.get();
    }

    if (apiToken && apiToken.token) {
      // console.log('Token found in CTX/Cookie');
      this.defaultOptions.headers['token'] = apiToken.token;
    }
    if (apiToken?.tenant_id) {
      this.defaultOptions.headers['tenant_id'] = apiToken.tenant_id;
    }
    // else {
    //   console.log('No token found in CTX/Cookie ');
    // }
  }


  getClient() {
    // Setting up axios client with default url
    this.instance = axios.create(this.defaultOptions);
    return this.instance;
  }
}

export default AxiosClientProvider;
