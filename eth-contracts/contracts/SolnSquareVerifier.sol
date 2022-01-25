pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;
import "./verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token{

    Verifier verifierProxy;
       
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 tokenId;
        address to;
        uint aX; uint aY; uint[2] bX; uint[2] bY; uint cX; uint cY;
        uint[2] input;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private submittedSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 tokenId, address _address);

    constructor(address verifierAddress) CustomERC721Token() public {
      verifierProxy = Verifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address to, uint256 tokenId, uint aX, uint aY, uint[2] memory bX, uint[2] memory bY, uint cX, uint cY, uint[2] memory input) internal{
        bytes32 key = keccak256(abi.encodePacked(aX,aY,bX,bY,cX,cY,input));

        Solution memory solution = Solution({
            tokenId: tokenId,
            to: to,
            aX: aX,
            aY: aY,
            bX: bX,
            bY: bY,
            cX: cX,
            cY: cY,
            input: input
        });

        solutions.push(solution);

        submittedSolutions[key] = solution;

        emit SolutionAdded(tokenId, to);
    }    

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintVerifiedToken(address to, uint256 tokenId, uint aX, uint aY, uint[2] memory bX, uint[2] memory bY, uint cX, uint cY, uint[2] memory input) public {
        bytes32 key = keccak256(abi.encodePacked(aX,aY,bX,bY,cX,cY,input));
        require(submittedSolutions[key].tokenId == 0, 'Solution already submitted' );
        
        Verifier.Proof memory proof = Verifier.Proof({
            a:Pairing.G1Point({X: aX, Y: aY}),
            b:Pairing.G2Point({X: bX, Y: bY}),
            c:Pairing.G1Point({X: cX, Y: cY})
        });

        require(verifierProxy.verifyTx(proof, input), 'Solution is incorrect' );        

        addSolution(to, tokenId, aX,aY,bX,bY,cX,cY, input);

        super.mint(to, tokenId);
    
    }
}
