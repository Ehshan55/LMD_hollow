
import AxiosClientProvider from "./apiClient";
import getAccessTokenFromShopify from '../utils/accessTokenFromShopify';

class PaymentService {
  constructor(ctx) {
    this.apiClient = new AxiosClientProvider(ctx);
    this.apiClient = this.apiClient.getClient();
  }

  /**
   * update display settings for the group
   * @param {*} body_json 
   * @param {*} cb 
   */
  async getActivePlan(cb, appContext) {

    let apiHeaders = this.apiClient.defaults.headers.common;
    if (!apiHeaders.token && appContext) {
      let shopifyAccessToken = await getAccessTokenFromShopify(appContext);
      this.apiClient.defaults.headers.common['app-bridge-token'] = shopifyAccessToken;
    }

    this.apiClient.get("billing/get-active-plan").then((response) => {
      if (response.data) {
        let dataObj = response.data;
        cb(dataObj);
      } else {
        cb();
      }
    }).catch((err) => {
      console.log("Some error occured in get category", err);
      cb();
    });

  }

  /**
   * Getting all display setting for a group
   * @param {*} cb 
   * @param {*} appContext 
   */

  async processPlanModification(plan_name, cb, appContext) {

    let apiHeaders = this.apiClient.defaults.headers.common;
    if (!apiHeaders.token && appContext) {
      let shopifyAccessToken = await getAccessTokenFromShopify(appContext);
      this.apiClient.defaults.headers.common['app-bridge-token'] = shopifyAccessToken;
    }

    this.apiClient.get("billing/create-recurring-application-charge?plan=" + plan_name, {}).then((response) => {
      if (response.data) {
        let dataObj = response.data;
        if (dataObj.redirect == true) {
          cb(dataObj);
        } else {
          cb();
        }
      } else {
        cb();
      }
    }).catch((err) => {
      console.log("Some error occured in get category", err);
      cb();
    });
  }

}
export default PaymentService;
