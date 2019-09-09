const util = require('../crypto-util');
const p2p = require('../p2p-network');

class Blockchain {
  constructor() {
    this.chain = [{
      user: {
        name: "Genesis"
      },
      current_hash: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    }];
  }

  createBlock({name, data, approverName}) {
    let no = 1;
    for (let i=this.chain.length-1; i>=0; i--) {
      if (this.chain[i].user.name===name) {
        no = this.chain[i].user.no + 1;
      }
    }

    let user = {
      name, 
      no,
      timestamp: Date.now()
    }
    user.signature = util.userSign({user, data});

    let block = {
      user, data
    };
    
    p2p.userSendsBlock(block, approverName);
  }

  approveBlock({name, user, data}) {
    if (util.userVerify({user, data})) {
      /* Perform Some Data Approval Here */

      /* And also perform other verification steps */

      let approver = {
        name,
        timestamp: Date.now() 
      }
      approver.signature = util.approverSign({user, approver, data});

      let block = {
        user, approver, data
      };

      p2p.approverSendsBlock(block, user.name);
    }
  }

  addBlock(block) {
    if (util.approverVerify(block)) {
      block.id = util.getId(block);
      block.previous_hash = this.chain[this.chain.length-1].current_hash;
      block.current_hash = util.getCurrentHash(block);
      console.log(`
        -> ${block.approver.name}
        ${JSON.stringify(block)}
      `);
      this.chain.push(block);
      p2p.sendChainToPeers(this.chain, block.user.name);
    }
  }

  acceptChain(chain) {
    if (chain.length>this.chain.length) {
      this.chain = chain;
    }
  }
}

module.exports = Blockchain;