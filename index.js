const path = require('path')
const flatten = require('./flatten')

// flattener({
//   nocomment: true,
//   include: './contracts',
//   file: './contracts/Board.sol'
// })

const loaderUtils = require('loader-utils')

module.exports = function(contents){
  const options = loaderUtils.getOptions(this)
  // console.log('gotem', flattenConfigs)
  // console.log('options be', options)
  
  const file = this.resourcePath
  
  return flatten({
    ...options,
    file
  })

}