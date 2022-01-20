exports.successify = (payload) => {
  return { success: true, error: false, ...payload}
}

exports.errorify = (payload) => {
  return { success: false, ...payload}
}