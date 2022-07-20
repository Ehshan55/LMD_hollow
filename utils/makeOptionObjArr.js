
let options = [];
let statusOptionObj = {};

const makeOptionObjArr = (allowedUpdateStates) => {
  let defaultObj = { label: 'Select', value: '' };
  options.push(defaultObj);
  allowedUpdateStates.forEach((statusOption) => {
    statusOptionObj = { label: statusOption.name, value: statusOption.val };
    options.push(statusOptionObj);
  });
  // console.log(options);
  return options;
};

module.exports = makeOptionObjArr;
