const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokensByDeadlines", function () {
  let nft;
  let owner;
  let user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("Token");
    nft = await NFT.deploy();
  });

  it("Should add deadline and max", async function () {
    await nft.connect(owner).addTokensByDeadlines(100000, 10);
    let item = await nft.tokensByDeadlines(0);
    expect(item.deadline).to.equal(100000);
    expect(item.max).to.equal(10);
  });

  it("Should fail if no owner try to add deadline", async function () {
    await expect(nft.connect(user1).addTokensByDeadlines(100000, 10))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should delete deadline and max", async function () {
    await nft.connect(owner).addTokensByDeadlines(100000, 10);
    await nft.connect(owner).addTokensByDeadlines(200000, 20);
    await nft.connect(owner).deleteTokensByDeadlines(0);
    let item = await nft.tokensByDeadlines(1);
    expect(item.deadline).to.equal(200000);
    expect(item.max).to.equal(20);
  });

  it("Should fail if no owner try to delete deadline", async function () {
    await nft.connect(owner).addTokensByDeadlines(200000, 20);
    await expect(nft.connect(user1).deleteTokensByDeadlines(0))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should fail if purchase exceed period max", async function () {
    let now = parseInt(Date.now() / 1000);
    let deadline = now + 1000;
    let max = 2;
    await nft.connect(owner).addTokensByDeadlines(deadline, max);
    await expect(nft.connect(user1).mint(3, {value: ethers.utils.parseEther("0.21")}))
      .to.be.revertedWith('Purchase would exceed period max');
  });
  
});