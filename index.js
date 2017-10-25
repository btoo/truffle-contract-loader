const path = require('path')
    , merge = require('./merge')
    , truffleCompile = require('truffle-compile')
    , loaderUtils = require('loader-utils')

module.exports = function(contents){

  this.cacheable && this.cacheable()
  const options = loaderUtils.getOptions(this)

  /**
  * to avoid having to save contract artifacts into their
  * own js fileswhenever a .sol dependency tree exists,
  * just reduce each tree down to its own single, concatenated file
  */
  const file = this.resourcePath
  const mergedSolidityFile = merge({
    ...options,
    file
  })

  const contractFileName = path.basename(this.resourcePath)
  const contractName = contractFileName.charAt(0).toUpperCase() + contractFileName.slice(1, contractFileName.length - 4)

  const compilationFinished = this.async()
  const truffleCompileOptions = options

  truffleCompile([mergedSolidityFile], truffleCompileOptions, (err, artifact) => {

    if(err) return compilationFinished(err)
    const artifactString = `\`${
      JSON.stringify(artifact)
        .replace(/(\\r\\n|\\n|\\r)/gm,'') // flatten
        .replace(/\\/gi, '\\\\') // escape
    }\``

    compilationFinished(err, `
      const truffleContract = require('truffle-contract')
      const contractName = '${contractName}'

      if(!window[contractName]){
        const artifacts = JSON.parse(${artifactString})
        const artifact = artifacts['${contractName}']
        window[contractName] = truffleContract(artifact)
      }

      module.exports = window[contractName]
    `)

  })

}