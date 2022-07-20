import AxiosClientProvider from './apiClient';

class SettingsApiService {
  constructor(ctx) {
    this.apiClient = new AxiosClientProvider(ctx);
    this.apiClient = this.apiClient.getClient();
  }


  /**
   * To get user profile data according to saved token
   * @param {callback} cb 
   */
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
        console.log('Some error occured in getDeliveryProfile', err);
        cb();
      });
  }
  /**
   * To update password
   * @param {callback} cb 
   */
  updateUserPassword(body, cb) {
    this.apiClient
      .put('users/profile', body)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          console.log('dataObj>>>>>> ', response.data)
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
        console.log('Some error occured ', err);
        cb();
      });
  }

  /**
 * To get all permision for roles data according to saved token
 * @param {callback} cb 
 */
  getAllPermission(cb) {
    this.apiClient
      .get('permission')
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


    /**
 * To update password
 * @param {callback} cb 
 */
  createRoles(body, cb) {
    this.apiClient
      .post('roles', body)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          console.log('dataObj>>>>>> ', response.data)
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
        console.log('Some error occured ', err);
        cb();
      });
  }


  getAllRoles(cb) {
    this.apiClient
      .get('roles')
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
        console.log('Some error occured in getAllRoles', err);
        cb();
      });
  }

  /**
  * To update profile
  * @param {callback} cb 
  */
  updateUserProfile(body, cb) {
    this.apiClient
      .put('users/profile', body)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          console.log('dataObj>>>>>> ', response.data)
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
        console.log('Some error occured ', err);
        cb();
      });
  }

  /**
* To Invitation
* @param {callback} cb 
*/
  inviteUser(body, cb) {
    this.apiClient
      .post('user-manager/request-invite', body)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          console.log('dataObj>>>>>> ', response.data)
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
        console.log('Some error occured ', err);
        cb();
      });
  }

  /**
* To Get All Pending Invite
* @param {callback} cb 
*/

  getPendingInvites(cb) {
    this.apiClient
      .get('user-manager/invited-user')
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
        console.log('Some error occured in getPendingInvites', err);
        cb();
      });
  }

  /**
* To Get All Registered Invite
* @param {callback} cb 
*/

  getRegisterInvites(cb) {
    this.apiClient
      .get('user-manager/regitered-user')
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
        console.log('Some error occured in getRegisterInvites', err);
        cb();
      });
  }

  /**
 * To Update Roles Of Registered User
 * @param {*} order_id 
 * @param {Updating data JSON} body 
 * @param {callback} cb 
 */
  updateRegisterUserRoles(registered_user_id, body, cb) {
    this.apiClient
      .put(`user-manager/update-role/${registered_user_id}`, body)
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
        console.log('Some error occured in updateRegisterUserRoles ', err);
        cb();
      });
  }

  /**
* To Cancel Pending Invite
* @param {*} order_id
* @param {Updating data JSON} body
* @param {callback} cb
*/
  cancelPendingInvite(invitation_id, cb) {
    this.apiClient
      .delete(`user-manager/cancel-invite/${invitation_id}`)
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
        console.log('Some error occured in updateRegisterUserRoles ', err);
        cb();
      });
  }

  /**
* To Remove user from store
* @param {*} order_id
* @param {Updating data JSON} body
* @param {callback} cb
*/
  removeUserFromStore(registered_user_id, cb) {
    this.apiClient
      .delete(`user-manager/remove-user/${registered_user_id}`)
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
        console.log('Some error occured in updateRegisterUserRoles ', err);
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

export default SettingsApiService;
