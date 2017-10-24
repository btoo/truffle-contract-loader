webpack loader for importing .sol files as truffle contracts using the locally installed version of the truffle-compile package. normally, dependency on locally installed packages should be avoided, but in this case, it gives you the flexibility to use whichever version of truffle-compile (and by extension, solc and solidity version pragma) you'd like.

first install truffle-compile:
```bash
yarn add truffle-compile
```