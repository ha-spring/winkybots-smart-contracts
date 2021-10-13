const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("addToWhitelist", function () {
  let token;
  let owner;
  let user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
  });

  it("should add user1 to whitelist", async function () {
    await token.connect(owner).addToWhitelist(user1.address);
    expect(await token.whitelist(user1.address)).to.equal(true);
  });

  it("should return false if user1 has not been whitelisted", async function () {
    expect(await token.whitelist(user1.address)).to.equal(false);
  });

  it("should remove user1 from whitelist", async function () {
    await token.connect(owner).addToWhitelist(user1.address);
    expect(await token.whitelist(user1.address)).to.equal(true);
    await token.connect(owner).deleteFromWhitelist(user1.address);
    expect(await token.whitelist(user1.address)).to.equal(false);
  });

});