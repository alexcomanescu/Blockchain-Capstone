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
      assert.equal(
        result,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
        "Incorrect token URI"
      );
    });

    it("should transfer token from one owner to another", async function () {
      let old_owner = await this.contract.ownerOf(1);

      console.log("old owner", old_owner);

      await this.contract.transferFrom(account_one, account_two, 1, {
        from: account_one,
      });

      let new_owner = await this.contract.ownerOf(1);

      console.log("new_owner", new_owner);

      assert.equal(new_owner, account_two, "The new owner is incorrect");
    });
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await CustomERC721Token.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {
      let hasError = false;
      try {
        await this.contract.mint(account_one, 1, { from: account_two });
      } catch (error) {
        //console.log("Mint error", error);
        hasError = error.reason == "Caller is not contract owner";
      }
      assert.equal(
        hasError,
        true,
        "Should fail if minting from another account"
      );
    });

    it("should return contract owner", async function () {
      let owner = await this.contract.getOwner();
      assert.equal(account_one, owner, "Incorrect owner");
    });
  });
});
