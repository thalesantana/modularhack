db = db.getSiblingDB('hoofledger')


db.createUser({
    user: 'hoofledger',
    pwd: 'Noixqu1v04',
    roles: [
      {
        role: 'dbOwner',
      db: 'hoofledger',
    },
  ],
});
