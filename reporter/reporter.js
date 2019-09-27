const SerialPort = require('serialport');
const axios = require('axios');
const Readline = require('@serialport/parser-readline')
const dotenv = require('dotenv');

dotenv.config();

const port = new SerialPort(process.env.LOCALPORT, { baudRate: 9600 })

const parser = new Readline()
port.pipe(parser)

parser.on('data', line => {
  console.log('Posting data. Value: ' + line)
  axios.post(process.env.URL, {
    data: {
      date: new Date(),
      value: line
    }
  })
})
