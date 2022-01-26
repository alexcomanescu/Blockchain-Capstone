var CustomERC721Token = artifacts.require("CustomERC721Token");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      this.contract = await CustomERC721Token.new({ from: account_one });
      // TODO: mint multiple tokens

      await this.contract.mint(account_one, 1, { from: account_one });
    });

    it("should return total supply", async function () {
      let result = await this.contract.totalSupply();
      console.log("total supply", result);
      assert.equal(result, 1, "Total supply should be 1");
    });

    it("should get token balance", async function () {
      let result = await this.contract.balanceOf(account_one);
      console.log("balance for account 1", result);
      assert.equal(result, 1, "Balance should be 1");
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      let result = await this.contract.tokenURI(1);
      console.log("token URI", result);
      //assert.equal(result, 1, "Balance should be 1");
    });

    it("should transfer token from one owner to another", async function () {});
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await CustomERC721Token.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {});

    it("should return contract owner", async function () {});
  });
});
