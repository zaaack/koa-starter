export default function keyMirror (input, opts = {
  upperKey: false,
  upperValue: false
  // camelCaseKey: false,
  // camelCaseValue: false
}) {
  const ret = {}
  let keyArr = input
  if (!Array.isArray(input)) {
    keyArr = Object.keys(input)
  }
  keyArr.forEach(k => {
    let key = k
    let value = k
    if (opts.upperKey) {
      key = key.toUpperCase()
    }
    if (opts.upperValue) {
      value = value.toUpperCase()
    }
    ret[key] = value
  })
  return ret
}
