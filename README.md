
# Proof-by-Approval Barebones Demo

This is a barebones implementation of the Proof-by-Approval consensus protocol on a Blockchain in NodeJS. The demo uses websockets for Peer-to-Peer networking, express to provide http servers for interaction, elliptic for cryptography and crypto-js for hashing.

## How to use

1. Execute "npm run users" in a powershell/cmd/bash/terminal window

2. Execute "npm run approvers" in a seperate powershell/cmd/bash/terminal window

3. Use some REST API testing tool (Ex: curl, postman) to then use the following requests to interact with the blockchain:-  
    1. GET Req at localhost:3001/chain - 3013/chain: Returns the current blockchain
    2. POST Req at localhost:3001/data - 3013/data: with the req body as {"approver": "Kotak Mahindra Bank", "data": "ANY DATA YOU WANT"} adds a new block to the blockchain
