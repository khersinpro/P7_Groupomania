const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const comRoutes = require('./routes/com.routes');

//*** Helmet helps to secure Express apps by setting various HTTP headers ***/
app.use(helmet());
// analyse les données et les met dans le req.body
app.use(express.json());
app.use(cookieParser());

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
// Express.static permet de servir des fichiers static(images, fichiers css/js)
// path.join + __dirname + "nom_du_repertoire" permet de cibler le repertoire voulu pour le rendre static
// https://www.digitalocean.com/community/tutorials/nodejs-how-to-use__dirname
app.use('/images/avatar', express.static(path.join(__dirname, "images/user_avatar")));
app.use('/images/post', express.static(path.join(__dirname, "images/post_images")));

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', comRoutes);

module.exports = app;