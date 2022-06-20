const mongoose = require('mongoose');
DBURL = 'mongodb+srv://bassem:24111991aA@cluster0.ec7n2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

mongoose
  .connect(DBURL, options)
  .then(() => console.log("Connected to Mongo"))
  .catch((err) => console.log(err));