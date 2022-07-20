import AxiosClientProvider from './apiClient';

class OrderService {
  constructor(ctx) {
    this.apiClient = new AxiosClientProvider(ctx);
    this.apiClient = this.apiClient.getClient();
  }

  adminSignIn(body_json, cb) {
    this.apiClient
      .post('candidate/account/login', body_json)
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  signInManager(body_json, cb) {
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
        console.log('Some error occured in signInManager', err);
        cb();
      });
  }

  signInDelivery(body_json, cb) {
    this.apiClient
      .post('users/login', body_json)
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
        console.log('Some error occured while signin', err);
        cb();
      });
  }

  getUserProfile(cb) {
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

  getOrdersForDelivery(cb) {
    this.apiClient
      .get('delivery/orders/list?page_number=1&size=30')
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
        console.log('Some error occured in get Orders For Delivery', err);
        cb();
      });
  }

  getOrderDetailsForDelivery(query, cb) {
    this.apiClient
      .get(`delivery/orders/details/${query}`)
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
        console.log(
          'Some error occured in get Order Details For Delivery',
          err,
        );
        cb();
      });
  }

  updateOrderDeliveryStatus(query, body_json, cb) {
    // console.log("API Request : ", body_json);
    this.apiClient
      .put(`manager/orders/update_delivery_status/${query}`, body_json)
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
        console.log('Some error occured in update Order Delivery Status', err);
        cb();
      });
  }

  // ------------------------------------------------------------------V2 APIs-----------------------------

  getDashboardAnalytics(cb) {
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
        console.log('Some error occured in get Orders For Delivery', err);
        cb();
      });
  }

  getOrdersDashboard(pageNo, cb) {
    this.apiClient
      .get(`manager/orders/list?page_number==${pageNo}`)
      .then((response) => {
        if (response.data) {
          // console.log('inside getOrdersDashboard>>>>>> ',response.data)
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

  getOrderDetails(query, cb) {
    this.apiClient
      .get(`delivery/orders/details/${query}`)
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  postAssignOrder(query, body, cb) {
    this.apiClient
      .post(`manager/orders/assign/${query}`, { user_ref: body })
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  postAssignBulkOrder(body, cb) {
    this.apiClient
      .post('manager/orders/bulk_assign', body)
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  //============================================------------------------------------------------------=============================================

  // -------------------============================================ V2 warehouse ===============================================---------------------

  // /**
  //  * Use this api to enable a blocked/disabled customer
  //  * Check the follwing params type to make the request.
  //  * @param {Customer _id from customer list data} customer_id
  //  * @param {Callback Function} cb
  //  */
  listWarehouse(cb) {
    this.apiClient
      .get('warehouse/list')
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  // /**
  //  * Use this api to disable/Block a active customer
  //  * Check the follwing params type to make the request.
  //  * @param {Customer _id from customer list data} customer_id
  //  * @param {Callback Function} cb
  //  */
  listWarehouseById(id, cb) {
    // let body_json = {
    //   _id: customer_id,
    //   is_enabled: false,
    // };
    this.apiClient
      .get(`warehouse/list/${id}`)
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  // /**
  //  * Use this api to get the list of all customer for admin panel
  //  * Check the followind params to gettting the customer list.
  //  * @param {Callback Function} cb
  //  */
  postCreateWarehouse(body, cb) {
    this.apiClient
      .post('warehouse/create', body)
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  // /**
  //  * Use this api to get the customer profile details using customer _id
  //  * Check the following params details to get the values.
  //  * @param {Customer _id from customer list apis.} customer_id
  //  * @param {Callback Function} cb
  //  */

  postUpdateWarehouse(id, body, cb) {
    this.apiClient
      .post(`warehouse/update/${id}`, body)
      .then((response) => {
        // console.log(response)
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
        console.log('Some error occured in update category', err);
        cb();
      });
  }

  deleteWarehouse(id, cb) {
    this.apiClient
      .delete('warehouse/delete', id)
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  //============================================------------------------------------------------------=============================================

  // -------------------============================================ V2 warehouse Zone ===============================================---------------------

  listZones(cb) {
    this.apiClient
      .get('zone/list')
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  // /**
  //  * Use this api to disable/Block a active customer
  //  * Check the follwing params type to make the request.
  //  * @param {Customer _id from customer list data} customer_id
  //  * @param {Callback Function} cb
  //  */
  listZoneById(id, cb) {
    // let body_json = {
    //   _id: customer_id,
    //   is_enabled: false,
    // };
    this.apiClient
      .get(`zone/list/${id}`)
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  // /**
  //  * Use this api to get the list of all customer for admin panel
  //  * Check the followind params to gettting the customer list.
  //  * @param {Callback Function} cb
  //  */
  postCreateZone(body, cb) {
    this.apiClient
      .post('zone/create', body)
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  // /**
  //  * Use this api to get the customer profile details using customer _id
  //  * Check the following params details to get the values.
  //  * @param {Customer _id from customer list apis.} customer_id
  //  * @param {Callback Function} cb
  //  */

  postUpdateZone(id, body, cb) {
    this.apiClient
      .post(`zone/update/${id}`, body)
      .then((response) => {
        // console.log(response)
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
        console.log('Some error occured in update category', err);
        cb();
      });
  }

  deleteZone(id, cb) {
    this.apiClient
      .delete('zone/delete', id)
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  //============================================------------------------------------------------------=============================================

  // -------------------============================================ V2 Admin Manager ===============================================---------------------

  listManagers(cb) {
    this.apiClient
      .get('manager/list')
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  // /**
  //  * Use this api to disable/Block a active customer
  //  * Check the follwing params type to make the request.
  //  * @param {Customer _id from customer list data} customer_id
  //  * @param {Callback Function} cb
  //  */
  listManagerById(id, cb) {
    this.apiClient
      .get(`manager/list/${id}`)
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  // /**
  //  * Use this api to get the list of all customer for admin panel
  //  * Check the followind params to gettting the customer list.
  //  * @param {Callback Function} cb
  //  */
  postCreateManager(body, cb) {
    this.apiClient
      .post('manager/create', body)
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  // /**
  //  * Use this api to get the customer profile details using customer _id
  //  * Check the following params details to get the values.
  //  * @param {Customer _id from customer list apis.} customer_id
  //  * @param {Callback Function} cb
  //  */

  postUpdateManager(id, body, cb) {
    this.apiClient
      .post(`manager/update/${id}`, body)
      .then((response) => {
        // console.log(response)
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
        console.log('Some error occured in update category', err);
        cb();
      });
  }

  //============================================------------------------------------------------------=============================================

  // -------------------============================================ V2 settings ===============================================---------------------
  listSettings(cb) {
    this.apiClient
      .get('settings/list')
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  postUpdateSettings(body, cb) {
    this.apiClient
      .post('settings/update', body)
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
        console.log('Some error occured in update category', err);
        cb();
      });
  }

  //============================================------------------------------------------------------=============================================

  // -------------------============================================ V2 Managers Dashboard ===============================================---------------------

  listAgents(cb) {
    this.apiClient
      .get('manager/delivery_account/list?page_number=1&size=5')
      .then((response) => {
        // console.log(response);
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
        console.log('Some error occured in listAgents', err);
        cb();
      });
  }

  postCreateAgent(body, cb) {
    this.apiClient
      .post('manager/delivery_account/add', body)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status == true) {
            cb(dataObj.data);
          } else {
            console.log(response.msg);
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in update category', err);
        cb();
      });
  }

  listAgentById(id, cb) {
    this.apiClient
      .get(`manager/delivery_account/details/${id}`)
      .then((response) => {
        // console.log(response);
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
        console.log('Some error occured in get category', err);
        cb();
      });
  }

  listAllZones(cb) {
    this.apiClient
      .get('manager/zones/list')
      .then((response) => {
        // console.log(response);
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
        console.log('Some error occured in listAllZones', err);
        // cb();
      });
  }

  postUpdateAgent(id, body, cb) {
    this.apiClient
      .put(`manager/delivery_account/update/${id}`, body)
      .then((response) => {
        // console.log(response);
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
        console.log('Some error occured in update category', err);
        cb();
      });
  }
}

export default OrderService;
