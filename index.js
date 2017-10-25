var path = require('path')
  , merge = require('./merge')
  , truffleCompile = require('truffle-compile')
  , loaderUtils = require('loader-utils')

module.exports = function(contents){

  this.cacheable && this.cacheable()
  var options = loaderUtils.getOptions(this)
    , file = this.resourcePath

  /**
   * to avoid having to save contract artifacts into their
   * own js fileswhenever a .sol dependency tree exists,
   * just reduce each tree down to its own single, concatenated file
   */
  var mergedSolidityFile = merge({
    ...options,
    file
  })

  var contractFileName = path.basename(this.resourcePath)
    , contractName = contractFileName.charAt(0).toUpperCase() + contractFileName.slice(1, contractFileName.length - 4)
    , compilationFinished = this.async()

  truffleCompile([mergedSolidityFile], options, function(err, artifact){
    if(err) return compilationFinished(err)

    var artifactString = `\`${
      JSON.stringify(artifact)
        .replace(/(\\r\\n|\\n|\\r)/gm,'') // flatten
        .replace(/\\/gi, '\\\\') // escape
    }\``

    compilationFinished(err, `
      var truffleContract = require('truffle-contract')
      var contractName = '${contractName}'

      if(!window[contractName]){
        var artifacts = JSON.parse(${artifactString})
        var artifact = artifacts['${contractName}']
        window[contractName] = truffleContract(artifact)
      }

      module.exports = window[contractName]
    `)

  })

}