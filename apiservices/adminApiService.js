import AxiosClientProvider from './apiClient';

class AdminApiService {
  constructor(ctx) {
    this.apiClient = new AxiosClientProvider(ctx);
    this.apiClient = this.apiClient.getClient();
  }

  /**
       * To validate admin from user_auth page
       * @param {token for validation} token 
       * @param {callback} cb 
       */
  postValidateAdmin(token, tenant_id, cb) {
    this.apiClient
      .post('users/auth-token', { token, tenant_id })
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
        console.log('Some error occured while postValidateAdmin', err);
        cb();
      });
  }



  /**
     * To signin into Admin dashboard
     * @param {login json data} body_json 
     * @param {callback} cb 
     */
  postSignInAdmin(body_json, cb) {
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
        console.log('Some error occured while postSignInAdmin', err);
        cb();
      });
  }

  /**
   * To get Admin's user profile data according to saved token
   * @param {callback} cb 
   */
  getAdminProfile(cb) {
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
        console.log('Some error occured in getAdminProfile', err);
        cb();
      });
  }
  /**
   * To get Admin's dashboard all orders status analytics
   * @param {callback} cb 
   */
  getAdminDashboardAnalytics(cb) {
    this.apiClient
      .get('admin/dashboard/analytics')
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
        console.log('Some error occured in getAdminDashboardAnalytics', err);
        cb();
      });
  }
  /**
   * To get Old Unsyncked Shopify orders
   * @param {callback} cb 
   */
  getOldOrders(cb) {
    this.apiClient
      .get(`admin/shopify/order-list`)
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
        console.log('Some error occured in getOldOrders', err);
        cb();
      });
  }
  /**
   * To get Data for Admin's dashboard
   * @param {Page number for pagination} page_number 
   * @param {Order list size for each page} size 
   * @param {Order Type for filteration} delivery_status 
   * @param {callback} cb 
   */
  getAdminDashboardOrders(page_type, page_number, size, delivery_status, search, search_type, zone_id, cb) {
    this.apiClient
      .get(`admin/orders/list?page_type=${page_type}&page_number=${page_number}&size=${size}&delivery_status=${delivery_status}&search=${search}&search_type=${search_type}&zone_id=${zone_id}`).then((response) => {
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
      }).catch((err) => {
        console.log('Some error occured in getOrdersDashboard', err);
        cb();
      });
  }

  /**
   * To get Data for Admin's dashboard
   * @param {Page number for pagination} page_number 
   * @param {Order list size for each page} size 
   * @param {Order Type for filteration} delivery_status 
   * @param {callback} cb 
   */
  getAdminOrderSearch(search_type, search_term, order_type, route_id, cb) {
    this.apiClient.get(`admin/orders/search?search_type=${search_type}&search_term=${search_term}&order_type=${order_type}&route_id=${route_id}`).then((response) => {
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
    }).catch((err) => {
      console.log('Some error occured in getOrdersDashboard', err);
      cb();
    });
  }

  /**
 * To Get Admin's Order Details by orderId
 * @param {*} order_id 
 * @param {callback} cb 
 */
  getAdminOrdersDetailsById(order_id, cb) {
    this.apiClient
      .get(`admin/orders/details/${order_id}`)
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
        console.log('Some error occured in getAdminOrdersDetailsById', err);
        cb();
      });
  }
  /**
 * To Update Admin's Order Details by orderId with body data object
 * @param {updating order id} order_id 
 * @param {Updating data JSON} body 
 * @param {callback} cb 
 */
  putAdminOrderDeliveryStatusUpdateById(order_id, body, cb) {
    this.apiClient
      .put(`admin/orders/update_delivery_status/${order_id}`, body)
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
        console.log('Some error occured in putAdminOrderDeliveryStatusUpdateById', err);
        cb();
      });
  }

  /**
* To assign order to Delivery Agent from Admin's Order Details page by orderId and user_ref
* @param {*} order_id 
* @param {Delivery agent _id} user_ref 
* @param {callback} cb 
*/
  postAssignOrdersToDeliveryExecutive(order_id, user_ref, cb) {
    this.apiClient
      .post(`admin/orders/assign/${order_id}`, user_ref)
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
* To assign orders to Delivery Agent from Admin's Dashboard page by orderIds
* @param {selected order_ids object} order_ids 
* @param {callback} cb 
*/
  postAssignBulkOrdersToDeliveryExecutive(order_ids, cb) {
    this.apiClient
      .post(`admin/orders/bulk_assign`, { order_ids: order_ids })
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

  // ----------------------------------------------------------------Managing Warehouse Api

  /**
* To Get All Warehouses
* @param {callback} cb 
*/
  getAllWarehouses(cb) {
    this.apiClient
      .get('admin/warehouse/list')
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

  /**
* To get Warehouse by id
* @param {*} warehouse_id 
* @param {callback} cb 
*/
  getWarehouseDetailsById(warehouse_id, cb) {
    this.apiClient
      .get(`admin/warehouse/details/${warehouse_id}`)
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
        console.log('Some error occured in getWarehouseDetailsById', err);
        cb();
      });
  }

  /**
* To Create Warehouse
* @param {Warehouse JSON data} body 
* @param {callback} cb 
*/
  postCreateWarehouse(body, cb) {
    this.apiClient
      .post(`admin/warehouse/add`, body)
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
        console.log('Some error occured in postCreateWarehouse', err);
        cb();
      });
  }

  /**
* To Update Warehouse by Id with body data
* @param {Warehouse _id} warehouse_id 
* @param {updating data} body 
* @param {callback} cb 
*/
  putUpdateWarehouse(warehouse_id, body, cb) {
    this.apiClient
      .put(`admin/warehouse/update/${warehouse_id}`, body)
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
        console.log('Some error occured in putUpdateWarehouse', err);
        cb();
      });
  }


  // ----------------------------------------------------------------Managing Zones Api
  /**
* To Get All Delivery Zones
* @param {callback} cb 
*/
  getAllDeliveryZones(cb) {
    this.apiClient
      .get(`admin/zones/list`)
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

  /**
* To Get All Delivery Zones by Warehouse
* @param {*} warehouse_id 
* @param {callback} cb 
*/
  getDeliveryZonesByWarehouseId(warehouse_id, cb) {
    this.apiClient
      .get(`admin/zones/listByWarehouse/${warehouse_id}`)
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
        console.log('Some error occured in getDeliveryZonesByWarehouseId', err);
        cb();
      });
  }

  /**
* To get Delivery Zones by id
* @param {*} zone_id 
* @param {callback} cb 
*/
  getZoneDetailsById(zone_id, cb) {
    this.apiClient
      .get(`admin/zones/details/${zone_id}`)
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
        console.log('Some error occured in getZoneDetailsById', err);
        cb();
      });
  }

  /**
  * To Create Zone
  * @param {Zone JSON data} body 
  * @param {callback} cb 
  */
  postCreateZone(warehouse_id, body, cb) {
    this.apiClient
      .post(`admin/zones/add/${warehouse_id}`, body)
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
        console.log('Some error occured in postCreateZone', err);
        cb();
      });
  }

  /**
  * To Update Zone by Id with body data
  * @param {Zone_id} zone_id 
  * @param {updating data} body 
  * @param {callback} cb 
  */
  putUpdateZone(zone_id, body, cb) {
    this.apiClient
      .put(`admin/zones/update/${zone_id}`, body)
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
        console.log('Some error occured in putUpdateZone', err);
        cb();
      });
  }


  // ----------------------------------------------------------------Managing Managers Api
  /**
 * To Get All Managers
 * @param {callback} cb 
 */
  getAllManagers(cb) {
    this.apiClient
      .get(`admin/manager_account/list`)
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
        console.log('Some error occured in getAllManagers', err);
        cb();
      });
  }

  /**
  * To get Manager by id
  * @param {*} manager_id 
  * @param {callback} cb 
  */
  getManagerDetailsById(manager_id, cb) {
    this.apiClient
      .get(`admin/manager_account/details/${manager_id}`)
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
        console.log('Some error occured in getManagerDetailsById', err);
        cb();
      });
  }

  /**
  * To Create Manager
  * @param {Zone JSON data} body 
  * @param {callback} cb 
  */
  postCreateManager(body, cb) {
    this.apiClient
      .post(`admin/manager_account/add`, body)
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
        console.log('Some error occured in postCreateManager', err);
        cb();
      });
  }

  /**
  * To Update Manager by Id with body data
  * @param {Manager_id} Manager_id 
  * @param {updating data} body 
  * @param {callback} cb 
  */
  putUpdateManager(Manager_id, body, cb) {
    this.apiClient
      .put(`admin/manager_account/update/${Manager_id}`, body)
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
        console.log('Some error occured in putUpdateManager', err);
        cb();
      });
  }

  /**
* To Update Password of manager agent by Id 
* @param {manager _id} manager_id 
* @param {new password} new_password 
* @param {callback} cb 
*/
  putUpdatePasswordManager(manager_id, new_password, cb) {
    this.apiClient
      .put(`admin/manager_account/update-password/${manager_id}`, { new_password })
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
        console.log('Some error occured in putUpdatePasswordManager', err);
        cb();
      });
  }


  /**
* To delete/Archive manager by Id
* @param {callback} cb 
*/
  putArchiveManager(manager_id, cb) {
    this.apiClient.put(`admin/manager_account/archive/${manager_id}`).then((response) => {
      if (response.data) {
        let dataObj = response.data;
        if (dataObj.status) {
          cb(response.data);
        } else {
          cb();
        }
      } else {
        cb();
      }
    }).catch((err) => {
      console.log('Some error occured in archiveManager', err);
      cb();
    });
  }



  // -------------------------------------------------------------------Managing Delivery executives in Admin
  /**
  * To Get All Delivery Agents
  * @param {callback} cb 
  */
  getAllDeliveryAgents(cb) {
    this.apiClient.get(`admin/delivery_account/list`).then((response) => {
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
    }).catch((err) => {
      console.log('Some error occured in getAllDeliveryAgents', err);
      cb();
    });
  }

  /**
   * Get all delivery agents irr respective of access and zones
   * @param {*} cb 
   */

  getAllDeliveryAgentsList(cb) {
    this.apiClient.get(`admin/delivery_account/list-all`).then((response) => {
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
    }).catch((err) => {
      console.log('Some error occured in getAllDeliveryAgents', err);
      cb();
    });
  }

  /**
* To Delivery agent by their id
* @param {*} executive_id 
* @param {callback} cb 
*/
  getDeliveryAgentDetailsById(executive_id, cb) {
    this.apiClient
      .get(`admin/delivery_account/details/${executive_id}`)
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
      .post(`admin/delivery_account/add`, body)
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
* @param {delivery agent _id} executive_id 
* @param {updating data} body 
* @param {callback} cb 
*/
  putUpdateDelveryAgent(executive_id, body, cb) {
    this.apiClient
      .put(`admin/delivery_account/update/${executive_id}`, body)
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
* To Update Password of delivery agent by Id 
* @param {delivery agent _id} executive_id 
* @param {new password} new_password 
* @param {callback} cb 
*/
  putUpdatePasswordDelveryAgent(executive_id, new_password, cb) {
    this.apiClient
      .put(`admin/delivery_account/update-password/${executive_id}`, { new_password })
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
        console.log('Some error occured in putUpdatePasswordDelveryAgent', err);
        cb();
      });
  }

  /**
* To delete delivery agent by Id
* @param {callback} cb 
*/
  putArchiveDeliveryExecutive(executive_id, cb) {
    this.apiClient.put(`admin/delivery_account/archive/${executive_id}`).then((response) => {
      if (response.data) {
        let dataObj = response.data;
        if (dataObj.status) {
          cb(response.data);
        } else {
          cb();
        }
      } else {
        cb();
      }
    }).catch((err) => {
      console.log('Some error occured in archiveDeliveryExecutive', err);
      cb();
    });
  }

  // ===================================================================end


  // ----------------------------------------------------------------App Settings Api
  /**
 * To Get App settings
 * @param {callback} cb 
 */
  getAppSettings(cb) {
    this.apiClient.get(`admin/settings/list`).then((response) => {
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
    }).catch((err) => {
      console.log('Some error occured in getAppSettings', err);
      cb();
    });
  }

  /**
  * To Update App settings
  * @param {callback} cb 
  */
  postUpdateAppSettings(body, cb) {
    this.apiClient
      .post(`admin/settings/update`, body)
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
        console.log('Some error occured in postAppSettings', err);
        cb();
      });
  }

  postStartShopifyOrderSync(body, cb) {
    this.apiClient.post('admin/settings/sync-shopify-orders', body).then((response) => {
      if (response.data) {
        let dataObj = response.data;
        cb(dataObj);
      } else {
        cb();
      }
    }).catch((err) => {
      console.log('Some error occured in update category', err);
      cb();
    });
  }

  // --------------------------------- Delivery map routes --------------------------------

  /**
  * To request for missing location update
  * @param {callback} cb 
  */
  postRequestLocationUpdate(order_id, cb) {
    this.apiClient
      .post(`admin/orders/request-location/${order_id}`)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj) {
            cb(response.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in postRequestLocationUpdate', err);
        cb();
      });
  }
  /**
  * To Set Map Route
  * @param {callback} cb 
  */
  postCreateDeliveryMapRoute(arranged_order_list_and_coordinates, zone_id, cb) {
    this.apiClient
      .post(`admin/routes/create/${zone_id}`, arranged_order_list_and_coordinates)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status) {
            cb(response.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in postCreateDeliveryMapRoute', err);
        cb();
      });
  }


  /**
* To Create quick routes
* @param {callback} cb 
*/
  postCreateDeliveryQuickMapRoute(arranged_order_list_and_coordinates, cb) {
    this.apiClient
      .post(`admin/routes/quick-routes`, arranged_order_list_and_coordinates)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status) {
            cb(response.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in postCreateDeliveryQuickMapRoute', err);
        cb();
      });
  }

  /**
* To Fetch quick routes
* @param {callback} cb 
*/
  getQuickMapRouteByRouteId(route_id, cb) {
    this.apiClient
      .get(`admin/routes/list-quick-route-details/${route_id}`)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status) {
            cb(dataObj.data.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in getQuickMapRouteByRouteId', err);
        cb();
      });
  }

  /**
* To Update Map Route
* @param {callback} cb 
*/
  putUpdateDeliveryMapRoute(arranged_order_list_and_data, route_id, cb) {
    this.apiClient
      .put(`admin/routes/update/${route_id}`, arranged_order_list_and_data)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status) {
            cb(response.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in putUpdateDeliveryMapRoute', err);
        cb();
      });
  }


  /**
* To find Map Route by zone id
* @param {callback} cb 
*/
  getDeliveryMapRouteByZoneId(zone_id, route_id, cb) {
    this.apiClient
      .post(`admin/routes/list_by_id/${zone_id}`, { route_id: route_id })
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (response.status) {
            cb(dataObj.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in getDeliveryMapRouteByZoneId', err);
        cb();
      });
  }


  /**
* To find all Map Routes
* @param {callback} cb 
*/
  getAllDeliveryMapRoutes(cb) {
    this.apiClient
      .get(`admin/routes/list`)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status) {
            cb(response.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in getAllDeliveryMapRoutes', err);
        cb();
      });
  }

  /**
* To find AllDeliveryQuickMapRoutes
* @param {callback} cb 
*/
  getAllDeliveryQuickMapRoutes(type, cb) {
    this.apiClient.post(`admin/routes/list-quick-routes`, { route_type: type }).then((response) => {
      if (response.data) {
        let dataObj = response.data;
        if (dataObj.status) {
          cb(response.data);
        } else {
          cb();
        }
      } else {
        cb();
      }
    }).catch((err) => {
      console.log('Some error occured in getAllDeliveryMapRoutes', err);
      cb();
    });
  }

  /**
* To delete QuickMapRoutes
* @param {callback} cb 
*/
  archiveDeliveryQuickMapRoutes(route_id, cb) {
    this.apiClient.delete(`admin/routes/delete/${route_id}`).then((response) => {
      if (response.data) {
        let dataObj = response.data;
        if (dataObj.status) {
          cb(response.data);
        } else {
          cb();
        }
      } else {
        cb();
      }
    }).catch((err) => {
      console.log('Some error occured in QuickMapRoutes', err);
      cb();
    });
  }

  /**
* To find all orders whose Map Route is not definde
* @param {callback} cb 
*/
  getAllOrdersLeftForMapRoutes(zone_id, cb) {
    this.apiClient
      .get(`admin/orders/get_available_orders/${zone_id}`)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status) {
            cb(response.data);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log('Some error occured in getAllOrdersLeftForMapRoutes', err);
        cb();
      });
  }

  /**
   * Gets all delivery agents for the given zone
   * @param {*} zone_id 
   * @param {*} cb 
   */
  postDeliveryAgentsByZone(zone_id, cb) {
    this.apiClient
      .post(`admin/routes/list_delivery_agents/${zone_id}`)
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
        console.log('Some error occured in postDeliveryAgentsByZone', err);
        cb();
      });
  }

  /**
   * To enable/disable theme script in thankyou page
   * @param {*} zone_id 
   * @param {*} cb 
   */
  postToggleThemeScript(script_status, cb) {
    this.apiClient
      .post(`scripts/enable_geo_script`, { geo_location: script_status })
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
        console.log('Some error occured in postToggleThemeScript', err);
        cb();
      });
  }


  /**
   * To check if script in thankyou page is enabled or disabled
   * @param {*} zone_id 
   * @param {*} cb 
   */
  getCheckThemeScriptStatus(cb) {
    this.apiClient
      .get(`scripts/geo_script_status`)
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
        console.log('Some error occured in getCheckThemeScriptStatus', err);
        cb();
      });
  }


  /**
   * To check if app has a warehouse - fresh install
   * @param {*} zone_id 
   * @param {*} cb 
   */
  getCheckForFreshInstall(cb) {
    this.apiClient
      .get(`admin/dashboard/fresh-install-checking`)
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
        console.log('Some error occured in getCheckForFreshInstall', err);
        cb();
      });
  }
  /**
   * To check if app has Zone
   * @param {*} zone_id 
   * @param {*} cb 
   */
  getCheckForZoneExistance(cb) {
    this.apiClient
      .get(`admin/dashboard/warehouse-zone-checking`)
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
        console.log('Some error occured in getCheckForZoneExistance', err);
        cb();
      });
  }
}


export default AdminApiService;
