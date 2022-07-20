import AxiosClientProvider from './apiClient';

class AnalyticsApiService {
  constructor(ctx) {
    this.apiClient = new AxiosClientProvider(ctx);
    this.apiClient = this.apiClient.getClient();
  }

  /**
   * To signin into delivery agent dashboard
   * @param {login json data} body_json 
   * @param {callback} cb 
   */
  postSignInDelivery(body_json, cb) {
    this.apiClient
      .post('users/login', body_json)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj) {
            cb(dataObj);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured while signin', err);
        cb();
      });
  }

  /**
   * To get Delivery's user profile data according to saved token
   * @param {callback} cb 
   */
  getDeliveryProfile(cb) {
    this.apiClient
      .get('users/profile')
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status == true) {
            cb(dataObj.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in getDeliveryProfile', err);
        cb();
      });
  }
  /**
   * To get Delivery's dashboard all orders status analytics
   * @param {callback} cb 
   */
  getDeliveryDashboardAnalytics(cb) {
    this.apiClient
      .get('delivery/dashboard/analytics')
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status == true) {
            cb(dataObj.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in getDeliveryDashboardAnalytics', err);
        cb();
      });
  }
  /**
   * To get Data for Delivery's dashboard
   * @param {*} pageNo 
   * @param {callback} cb 
   */
  getDeliveryDashboardOrders(pageNo, size, delivery_status, search, search_type, cb) {
    this.apiClient
      .get(`delivery/orders/list?page_number=${pageNo}&size=${size}&delivery_status=${delivery_status}&search=${search}&search_type=${search_type}`)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status == true) {
            // console.log('inside getOrdersDashboard>>>>>> ', response.data)
            cb(dataObj.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in getDeliveryDashboardOrders', err);
        cb();
      });
  }
  /**
   * To Get Delivery Agent Order Details by orderId
   * @param {*} order_id 
   * @param {callback} cb 
   */
  getDeliveryOrdersDetailsById(order_id, cb) {
    this.apiClient
      .get(`delivery/orders/details/${order_id}`)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj) {
            cb(dataObj.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in getDeliveryOrdersDetailsById', err);
        cb();
      });
  }
  /**
 * To Update Delivery Agent Order Details by orderId with body data object
 * @param {*} order_id 
 * @param {Updating data JSON} body 
 * @param {callback} cb 
 */
  putDeliveryOrderUpdateById(order_id, body, cb) {
    this.apiClient
      .put(`delivery/orders/update_delivery_status/${order_id}`, body)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status == true) {
            cb(dataObj);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in putDeliveryOrderUpdateById', err);
        cb();
      });
  }

  /**
 * To get delivery route
 * @param {callback} cb 
 */
  getDeliveryRoutesForDelivery(cb) {
    this.apiClient
      .get(`delivery/routes/list`)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status == true) {
            cb(dataObj.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in getDeliveryRoutesForDelivery', err);
        cb();
      });
  }

  /**
 * To get delivery route
 * @param {callback} cb 
 */
  getDeliveryRouteDetailsForDelivery(route_id, cb) {
    this.apiClient
      .get(`delivery/routes/list_by_id/${route_id}`)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status == true) {
            cb(dataObj.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in getDeliveryRoutesForDelivery', err);
        cb();
      });
  }
}

export default AnalyticsApiService;
