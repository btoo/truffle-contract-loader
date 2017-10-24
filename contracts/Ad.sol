pragma solidity ^0.4.15;

contract Ad {

  address owner; // owner of billboard

  address publisher; // make private?
  bytes32 title;
  bytes32 img;
  bytes32 href;
  uint256 total;

  function Ad(address newAdOwner, bytes32 newAdTitle, bytes32 newAdImg, bytes32 newAdHref, uint256 contribution) {
    owner = newAdOwner;
    publisher = tx.origin;
    title = newAdTitle;
    img = newAdImg;
    href = newAdHref;
    total = contribution;
  }
}