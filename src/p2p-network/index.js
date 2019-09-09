const WebSocket = require('ws');
const jsonDB = require('../data');

const userServer = ({name, blockchain}) => {
  let user = jsonDB.getUserPublic(name);
  let server = new WebSocket.Server({port: user.port});
  server.on('connection', socket => {
    socket.on('message', msg => {
      const data = JSON.parse(msg);

      if (data.type==="block") {
        blockchain.addBlock(data.block);
      } else {
        blockchain.acceptChain(data.chain);
      }
      socket.close();
    });
  });
  return server;
}

const approverServer = ({name, blockchain}) => {
  let approver = jsonDB.getApproverPublic(name);
  let server = new WebSocket.Server({port: approver.port});
  server.on('connection', socket => {
    socket.on('message', msg => {
      const data = JSON.parse(msg);

      if (data.type==="block") {
        blockchain.approveBlock({name: approver.name, user: data.block.user, data: data.block.data});
      } else {
        blockchain.acceptChain(data.chain);
      }
      socket.close();
    });
  });
  return server;
}

const userSendsBlock = (block, approverName) => {
  let approver = jsonDB.getApproverPublic(approverName);
  const socket = new WebSocket(`ws://localhost:${approver.port}`);
  socket.on('open', () => {
    socket.send(JSON.stringify({
      type: "block",
      block
    }));
    console.log(`
      ${JSON.stringify(block)}
      -> ${approverName}
    `)
  });
}

const approverSendsBlock = (block, userName) => {
  console.log(userName);
  let user = jsonDB.getUserPublic(userName);
  let socket = new WebSocket(`ws://localhost:${user.port}`);
  socket.on('open', () => {
    socket.send(JSON.stringify({
      type: "block",
      block
    }));
    console.log(`
      ${JSON.stringify(block)}
      -> ${userName}
    `)
  });
}

const sendChainToPeers = (chain, name) => {
  let {users, approvers} = jsonDB.getPublicList();

  for (let user of users) {
    if (user.name!==name) {
      let socket = new WebSocket(`ws://localhost:${user.port}`);
      socket.on('open', () => {
        socket.send(JSON.stringify({
          type: "chain",
          chain
        }));
      });
    }
  }

  for (let approver of approvers) {
    let socket = new WebSocket(`ws://localhost:${approver.port}`);
    socket.on('open', () => {
      socket.send(JSON.stringify({
        type: "chain",
        chain
      }));
    });
  }

  console.log(`
    ${name} ->
    ${JSON.stringify(chain)}
  `)
}

module.exports = {
  userServer,
  approverServer,
  userSendsBlock,
  approverSendsBlock,
  sendChainToPeers
};