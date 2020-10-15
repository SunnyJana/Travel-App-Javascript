// This is my Server Side Code
// Dependencies :
// npm init -y
// npm i body parser cors express

var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Endpoint for all routes
let projectData = {};

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
app.use(express.static('dist'));

// BodyParser config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Getting route
app.get('/', function (request, response) {
  response.sendFile('dist/index.html')
})

// Posting Route
app.post('/add', addInfo);

function addInfo(request, response) {
  projectData['deparCity'] = request.body.deparCity;
  projectData['arrivCity'] = request.body.arrivCity;
  projectData['deparDate'] = request.body.deparDate;
  projectData['weatherDetails'] = request.body.weatherDetails;
  projectData['summary'] = request.body.summary;
  projectData['daysLeft'] = request.body.daysLeft;
  response.send(projectData);
}

// Here I'm setting up the server with port number 4000

const port = 4000;
const server = app.listen(port, listening);

function listening() {
  console.log(`running on localhost: ${port}`);
};
