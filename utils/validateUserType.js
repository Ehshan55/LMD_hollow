// import CookiesJs from 'CookiesJs'

const validateUserType = (userData, PageInicator, router) => {

  // console.log("userDetails.user_type, '=', PageInicator", userData);
  let storeDetails = userData?.store_deatils;
  let userDetails = userData?.user_profile;

  // console.log(userDetails.user_type, '=', PageInicator);
  let logedInUserType = userDetails.user_type
  if (logedInUserType != PageInicator) {
    if (logedInUserType != 'vendor') {
      router.push({ pathname: '/forbidden', query: { current_account: `/${logedInUserType}` } })
    }
    else {
      router.push({ pathname: '/forbidden', query: { current_account: '/' } })
    }
  }
  else {
    return ({ userDetails, storeDetails })
  }
}

module.exports = { validateUserType }