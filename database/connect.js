const mongoose = require('mongoose');
require('dotenv').config({ path: 'ENV_FILENAME' });
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

mongoose
  .connect(process.env.DBURL, options)
  .then(() => console.log("Connected to Mongo"))
  .catch((err) => console.log(err));