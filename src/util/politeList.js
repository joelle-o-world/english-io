function politeList(list) {
  if(list.length == 1)
    return list[0]
  else {
    return list.slice(0, list.length-1).join(", ") + " and " + list[list.length-1]
  }
}
module.exports = politeList
