const validate_form = (value) => {
    if (value.length == 0) {
      return (true);
    }
    else {
      return (false);
    }
  }
  module.exports = validate_form;