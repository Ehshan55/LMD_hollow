
const extract_idFromArrObj = (arrayObjects) => {
  const arrayOf_ids = [];
  arrayObjects.forEach(arrayObject => {
    arrayOf_ids.push(arrayObject._id);
  })
  return arrayOf_ids;
}

export default extract_idFromArrObj