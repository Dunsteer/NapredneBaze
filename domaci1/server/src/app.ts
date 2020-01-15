import express from 'express';
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./routes/api');
const path = require('path');

const io = require('socket.io')();
io.listen(5000);
io.origins('*:*');

io.origins((origin, callback) => {
  // if (origin !== 'https://foo.example.com') {
  //     return callback('origin not allowed', false);
  // }
  callback(null, true);
});

var socket = require('./routes/message-manager');
socket.io(io);

class App {
  public express: any

  constructor() {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes(): void {
    this.express.use(cors());
    this.express.use(bodyParser.json());
    this.express.use('/api', api);

    this.express.use(express.static('public'));

    //const router = express.Router();

    //this.express.use('/', router);
    this.express.get('*', (req, res) => {
      res.sendFile('index.html', { root: path.join(__dirname, '../public') });
    })
  }
}

export default new App().express;