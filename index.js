#!/usr/bin/env node

var path = require('path');
var express = require('express');
var pkg = require( path.join(__dirname, 'package.json') );
var http = require('http');
var fs = require("fs");

// Parse command line options

// TODO: add silent mode (API only)

var program = require('commander');

program
  .version(pkg.version)
  .option('-p, --port <port>', 'Port on which to listen to (defaults to 15595)', parseInt)
  .parse(process.argv);

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
