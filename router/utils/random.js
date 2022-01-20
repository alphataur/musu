let randInt = (min, max) => Math.floor(Math.random() * (max - min) + min)

let randomSample = (arr) => {
  if(!Array.isArray(arr)) return
  let min = 0, max = arr.length
  return arr[randInt(min, max)]
}

module.exports = {
  randomSample,
  randInt
}