function mapValues(obj, f) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = f(obj[key], key)
    return acc
  }, {})
}

export default (module, types) => {
  let newObj = {}
  mapValues(types, (names, key) => {
    newObj[key] = {}
    types[key].forEach((name) => {
      newObj[key][name] = module + ':' + name
    })
  })
  return newObj
}
