'use strict';
var flow = require('./flow-node.js')('tmp/');

// Handle uploads through Flow.js
exports.upload = function(req, res){
  console.log('hey hey')
  flow.post(req, function(status, filename, original_filename, identifier){
    console.log('FLOW POST', status, original_filename, identifier);
    res.send(200, {
      // NOTE: Uncomment this funciton to enable cross-domain request.
      //'Access-Control-Allow-Origin': '*'
    });
  });
};

// Handle cross-domain requests
// NOTE: Uncomment this funciton to enable cross-domain request.
/*
  app.options('/upload', function(req, res){
  console.log('OPTIONS');
  res.send(true, {
  'Access-Control-Allow-Origin': '*'
  }, 200);
  });
*/

// Handle status checks on chunks through Flow.js
exports.chunk = function(req, res){
  flow.get(req, function(status, filename, original_filename, identifier){
    console.log('FLOW GET', status);
    res.send(200, (status == 'found' ? 200 : 404));
  });
};

exports.delID = function(req, res){
  flow.write(req.params.identifier, res);
};
