const path = require('path')
    , flatten = require('./flatten')
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
  const flattenedSolidityFile = flatten({
    ...options,
    file
  })

  const contractFileName = path.basename(this.resourcePath)
  const contractName = contractFileName.charAt(0).toUpperCase() + contractFileName.slice(1, contractFileName.length - 4)

  const compilationFinished = this.async()
  const truffleCompileOptions = options

  truffleCompile([flattenedSolidityFile], truffleCompileOptions, (err, artifact) => {

    if(err) return compilationFinished(err)
    const artifactString = `\`${
      JSON.stringify(artifact)
        .replace(/\\"/gi, '\\\\"')
        .replace(/(\\r\\n|\\n|\\r)/gm,'')
    }\``

    compilationFinished(err, `
      console.log(String.raw${artifactString})
      const truffleContract = require('truffle-contract')
      console.log('how many')
      const contractName = '${contractName}'
      if(!window[contractName]){
        const artifacts = JSON.parse(${artifactString})
        const artifact = artifacts['${contractName}']
        window[contractName] = truffleContract(artifact)
      }

      // window.contractObj = window.contractObj || (_ => {
      //   console.log('times')
      //   const contractObj = Object.values(contractObjs).map(co => contract(co))[0]
      //   console.log(contractObjs)
      //   // console.log(contractObj)
      //   return contractObj
      // })()
      // console.log('same', contractObj)
      module.exports = window[contractName]
    `)

  })

}