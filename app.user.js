const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./src/Blockchain');
const P2p = require("./src/p2p-network");

const app = express();

const name = process.env.USER || "Akhilesh";
const port = process.env.PORT || 3000;

let blockchain = new Blockchain();
let server = P2p.userServer({
  name, blockchain
});

app.use(bodyParser.json());

app.get('/chain', (req, res) => {
  res.send(JSON.stringify(blockchain.chain));
});

app.get('/sync', (req, res) => {
  P2p.sendChainToPeers(blockchain.chain, name);
});

app.post('/data', (req, res) => {
  let data = req.body.data;
  let approver = req.body.approver;

  blockchain.createBlock({
    name, data, approverName: approver 
  });
  res.send("Creating new Block");
});

app.listen(port, () => console.log(`HTTP Server up and running at ${port}`));