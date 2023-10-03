const BridgeContract = artifacts.require("bridgeContractGanache");
const ERC20TestingToken1 = artifacts.require("ERC20Testing1"); // Testing Token TTA
const ERC20TestingToken2 = artifacts.require("ERC20Testing2"); // Testing Token TTB

contract("BridgeContract", (accounts) => {
    const owner = accounts[0];
    const wallet = accounts[1];
    let bridgeContract;
    let tokenTTA;
    let tokenTTB;

    before(async () => {
        // Deploy ERC20 tokens for testing
        tokenTTA = await ERC20TestingToken1.new({ from: owner });
        tokenTTB = await ERC20TestingToken2.new({ from: owner });

        // Mint some tokens for testing
        await tokenTTA.mint(owner, 1000, { from: owner });
        await tokenTTB.mint(owner, 1000, { from: owner });
 
        // Transfer tokens to the bridge contract
        await tokenTTA.transfer(wallet, 500, { from: owner });
        await tokenTTB.transfer(wallet, 500, { from: owner });
        
        // Deploy the bridge contract
        bridgeContract = await BridgeContract.new(wallet, tokenTTA.address, { from: owner });
    });

    it("should set the correct initial values for wallet and token address", async () => {
        const contractWallet = await bridgeContract.wallet();
        const contractTokenTTA = await bridgeContract.tokenTTA();
        const contractTokenTTB = await bridgeContract.tokenTTB();

        assert.equal(contractWallet, wallet, "Wallet address not set correctly");
        assert.equal(contractTokenTTA, tokenTTA.address, "TokenTTA address not set correctly");
        assert.equal(contractTokenTTB, tokenTTB.address, "TokenTTB address not set correctly");
    });

    it("should send tokens from the contract to another address", async () => {
        const receiver = accounts[2];
        const amount = 100;

        // Mint some tokens to the contract for testing 
        await tokenTTA.mint(bridgeContract.address, amount, { from: owner });

        // Ensure the contract has the tokens
        const contractBalanceBefore = await tokenTTA.balanceOf(bridgeContract.address);
        assert.equal(contractBalanceBefore.toNumber(), amount, "Contract balance not updated correctly");

        // Send tokens from the contract to the receiver
        await bridgeContract.sendTokens(receiver, amount, tokenTTA.address, { from: wallet });

        // Check if the tokens were sent correctly
        const contractBalanceAfter = await tokenTTA.balanceOf(bridgeContract.address);
        const receiverBalance = await tokenTTA.balanceOf(receiver);

        assert.equal(contractBalanceAfter.toNumber(), 0, "Contract balance not updated correctly after sending");
        assert.equal(receiverBalance.toNumber(), amount, "Receiver balance not updated correctly");
    });
    
    it("should receive tokens to the contract", async () => {
      const sender = accounts[3];
      const amount = 200;

      // Transfer tokens to the bridge contract
      await tokenTTB.transfer(bridgeContract.address, amount, { from: sender });

      // Check if the tokens were received correctly
      const contractBalanceAfter = await tokenTTB.balanceOf(bridgeContract.address);
      assert.equal(contractBalanceAfter.toNumber(), amount, "Contract balance not updated correctly after receiving");
  });
});