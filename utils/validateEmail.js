
const validateEmail = (email, toast) => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(email) === false && email) {
    toast("Email field is invalid", true);
    return (false);
  }
  return (true);
}

module.exports = validateEmail