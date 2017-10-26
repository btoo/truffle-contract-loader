var path = require('path')
  , merge = require('./merge')
  , truffleCompile = require('truffle-compile')
  , loaderUtils = require('loader-utils')

module.exports = function(contents){

  this.cacheable && this.cacheable()
  var compilationFinished = this.async()
  var options = {
    solc: { // default solc configurations
      optimizer: {
        enabled: true,
        runs: 500
      }
    },
    ...loaderUtils.getOptions(this)
  }
  
  if(!options.contracts_directory) throw 'The contracts_directory property must be provided in the truffle-contract-loader options'
  
  /**
   * to avoid having to save contract artifacts into their
   * own js fileswhenever a .sol dependency tree exists,
   * just reduce each tree down to its own single, concatenated file
   */
  var file = this.resourcePath
  var mergedSolidityFile = merge({
    ...options,
    file
  })

  var contractFileName = path.basename(this.resourcePath)
    , contractName = contractFileName.charAt(0).toUpperCase() + contractFileName.slice(1, contractFileName.length - 4)
    

  truffleCompile([mergedSolidityFile], options, function(err, artifact){
    if(err) return compilationFinished(err)

    var artifactString = `\`${
      JSON.stringify(artifact)
        .replace(/(\\r\\n|\\n|\\r)/gm,'') // flatten
        .replace(/\\/gi, '\\\\') // escape
    }\``

    compilationFinished(err, `
      var truffleContract = require('truffle-contract')
        , contracts = require('truffle-contract-loader/contracts')
        , contractName = '${contractName}'

      if(!contracts[contractName]){
        var artifacts = JSON.parse(${artifactString})
        var artifact = artifacts['${contractName}']
        contracts[contractName] = truffleContract(artifact)
      }

      module.exports = contracts[contractName]
    `)

  })

}