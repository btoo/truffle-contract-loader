webpack loader for import .sol files as truffle contracts using truffle-compile (and by extension, its solc and solidity version pragma).

additionally, this loader will refrain from creating any pre-compiled contract artifact files. dependency trees are resolved by first merging files (https://github.com/TiesNetwork/solidify) and then feeding the result to the compiler.