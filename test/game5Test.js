const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const threshold = 0x00ffffffffffffffffffffffffffffffffffffff;
    let validAddress;
    //loop until find valid address
    while (!validAddress) {
      wallet = ethers.Wallet.createRandom();
      address = await wallet.getAddress();
      if (address < threshold) {
        console.log("Valid address: ", address);
        validAddress = true;
      }
    }
    //then add balance in valid address for tx gas fee
    wallet = wallet.connect(ethers.provider);
    const signer = ethers.provider.getSigner(0);
    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther("1"),
    });
    return { game, wallet };
  }
  it('should be a winner', async function () {
    const { game, wallet } = await loadFixture(
      deployContractAndSetVariables
    );
    
    // good luck
    await game.connect(wallet).win();


    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
