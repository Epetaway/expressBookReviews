const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const ui_auth = require('./router/ui_auth.js');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Check session-based authorization first
    if(req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                req.username = req.session.authorization.username;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } 
    // Check for Authorization header as fallback
    else if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1]; // Bearer TOKEN
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                // For header auth, we need to extract username from token payload or make it available
                req.username = req.headers['x-username'] || 'headeruser'; // fallback
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    }
    else {
        return res.status(401).json({ message: "User not logged in" });
    }
});
 
const PORT = 3001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
