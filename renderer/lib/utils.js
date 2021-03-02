const fs = require('fs')
const path = require('path')

export const decimal = (x) => {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}

export function newJsonID() {
  const ts = new Date().getTime()
  const suffix = Math.random().toString(16).substr(2, 10).toUpperCase()
  return '' + ts + '-' + suffix
}

export const getDataFromJsonFile = (dir, id) => {
  const file = path.join(dir, id)
  // console.log(file)
  const buff = fs.readFileSync(file, 'utf-8')
  return JSON.parse(buff)
}



