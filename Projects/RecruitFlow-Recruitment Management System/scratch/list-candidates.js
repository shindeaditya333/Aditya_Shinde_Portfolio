const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/recruitflow').then(async () => {
  const db = mongoose.connection;
  const users = await db.collection('users').find({ role: 'CANDIDATE' }).toArray();
  console.log(users.map(u => ({ email: u.email, id: u._id })));
  process.exit(0);
});
