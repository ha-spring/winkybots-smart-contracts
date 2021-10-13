const { expect } = require('chai');

describe('NFT', async () =>  {
  let admin, user1, user2;
  let nft;


  beforeEach(async () => {
    [admin, user1, user2] = await ethers.getSigners();
    const NFT  = await ethers.getContractFactory('Token');
    nft = await NFT.deploy();
    await nft.deployed();
  });

  it('Should return the correct name and symbol', async () => {
    expect(await nft.name()).to.equal('MyToken');
    expect(await nft.symbol()).to.equal('MTK');
  });

  it('Should return the set new _baseTokenURI', async () => {
    await nft.setBaseTokenURI('new/');
    await nft.mint(1, {value: ethers.utils.parseEther("0.07")});
    expect(await nft.tokenURI(0)).to.equal('new/0');
  });

  it('Should not mint when pause = true', async () => {
    await nft.pause();
    await expect(nft.mint(1, {value: ethers.utils.parseEther("0.07")}))
      .to.be.revertedWith('Address must be whitelisted OR Not paused');
  });

  it('Should mint when pause = false', async () => {
    await nft.pause();
    await expect(nft.mint(1, {value: ethers.utils.parseEther("0.07")}))
      .to.be.revertedWith('Address must be whitelisted OR Not paused');
    await nft.unpause();
    await nft.connect(user1).mint(1, {value: ethers.utils.parseEther("0.07")});
    expect(await nft.balanceOf(user1.address)).to.equal(1);
  });

  it('Should not pause by no owner', async () => {
    await expect(nft.connect(user1).pause())
      .to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Should not unpause by no owner', async () => {
    await nft.pause()
    await expect(nft.connect(user1).unpause())
      .to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Should return the correct price', async () => {
    expect(await nft.connect(user1).price())
      .to.equal(ethers.utils.parseUnits('0.07'));
  });

  it('Should change the price', async () => {
    await nft.setPrice(ethers.utils.parseUnits('0.1'));
    expect(await nft.connect(user1).price())
      .to.equal(ethers.utils.parseUnits('0.1'));
  });

  it('Should not change the price by no owner', async () => {
    await nft.pause()
    await expect(nft.connect(user1).setPrice(ethers.utils.parseUnits('0.1')))
      .to.be.revertedWith('Ownable: caller is not the owner');
  });

});