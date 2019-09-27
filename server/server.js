const express = require('express');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const path = require('path');
const moment = require('moment');
let fs = require('fs');

dotenv.config();
const app = express();

app.use(bodyparser.json());
app.use(express.static('static'));

let config = JSON.parse(fs.readFileSync('./data.json'));
console.log('Current Config:')
console.log(JSON.stringify(config, null, 2));

fs = fs.promises;

app.post('/data', async (req, res) => {
  if (req.query.password !== process.env.PASSWORD) return res.sendStatus(403);
  res.sendStatus(200);

  let newConfig = req.body.data;
  newConfig.date = new Date();

  const text = JSON.stringify(newConfig)
  await fs.writeFile('./data.json', Buffer.from(text));
  config = newConfig;
  console.log('Received new config.')
})
app.get('/', async (req, res) => {
  let str = await fs.readFile(path.resolve('./main.html'))
  str = str.toString();
  str = str.replace('{{currentWaterLevel}}', config.value);
  const timeAgo = moment(config.date).fromNow();
  str = str.replace('{{lastUpdated}}', timeAgo)
  return res.status(200).send(str);
})

app.listen(process.env.PORT)
