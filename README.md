webpack loader for importing .sol files as truffle contracts using [truffle-compile](https://github.com/trufflesuite/truffle-compile) (and by extension, its solc and solidity version pragma).

additionally, this loader will refrain from creating any pre-compiled contract artifact files. dependency trees are resolved by first [merging the files](https://github.com/TiesNetwork/solidify) and then feeding the result to the compiler.
