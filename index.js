const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const bodyParser = require('body-parser');
//set up exxpress app
const app = express();
// const port = 4000;
const port = process.env.PORT || 4000;
const host = '0.0.0.0';
const cors = require('cors');
app.use(cors({
    origin: "http://localhost:4200",
}));

//connect to mongoDB cloud
require('./database/connect');

//bearer strategy
require('./passport/bearerStrategy');

app.use('/upload', express.static(__dirname +'/upload'));

app.use(express.json());

//morgan config
app.use(morgan('dev'));

app.use(bodyParser.json());

//require routes
const userApi = require('./routes/UserApi');
app.use('/api',userApi);

const promoterApi = require('./routes/PromoterApi');
app.use('/api', promoterApi);

const register = require('./routes/AuthApi');
app.use('/api', register);

const uploadApi = require('./routes/uploadApi');
app.use('/api', uploadApi);

const eventApi = require('./routes/EventsApi');
app.use('/api', eventApi);

const adminApi = require('./routes/AdminApi');
app.use('/api', adminApi);

//send Email
const emailApi = require('./routes/mailApi');
const Promoter = require('./models/eventPromoter');
app.use('/api/', emailApi);

// listen for requests
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

app.get('/', (req,res) => {res.send("Hello Bassem")});
//get the list of promoters from a database
router.get('/promoters',  async (req, res) => {
    try {
        const promoter = await Promoter.find({});
        res.json(promoter);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
