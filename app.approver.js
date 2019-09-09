const Blockchain = require('./src/Blockchain');
const P2p = require("./src/p2p-network");

const name = process.env.APPROVER || "Kotak Mahindra Bank";

let blockchain = new Blockchain();
let server = P2p.approverServer({
  name, blockchain
});