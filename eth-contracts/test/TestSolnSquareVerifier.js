// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var Verifier = artifacts.require("Verifier");

var proof = {
  proof: {
    a: [
      "0x0cc65f7eb01d13ef03223f4d66f72552cbec4e63d110410c9ed9956a6d135834",
      "0x2250390b590864582c29b48a98d20b306e66f2d714d2178abffc2c869e4ad9c4",
    ],
    b: [
      [
        "0x0ee24b9cb0cf8446f0292408924b07c220b9b93b56bb3000b580a9a378752d2f",
        "0x1fdf6f366fce724fee8f988d0720e8b6a3d935fd728f8784578afdbdcdd21c34",
      ],
      [
        "0x180288f535674c9b57648e7f1da22d17fab26523138532fcd4b81f45856f8fa1",
        "0x01b8b37e9c52c84cd901522ebbebbc954013a2b255976b1df6012c2d16cae55d",
      ],
    ],
    c: [
      "0x148c31e1d4b04f8bf9a7834a23314512ebf5d2cd0704a8bc79f636e756388b4a",
      "0x1c93d780231dea2850b30a82110e5823502bc5b327f5065277e2a845327f5c36",
    ],
  },
  inputs: [
    "0x0000000000000000000000000000000000000000000000000000000000000009",
    "0x0000000000000000000000000000000000000000000000000000000000000001",
  ],
};

contract("SolnSquareVerifier", (accounts) => {
  describe("check solutions and mints", function () {
    beforeEach(async function () {
      let verifier = await Verifier.new({ from: accounts[0] });
      this.contract = await SolnSquareVerifier.new(verifier.address, {
        from: accounts[0],
      });
    });

    it("mint new token", async function () {
      let p = proof.proof;
      let result = await this.contract.mintVerifiedToken(
        accounts[1],
        1,
        p.a[0],
        p.a[1],
        p.b[0],
        p.b[1],
        p.c[0],
        p.c[1],
        proof.inputs
      );

      let newTokenOwner = await this.contract.ownerOf(1);

      console.log("newTokenOwner", newTokenOwner);
      assert.equal(newTokenOwner, accounts[1], "A new token should be minted");
    });

    it("should fail if using same solution twice", async function () {
      let p = proof.proof;
      let result = await this.contract.mintVerifiedToken(
        accounts[1],
        1,
        p.a[0],
        p.a[1],
        p.b[0],
        p.b[1],
        p.c[0],
        p.c[1],
        proof.inputs
      );

      let errMessage;

      try {
        result = await this.contract.mintVerifiedToken(
          accounts[1],
          1,
          p.a[0],
          p.a[1],
          p.b[0],
          p.b[1],
          p.c[0],
          p.c[1],
          proof.inputs
        );
      } catch (err) {
        console.log(err.reason);
        errMessage = err.reason;
      }

      assert.equal(
        errMessage,
        "Solution already submitted",
        "Cannot use same solution twice"
      );
    });
  });
});
