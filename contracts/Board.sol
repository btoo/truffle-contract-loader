pragma solidity ^0.4.8;

import "./Ad.sol";

contract Board {

  address owner;
  Ad[] ads;
  mapping(address => Ad) adSpaces;

  function Board(bytes32 initAdTitle, bytes32 initAdImg, bytes32 initAdHref, uint256 contribution) {
    owner = msg.sender;
    ads.push(new Ad(owner, initAdTitle, initAdImg, initAdHref, contribution));
  }

  function postAd(bytes32 postedAdTitle, bytes32 postedAdImg, bytes32 postedAdHref) payable returns (address) {
    if (!owner.send(msg.value)) {
      throw;
    }
    ads.push(new Ad(owner, postedAdTitle, postedAdImg, postedAdHref, msg.value));
    adSpaces[address(ads[ads.length - 1])] = ads[ads.length - 1];
    return address(ads[ads.length - 1]);
  }

}
