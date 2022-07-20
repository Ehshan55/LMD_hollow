import AxiosClientProvider from './apiClient';

class VerificationApiService {
  constructor(ctx) {
    this.apiClient = new AxiosClientProvider(ctx);
    this.apiClient = this.apiClient.getClient();
  }

/**
     * To validate user invitation
     * @param {token for validation} token 
     * @param {callback} cb 
     */
 verifyUserInvitation(body, cb) {
  this.apiClient
    .post('user-manager/verify-invite', body)
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
     * To validate user invitation
     * @param {token for validation} token 
     * @param {callback} cb 
     */
 acceptUserInvitation(body, cb) {
    this.apiClient
      .post('user-manager/accept-invite', body)
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





}

export default VerificationApiService;