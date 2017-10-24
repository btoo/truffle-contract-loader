const path = require('path')
const flatten = require('./flatten')
    , truffleCompile = require('truffle-compile')
    // , solc = require('solc')

const loaderUtils = require('loader-utils')

module.exports = function(contents){
  
  this.cacheable && this.cacheable()
  const options = loaderUtils.getOptions(this)
  
  /**
   * to avoid having to save contract artifacts into their
   * own js fileswhenever a .sol dependency tree exists,
   * just reduce each tree down to its own single, concatenated file
   */
  const file = this.resourcePath
  const flattenedSolidityFile = flatten({
    ...options,
    file
  })


  const callback = this.async()
  const truffleCompileOptions = {
    ...options
    // working_directory: './niqua',
    // contracts_directory: './contracts',
    // contracts_build_directory: './built-contracts',
    // // resolver: {
    // //   require: fn => require(`${__dirname}/contracts/${fn}`)
    // // },
    // // resolver: require,
    // resolver: {
    //   resolve: fn => require(`${__dirname}/${fn}.js`),
    //   require: fn => require(`${__dirname}/${fn}.js`)
    // },
    // solc // this might not be right
  }
  
  truffleCompile([flattenedSolidityFile], truffleCompileOptions, (err, artifact) => {
    if(err) return callback(err)
    
    callback(null, artifact)
  })

  

}



// console.log('how mny times')

// var contract = require('truffle-contract')
//   , truffleCompile = require('truffle-compile')
//   , solc = require('solc')
  
  
// module.exports = function (solidityFile) {
  
//   // console.log('file', solidityFile)

//   this.cacheable && this.cacheable()
  
//   var callback = this.async()
//   var callback2 = (ret1, result, ret3) => {
//     console.log('reza', result)
//     // var contractObj = contract(result)
//     // const util = require('util')
//     // console.log(util.inspect(result, false, null))
//     var resultStr = JSON.stringify(result);
//     // console.log('normale', result)
//     // console.log('str v', resultStr)
//     callback(null, `
//       console.log('how many')
//       window.contractObj = window.contractObj || (_ => {
//         console.log('times')
//         var contract = require('truffle-contract')
//         var contractObjs = JSON.parse('${resultStr}'.replace(/(\\r\\n|\\n|\\r)/gm,""))
//         var contractObj = Object.values(contractObjs).map(co => contract(co))[0]
//         return contractObj
//       })()
//       console.log('same', contractObj)
//       module.exports = contractObj
//     `)
//   }
  
//   // console.log('just tell me', `${__dirname}/contracts/`)
//   // console.log('resolver', require('../../truffle'))
//   // console.log(solc.optimizer)
//   // truffleCompile.([solidityFile], {
//   truffleCompile.necessary({
//     working_directory: './niqua',
//     contracts_directory: './contracts',
//     contracts_build_directory: './built-contracts',
//     // resolver: {
//     //   require: fn => require(`${__dirname}/contracts/${fn}`)
//     // },
//     // resolver: require,
//     resolver: {
//       resolve: fn => require(`${__dirname}/${fn}.js`),
//       require: fn => require(`${__dirname}/${fn}.js`)
//     },
//     solc // this might not be right
//   }, callback2)

  
// }