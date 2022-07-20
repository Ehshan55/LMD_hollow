import AxiosClientProvider from './apiClient';

class OrdersService {
  constructor(ctx) {
    this.apiClient = new AxiosClientProvider(ctx);
    this.apiClient = this.apiClient.getClient();
  }


  getOrdersList(reqData, cb) {
    this.apiClient
      .post('http://localhost:8000/api/v3/orders', reqData)
      .then((response) => {
        if (response.data) {
          let dataObj = response.data;
          if (dataObj.status == true) {
            cb(dataObj.data, dataObj.pagination);
          } else {
            cb();
          }
        } else {
          cb();
        }
      })
      .catch((err) => {
        console.log(err)
        cb();
      });
  }

  getOrder(reqData, cb) {
    this.apiClient
      .post('orders/' + reqData.id, reqData)
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
        console.log(err)
        cb();
      });
  }

  /**
   * 
   * @param {} reqData 
   * @param {
   *  id: "100001",
   *  
   * 
   * } response 
   */
  getAllOrderFilters(reqData, cb) {
    this.apiClient
      .post('orders/filters', reqData)
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
        console.log(err)
        cb();
      });
  }

  getOrderFilter(reqData, cb) {
    this.apiClient
      .post('orders?filters=' + reqData.id, reqData)
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
        console.log(err);
        cb();
      });
  }


}

export default OrdersService;
