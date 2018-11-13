function solitityContract(toAddress, hash) {
return `
pragma solidity ^0.4.0; 

contract HTLC { 
    /* duration of contract */
    uint public lockTime = 1 hours;
    /* send ETH toAddress */
    address public toAddress = ${toAddress}; 
    /* the key required to spend the bitcoin transaction example: 0xa492d599fb01a1801f3b810b0f8fd8e3efe9725ecbbe43e7341333c86407fab7 */
    bytes32 public key; 
    /* sha256('0xa492d599fb01a1801f3b810b0f8fd8e3efe9725ecbbe43e7341333c86407fab7') */
    bytes32 public hash = 0x829737b3a9e8f4f58167ff3105d211dedfec64cddfc091444283592b9dfdac12; 
    /* contract starts now */
    uint public startTime = now;
    /* return address in case the contract times out */
    address public fromAddress; 
   
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
