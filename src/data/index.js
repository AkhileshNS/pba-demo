const fs = require('fs');
const path = require('path');

const getPublicList = () => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "./users-public.json")));
}

const getUserPublic = name => {
  let user = null;
  let {users} = JSON.parse(fs.readFileSync(path.join(__dirname, "./users-public.json")));

  for (let i in users) {
    if (name===users[i].name) {
      user = {...users[i]};
    }
  }

  return user;
}

const getUserPrivate = name => {
  let user = null;
  let {users} = JSON.parse(fs.readFileSync(path.join(__dirname, "./users-private.json")));

  for (let i in users) {
    if (name===users[i].name) {
      user = {...users[i]};
    }
  }

  return user;
}

const getApproverPublic = name => {
  let approver = null;
  let {approvers} = JSON.parse(fs.readFileSync(path.join(__dirname, "./users-public.json")));

  for (let i in approvers) {
    if (name===approvers[i].name) {
      approver = {...approvers[i]};
    }
  }

  return approver;
}

const getApproverPrivate = name => {
  let approver = null;
  let {approvers} = JSON.parse(fs.readFileSync(path.join(__dirname, "./users-private.json")));

  for (let i in approvers) {
    if (name===approvers[i].name) {
      approver = {...approvers[i]};
    }
  }

  return approver;
}

const setUserPublic = user => {
  let data = JSON.parse(fs.readFileSync(path.join(__dirname, "./users-public.json")));

  for (let i in data.users) {
    if (user.name===data.users[i].name) {
      data.users[i] = user;
    }
  }

  fs.writeFileSync(path.join(__dirname, "./users-public.json"), JSON.stringify(data));
}

const setApproverPublic = approver => {
  let data = JSON.parse(fs.readFileSync(path.join(__dirname, "./users-public.json")));

  for (let i in data.approvers) {
    if (approver.name===data.approvers[i].name) {
      data.approvers[i] = approver;
    }
  }

  fs.writeFileSync(path.join(__dirname, "./users-public.json"), JSON.stringify(data));
}

module.exports = {
  getPublicList,
  getApproverPrivate,
  getApproverPublic,
  getUserPrivate,
  getUserPublic,
  setUserPublic,
  setApproverPublic
}