'use strict';

var url = require('url');


var mainService = require('./mainService');


module.exports.getPicture = function getPicture (req, res, next) {
  mainService.getPicture(req.swagger.params, res, next);
};
