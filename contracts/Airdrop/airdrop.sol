// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop is OwnableUpgradeable, UUPSUpgradeable{

    /*================================ VARIABLES ================================*/

    IERC20 public token;

    address signer;

    mapping(bytes => bool) signatureInvalid;
    mapping(address => UserData) public userDatas;
    mapping(address => bool) public BlackList;



    /*================================ STRUCTS ================================*/
    
    struct UserData {
        uint256 rewardClaimed;
        uint256 lastClaimed;
    }

    /*================================ EVENTS ================================*/

    event ClaimReward (
        address indexed user,
        uint256 amount
    );

    /*=============================== FUNCTIONS ===============================*/
    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function initialize(address _token, address _signer) public initializer {
        token = IERC20(_token);
        signer = _signer;
       
        ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
        __Ownable_init();
    }

    function claimAirdrop(string memory internalId, uint256 typeOfClaim, uint256 amount, bytes memory signature ) external {
        UserData storage data = userDatas[msg.sender];

        require(!BlackList[msg.sender], "Airdrop: User is in BlackList");

        require(!signatureInvalid[signature] && verify(internalId, typeOfClaim, msg.sender, amount, signature), "Airdrop: Signature is invalid");
        signatureInvalid[signature] = true;


        data.rewardClaimed += amount;
        data.lastClaimed = block.timestamp;

        token.transfer(msg.sender, amount);


        emit ClaimReward(msg.sender, amount);
    }


    /**
     * @dev Return Message Hash
     * @param _internalId internal ID
     * @param _typeOfClaim Seed or Private User (0 is Seed and 1 is Private)
     * @param _to: address of user claim Airdrop
     * @param _amount amount of Reward
    */
    function getMessageHash(
        string memory _internalId,
        uint256 _typeOfClaim,
        address _to,
        uint256 _amount
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_internalId, _typeOfClaim, _to, _amount));
    }

    /**
     * @dev Return ETH Signed Message Hash
     * @param _messageHash: Message Hash
    */
    function getEthSignedMessageHash(bytes32 _messageHash)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }

    /**
     * @dev Return True/False
     * @param _internalId internal ID
     * @param _typeOfClaim Seed or Private User (0 is Seed and 1 is Private)
     * @param _to: address of user claim Airdrop
     * @param _amount amount of Reward
     * @param signature: sign the message hash offchain
    */
    function verify(
        string memory _internalId,
        uint256 _typeOfClaim,
        address _to,
        uint256 _amount,
        bytes memory signature
    ) internal view returns (bool) {
        bytes32 messageHash = getMessageHash(_internalId, _typeOfClaim, _to, _amount);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        return recoverSigner(ethSignedMessageHash, signature) == signer;
    }

    /**
     * @dev Return address of signer
     * @param _ethSignedMessageHash: ETH Signed Message Hash
     * @param _signature: sign the message hash offchain
    */
    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
        internal
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    /**
     * @dev Return split Signature
     * @param sig: sign the message hash offchain
    */
    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
    }


    function setSigner(address newSigner) external onlyOwner{
        signer = newSigner;
    }

    function setBlackList(address user, bool val) external onlyOwner{
        BlackList[user] = val;
    }

}
