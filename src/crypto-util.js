const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const jsonDB = require('./data');

const ec = new EC('secp256k1');

const userSign = ({user, data}) => {
  let User = jsonDB.getUserPrivate(user.name);
  if (User===null) {
    return User;
  } 

  let PRIVATE_KEY = User.private_key;
  let signatureHash = SHA256(`${user.timestamp}${user.no}${user.name}${JSON.stringify(data)}`).toString();
  let key = ec.keyFromPrivate(PRIVATE_KEY, "hex");
  return key.sign(signatureHash).toDER();
}

const userVerify = ({user, data}) => {
  let User = jsonDB.getUserPublic(user.name);
  if (User===null) {
    return User;
  } 

  let PUBLIC_KEY = User.public_key;
  let signatureHash = SHA256(`${user.timestamp}${user.no}${user.name}${JSON.stringify(data)}`).toString();
  let key = ec.keyFromPublic(PUBLIC_KEY, "hex");
  return key.verify(signatureHash, user.signature);
}

const approverSign = ({user, approver, data}) => {
  let Approver = jsonDB.getApproverPrivate(approver.name);
  if (Approver===null) {
    return Approver;
  }

  let PRIVATE_KEY = Approver.private_key;
  let signatureHash = SHA256(`${JSON.stringify(user)}${approver.timestamp}${approver.name}${JSON.stringify(data)}`).toString();
  let key = ec.keyFromPrivate(PRIVATE_KEY, "hex");
  return key.sign(signatureHash).toDER();
}

const approverVerify = ({user, approver, data}) => {
  let Approver = jsonDB.getApproverPublic(approver.name);
  if (Approver===null) {
    return Approver;
  }

  let PUBLIC_KEY = Approver.public_key;
  let signatureHash = SHA256(`${JSON.stringify(user)}${approver.timestamp}${approver.name}${JSON.stringify(data)}`).toString();
  let key = ec.keyFromPublic(PUBLIC_KEY, "hex");
  return key.verify(signatureHash, approver.signature);
}

const getId = ({user, approver, data}) => {
  return SHA256(`${JSON.stringify(user)}${JSON.stringify(approver)}${JSON.stringify(data)}`).toString();
}

const getCurrentHash = ({user, approver, data, id, previous_hash}) => {
  return SHA256(`${JSON.stringify(user)}${JSON.stringify(approver)}${JSON.stringify(data)}${id}${previous_hash}`).toString();
}

module.exports = {
  userSign,
  userVerify,
  approverSign,
  approverVerify,
  getId,
  getCurrentHash
}