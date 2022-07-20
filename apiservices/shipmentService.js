import AxiosClientProvider from './apiClient';

class ShipmentApiService {
  constructor(ctx) {
    this.apiClient = new AxiosClientProvider(ctx);
    this.apiClient = this.apiClient.getClient();
  }


  /**
   * To get user profile data according to saved token
   * @param {callback} cb 
   */
  getUnAllocatedLocation(cb) {
    this.apiClient
      .get('shipment/zone/unallocated-location')
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
 * To get user profile data according to saved token
 * @param {callback} cb 
 */
  getUnAllocatedLocationById(shipment_zone_id, cb) {
    this.apiClient
      .get(`shipment/zone/unallocated-location/${shipment_zone_id}`)
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
        console.log('Some error occured in getUnAllocatedLocationById', err);
        cb();
      });
  }

  /**
* To update password
* @param {callback} cb 
*/
  createZone(body, cb) {
    this.apiClient
      .post('shipment/zone', body)
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
        console.log('Some error occured ', err);
        cb();
      });
  }

  /**
 * To get user profile data according to saved token
 * @param {callback} cb 
 */
  getAllZones(cb) {
    this.apiClient
      .get('shipment/zone')
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

  getZoneById(shipment_zone_id, cb) {
    this.apiClient
      .get(`shipment/zone/${shipment_zone_id}`)
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

  updateZoneById(shipment_zone_id, body, cb) {
    this.apiClient
      .put(`shipment/zone/${shipment_zone_id}`, body)
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

  removeZoneById(shipment_zone_id, cb) {
    this.apiClient
      .delete(`shipment/zone/${shipment_zone_id}`)
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

  // -------------------------------

  /**
   * 1. Create Shipment Rule
   * @param {*} cb 
   */
  postShipmentRule(cb) {
    this.apiClient
      .post('shipment/rule')
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
        console.log('Some error occured in postShipmentRule', err);
        cb();
      });
  }

  /**
   * 2. Get All Shipment rules
   * @param {*} cb 
   */
  getAllShipmentRules(cb) {
    this.apiClient
      .get('shipment/rule')
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
        console.log('Some error occured in getAllShipmentRules', err);
        cb();
      });
  }

  /**
   * 3. Get Shipment Rule By ID
   * @param {*} rule_id 
   * @param {*} cb 
   */
  getShipmentRulesById(rule_id, cb) {
    this.apiClient
      .get(`shipment/rule/${rule_id}`)
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
        console.log('Some error occured in getShipmentRulesById', err);
        cb();
      });
  }

  /**
   *4. Update Shipment Rule By ID
   * @param {*} rule_id 
   * @param {*} cb 
   */
  putUpdateShipmentRulesById(rule_id, cb) {
    this.apiClient
      .put(`shipment/rule/${rule_id}`)
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
        console.log('Some error occured in putUpdateShipmentRulesById', err);
        cb();
      });
  }
  /**
   *5. Delete Shipment Rule By ID
   * @param {*} rule_id 
   * @param {*} cb 
   */
  deleteShipmentRulesById(rule_id, cb) {
    this.apiClient
      .delete(`shipment/rule/${rule_id}`)
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
        console.log('Some error occured in deleteShipmentRulesById', err);
        cb();
      });
  }

  // -------------------------------


  /**
   * 1. Create Shipment Location
   * @param {*} cb 
   */
  postShipmentLocation(body, cb) {
    this.apiClient
      .post('shipment/location', body)
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
        console.log('Some error occured in postShipmentLocation', err);
        cb();
      });
  }

  /**
   * 2. Get All Shipment Location
   * @param {*} cb 
   */
  getAllShipmentLocation(cb) {
    this.apiClient
      .get('shipment/location')
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
        console.log('Some error occured in getAllShipmentLocation', err);
        cb();
      });
  }

  /**
   *3. Get Shipment Location By ID
   * @param {*} cb 
   */
  getShipmentLocationById(shipment_location_id, cb) {
    this.apiClient
      .get(`shipment/location/${shipment_location_id}`)
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
        console.log('Some error occured in getShipmentLocationById', err);
        cb();
      });
  }

  /**
   *4. Update Shipment Location By ID
   * @param {*} cb 
   */
  putUpdateShipmentLocationById(shipment_location_id, cb) {
    this.apiClient
      .put(`shipment/location/${shipment_location_id}`)
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
        console.log('Some error occured putUpdateShipmentLocationById', err);
        cb();
      });
  }

  /**
   *5. Delete Shipment Location By ID
   * @param {*} cb 
   */
  deleteShipmentLocationById(shipment_location_id, cb) {
    this.apiClient
      .delete(`shipment/location/${shipment_location_id}`)
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
        console.log('Some error occured in deleteShipmentLocationById', err);
        cb();
      });
  }


}

export default ShipmentApiService;
