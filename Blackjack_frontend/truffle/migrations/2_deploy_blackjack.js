const BlackJack = artifacts.require('BlackJackV2');

module.exports = function(deployer) {
  deployer.deploy(BlackJack, 10, 100,{value:2000});
};