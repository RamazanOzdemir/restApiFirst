const express = require('express');
const bodyParser = require('body-parser')
const sql = require('mssql');
const cors = require('cors')
const routes = require('./routes/api')
const app = express();

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors());
app.use(bodyParser.json());

app.use(routes);
const port = process.env.ENV_PORT || 4000;


const config = {
    user: 'samba',
    password: 'Anka1234',
    server: 'samba.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'jesse3',
    port:1433,
    encrypt: true
}







app.listen(port);
console.log('You are listening to port 4000');
