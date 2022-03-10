const User = require("../models/simpleUser");
const Promoter = require('../models/eventPromoter');
const Admin = require('../models/admin');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const BearerStrategy = require('passport-http-bearer').Strategy;

passport.use(new BearerStrategy(

    async (token, done) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            const promoter = await Promoter.findById(decoded.promoterId);
            const admin = await Admin.findById(decoded.adminId)
            
            if(user) {
                return done(null, user, {scope: 'all'});
            }
            else if(promoter) {
                return done(null, promoter, {scope: 'all'});
            }
            else if(admin) {
                return done(null, admin, {scope: 'all'});
            }
            else  {
                return done(null, false);
            }
            
        }
        catch (err) {
            console.log(err);
            return done(null, false); 
        }
    }
));

