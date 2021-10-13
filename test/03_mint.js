const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("mint", function () {
  let nft;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("Token");
    nft = await NFT.deploy();
  });

  it("Should many tokens", async function () {
    await nft.connect(user1).mint(10, {value: ethers.utils.parseEther("0.7")});
    expect(await nft.balanceOf(user1.address)).to.equal(10);
  });

  it("Should return an error if no suffucient fund", async function () {
    await expect(nft.connect(user1).mint(1, {value: ethers.utils.parseEther("0.06")}))
      .to.be.revertedWith('Ether value sent is not correct');
  });

  it("Should return token url", async function () {
    await nft.setBaseTokenURI('url/');
    await nft.connect(user1).mint(3, {value: ethers.utils.parseEther("0.21")});
    expect(await nft.tokenURI(1)).to.equal("url/1");
  });

  it("Should mint by ower for free", async function () {
    await nft.mintByOwner([user1.address, user2.address],[2,4]);
    expect(await nft.balanceOf(user1.address)).to.equal(2);
    expect(await nft.balanceOf(user2.address)).to.equal(4);
  });

  it("Should fail if purchase exceed MAX_TOKENS", async function () {
    await expect(nft.connect(user1).mint(11, {value: ethers.utils.parseEther("0.77")}))
      .to.be.revertedWith('Purchase would exceed MAX_TOKENS');
  });

  it("Should fail if the contract is paused", async function () {
    await nft.pause();
    await expect(nft.connect(user1).mint(11, {value: ethers.utils.parseEther("0.77")}))
      .to.be.revertedWith('Address must be whitelisted OR Not paused');
  });

  it("Should mint when address is whitelisted", async function () {
    await nft.pause();
    await nft.addToWhitelist(user1.address);
    await nft.connect(user1).mint(1, {value: ethers.utils.parseEther("0.07")});
    expect(await nft.balanceOf(user1.address)).to.equal(1);
  });

});