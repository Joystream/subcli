module.exports = function sleepSeconds (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000)
  })
}
