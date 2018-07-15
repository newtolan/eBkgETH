var Migrations = artifacts.require("./Migrations.sol");
var Booking = artifacts.require("./Booking.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Booking);
};
