const express = require('express');
const helmet = require('helmet');
const app = express();
const userRoutes = require('./routes/user.routes');

//*** Helmet helps to secure Express apps by setting various HTTP headers ***/
app.use(helmet());
// analyse les données et les met dans le req.body
app.use(express.json());

app.use((req, res, next) => { 
    //*** Website you wish to allow to connect API, '*'= all websites allowed ***/
    res.setHeader('Access-Control-Allow-Origin', '*');
    //*** Access-Control-Request-Headers indicate which HTTP headers can be used during the actual request ***/
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // //*** Access-Control-Allow-Methods indicate which methods can be used during the actual request ***/
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    // //*** Fix helmet error => net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin : https://github.com/helmetjs/helmet/issues/176 ***/
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
});

app.use('/api', userRoutes);

module.exports = app;