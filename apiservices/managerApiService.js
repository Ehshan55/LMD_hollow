import AxiosClientProvider from './apiClient';

class ManagerApiService {
  constructor(ctx) {
    this.apiClient = new AxiosClientProvider(ctx);
    this.apiClient = this.apiClient.getClient();
  }

  /**
     * To signin into manager dashboard
     * @param {login json data} body_json 
     * @param {callback} cb 
     */
  postSignInManager(body_json, cb) {
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
        console.log('Some error occured while postSignInManager', err);
        cb();
      });
  }

  /**
   * To get Manager's user profile data according to saved token
   * @param {callback} cb 
   */
  getManagerProfile(cb) {
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
        console.log('Some error occured in getUserProfile', err);
        cb();
      });
  }
  /**
   * To get Manager's dashboard all orders status analytics
   * @param {callback} cb 
   */
  getManagerDashboardAnalytics(cb) {
    this.apiClient
      .get('manager/dashboard/analytics')
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
        console.log('Some error occured in getManagerDashboardAnalytics', err);
        cb();
      });
  }
  /**
   * To get Data for Manager's dashboard
   * @param {*} pageNo 
   * @param {callback} cb 
   */
  getManagerDashboardOrders(pageNo, size, delivery_status, search, search_type, cb) {
    this.apiClient
      .get(`manager/orders/list?page_number=${pageNo}&size=${size}&delivery_status=${delivery_status}&search=${search}&search_type=${search_type}`)
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
        console.log('Some error occured in getOrdersDashboard', err);
        cb();
      });
  }

  /**
 * To Get Manager's Order Details by orderId
 * @param {*} order_id 
 * @param {callback} cb 
 */
  getManagerOrdersDetailsById(order_id, cb) {
    this.apiClient
      .get(`manager/orders/details/${order_id}`)
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
        console.log('Some error occured in getManagerOrdersDetailsById', err);
        cb();
      });
  }
  /**
 * To Update Manager's Order Details by orderId with body data object
 * @param {*} order_id 
 * @param {Updating data JSON} body 
 * @param {callback} cb 
 */
  putManagerOrderUpdateById(order_id, body, cb) {
    this.apiClient
      .put(`manager/orders/update_Manager_status/${order_id}`, body)
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
        console.log('Some error occured in putManagerOrderUpdateById', err);
        cb();
      });
  }

  /**
* To assign order to Delivery Agent from Manager's Order Details page by orderId and user_ref
* @param {*} order_id 
* @param {Delivery agent _id} user_ref 
* @param {callback} cb 
*/
  postAssignOrdersToDeliveryExecutive(order_id, user_ref, cb) {
    this.apiClient
      .post(`manager/orders/assign/${order_id}`, user_ref)
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
        console.log('Some error occured in postAssignOrdersToDeliveryExecutive', err);
        cb();
      });
  }

  /**
* To assign orders to Delivery Agent from Manager's Dashboard page by orderIds
* @param {selected order_ids object} order_ids 
* @param {callback} cb 
*/
  postAssignBulkOrdersToDeliveryExecutive(order_ids, cb) {
    this.apiClient
      .post(`manager/orders/bulk_assign`, order_ids)
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
        console.log('Some error occured in postAssignBulkOrdersToDeliveryExecutive', err);
        cb();
      });
  }

  // ----------------------------------------------------------------Managing Delivery Agents Api

  /**
   * To Get All Delivery Agents
   * @param {navigating page no} page_no 
   * @param {list view size} view_size 
   * @param {callback} cb 
   */
  getAllDeliveryAgents(page_no, view_size, cb) {
    this.apiClient
      .get(`manager/delivery_account/list?page_number=${page_no}&size=${view_size}`)
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
        console.log('Some error occured in getAllDeliveryAgents', err);
        cb();
      });
  }

  /**
* To Delivery agent by their id
* @param {*} delivery_agent_id 
* @param {callback} cb 
*/
  getDeliveryAgentDetailsById(delivery_agent_id, cb) {
    this.apiClient
      .get(`manager/delivery_account/details/${delivery_agent_id}`)
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
        console.log('Some error occured in getDeliveryAgentDetailsById', err);
        cb();
      });
  }

  /**
* To Create delivery agent
* @param {delivery agent JSON data} body 
* @param {callback} cb 
*/
  postCreateDelveryAgent(body, cb) {
    this.apiClient
      .post(`manager/delivery_account/add`, body)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status) {
            cb(dataObj);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in postCreateDelveryAgent', err);
        cb();
      });
  }

  /**
* To Update delivery agent by Id with body data
* @param {delivery agent _id} delivery_agent_id 
* @param {updating data} body 
* @param {callback} cb 
*/
  putUpdateDelveryAgent(delivery_agent_id, body, cb) {
    this.apiClient
      .put(`manager/delivery_account/update/${delivery_agent_id}`, body)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status) {
            cb(dataObj);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in putUpdateDelveryAgent', err);
        cb();
      });
  }

  /**
* To Get All Delivery Zones
* @param {callback} cb 
*/
  getAllDeliveryZones(cb) {
    this.apiClient
      .get(`manager/zones/list`)
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
        console.log('Some error occured in getAllDeliveryZones', err);
        cb();
      });
  }
}

export default ManagerApiService;
