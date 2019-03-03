const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/healthcheck', (req, res) => {
  res.send("OK");
});

app.get('/api/confirmedProjects', (req, res) => {
  res.json({ "list": [ "AAA", "BBB", "CCC" ]});
});

app.get('*', (req, res) => {
  res.send("Welcome To Ecosystem Lists API Server");
});

app.listen(port, () => console.log(`Listening on port ${port}`));