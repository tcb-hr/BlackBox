'use strict';

module.exports.getLatLong = function(reqBody, callback){
  var array = [];
  
  var locations = {
    "locations": []
  };

  var makeLocationObject = function(location){
    if(location.street_address !==  undefined){
      var newObj = {};
      var crossStreetIndex = location.street_address.indexOf("Cross street")
      if(crossStreetIndex > -1){
        newObj.street = location.street_address.slice(0,crossStreetIndex);
      } else{
        newObj.street = location.street_address;
      }
      newObj.city = location.city || 'San Francisco';
      newObj.state = location.state || 'CA';
      if(location.zip !== null){
        newObj.postalCode = location.zip.slice(0,5) || 94110;
      }
      locations.locations.push(newObj);    
    }
  };

  var pick = reqBody.applicable_job.pick_address;
  var drop = reqBody.applicable_job.drop_address;
  makeLocationObject(pick);
  makeLocationObject(drop);
  
  var request = require('request-promise');
  // URL for non-batch requests 'http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56'  
  request('http://open.mapquestapi.com/geocoding/v1/batch?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56' + '&inFormat=json&json=' + JSON.stringify(locations))
    .then(function(response){
      var pickCoordinates = JSON.parse(response).results[0].locations[0].latLng || null;
      var dropCoordinates = JSON.parse(response).results[1].locations[0].latLng || null;
      reqBody.pickCoordinates = JSON.stringify(pickCoordinates);
      reqBody.dropCoordinates = JSON.stringify(dropCoordinates);
      callback(reqBody);
    }).catch(function(response){
      console.log('Error! ', response);
      callback(reqBody);
    });
};
 