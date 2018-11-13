function solitityContract(toAddress, hash) {
return `
pragma solidity ^0.4.0; 

contract HTLC { 
    /* duration of contract */
    uint public lockTime = 1 hours;
    /* send ETH toAddress */
    address public toAddress = ${toAddress}; 
    /* '0x' + sha256('password') */
    bytes32 public hash = 0x${hash}; 
    /* contract starts now */
    uint public startTime = now;
    /* return address in case the contract times out */
    address public fromAddress; 
    /* the "password" required to spend the bitcoin transaction */
    bytes32 public key; 
    /* the amount in the contract */
    uint public fromValue; 
   
    /* the amount in the contract */
    uint public fromValue; 

    function HTLC() payable { 
        fromAddress = msg.sender; 
        fromValue = msg.value; 
    } 

    modifier condition(bool _condition) { 
        require(_condition); _; 
    } 

    /* if the hashing the key matches, then transfer ETH toAddress */
    function withdraw(bytes32 _key) payable condition ( sha256(_key) == hash ) returns (bytes32) { 
        toAddress.transfer(fromValue); 
        key = _key; 
        return key; 
    } 

    /* if the contract times out, then return the funds */
    function refund () payable condition ( startTime + lockTime < now ) returns (uint) { 
        fromAddress.transfer(fromValue); 
        return fromValue; 
    } 

}
`
}

module.exports  = solitityContract
