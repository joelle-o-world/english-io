function politeList(list:string[]) {
  if(list.length == 1)
    return list[0]
  else {
    return list.slice(0, list.length-1).join(", ") + " and " + list[list.length-1]
  }
}

function parsePoliteList(str:string) {
  const result = /^(?:(?:(.+), )*(.+) and )(.+)$/.exec(str)

  if(result)
    return result.slice(1).filter(o=>o)
  else
    return null
}

export {politeList, parsePoliteList}