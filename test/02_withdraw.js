const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("withdraw", function () {
  let token;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
  });

  it("Should return smart contract balance", async function () {
    await token.connect(user1).mint(1, {value: ethers.utils.parseEther("0.07")});
    await token.connect(user2).mint(1, {value: ethers.utils.parseEther("0.07")});
    let provider = ethers.provider;
    expect(await provider.getBalance(token.address)).to.equal("140000000000000000");
  });

  it("Should return 0 after withdraw", async function () {
    await token.connect(user1).mint(1, {value: ethers.utils.parseEther("0.07")});
    await token.connect(user2).mint(1, {value: ethers.utils.parseEther("0.07")});
    await token.connect(owner).withdraw();
    let provider = ethers.provider;
    expect(await provider.getBalance(token.address)).to.equal("0");
  });

  it("Should fail if no owner try to withdraw", async function () {
    await token.connect(user1).mint(1, {value: ethers.utils.parseEther("0.07")});
    await token.connect(user2).mint(1, {value: ethers.utils.parseEther("0.07")});
    await expect(token.connect(user1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");
  });

});