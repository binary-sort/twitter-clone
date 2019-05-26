require('./utility_functions');
require('dotenv').config();

const Knex = require('knex');
const morgan = require('morgan');
const express = require('express');
const knexConfig = require('./knexfile');
const routes = require('./routes');
const bodyparser = require('body-parser');
const {
  Model
} = require('objection');

// Initialize knex.
const knex = Knex(knexConfig.databaseConfig);
//const knex = Knex(knexConfig.production);


// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex);

const app = express()
  .use(bodyparser.json())
  .use(express.urlencoded({
    extended: true
  }))
  .use(morgan('dev'))
  .set('json spaces', 2);

// app.use((req, res, next) => {
//   res.setHeader('Content-Type', 'application/json');
//   next();
// })

// Register our REST API.
// registerApi(router);
app.use(routes);

// Error handling. The `ValidationError` instances thrown by objection.js have a `statusCode`
// property that is sent as the status code of the response.
//
// NOTE: This is not a good error handler, this is the simplest one. See the error handing
//       recipe for a better handler: http://vincit.github.io/objection.js/#error-handling
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(err.statusCode || err.status || 500).send(err || {});
  } else {
    next();
  }
});

const server = app.listen(8000, () => {
  console.log('Twitter Clone listening on port', server.address().port);
});

module.exports = server;
