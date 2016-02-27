#!/usr/bin/env node
'use strict';

var path = require('path');
var express = require('express');
var pkg = require( path.join(__dirname, 'package.json') );
var http = require('http');
var fs = require("fs");

var app_api = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var port_api = 7934;

// Parse command line options

// TODO: add silent mode (API only)

var program = require('commander');

program
  .version(pkg.version)
  .option('-p, --port <port>', 'Port on which to listen to (defaults to 15595)', parseInt)
  .parse(process.argv);

////// API //////
var options = {
  controllers: './controllers',
  useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync('./static/api/swagger.yaml', 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app_api.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app_api.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app_api.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app_api.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app_api).listen(port_api, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', port_api, port_api);
    console.log('Swagger-ui is available on http://localhost:%d/docs', port_api);
  });
});


////// UI //////
var port = program.port || 15595;

// Ceate a new express app

var app = express();

// Access /create for UI

app.get('/create', function(req,res){
  res.sendFile(path.resolve(__dirname + '/static/index.html'), {}, function (err) {

  });
});

// Serve static files from the static folder

app.use('/', express.static(path.join(__dirname, 'static')));

// Everything is setup. Listen on the port.

app.listen(port);

console.log('Get your profile picture at 127.0.0.1:' + port + '/create');
