'use strict';
var server = require('../../server');
var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');
var qs = require('qs');

// Get Lat Long Coordinates from Map Quest 
var getLatLong = function(reqBody, callback){
  var array = [];
  
  var locations = {
    "locations": []
  };

  var makeLocationObject = function(location){
    if(location.street_address !==  undefined){
      var newObj = {};
      newObj.street = location.street_address;
      newObj.city = location.city || 'San Francisco';
      newObj.state = location.state || 'CA';
      if(location.zip !== null){
        newObj.postalCode = location.zip.slice(0,5);
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
 
/**
 * Create chat message
 */


exports.create = function (req, res, next) {
  console.log('create');
  var newChat = new Chat(req.body);
  newChat.provider = 'local';
  newChat.save(function(err) {
    if (err){
      console.log('err', err);
      return res.json(400, err);
    }
  
    req.logIn(newChat, function(err) {
      if (err) return next(err);

      return res.json(req.newChat);
    });
 
  });
};


exports.twinjet = function (req, res, next) {
  var eventType = req.body['event_type'];
  var itemToAdd; 

// assign courier name
  if (req.body.applicable_courier){
    req.body.pic = req.body.applicable_courier.small_image;
    req.body.user = 
      req.body.applicable_courier.courier_number + ' ' + (req.body.applicable_courier.nick_name !== '' 
        ? req.body.applicable_courier.nick_name 
        : req.body.applicable_courier.first_name + ' ' + req.body.applicable_courier.last_name);
  } else if (req.body.applicable_job){
    req.body.user = req.body.applicable_job.client_name;    
  }

// add event-specific body text
  switch(eventType){
    case 'courier_check_in':
      itemToAdd = createCourierCheckIn(req.body);
      break;
    case 'courier_check_out':
      itemToAdd = createCourierCheckOut(req.body);
      break;
    case 'job_created':
      itemToAdd = createJobCreated(req.body);
      break;
    case 'job_cancelled':
      itemToAdd = createJobCancelled(req.body);
      break;
    case 'job_edited':
      itemToAdd = createJobEdited(req.body);
      break;
    case 'job_ready':
      itemToAdd = createJobReady(req.body);
      break;
    case 'job_assigned':
      itemToAdd = createJobAssigned(req.body);
      break;
    case 'job_picked':
      itemToAdd = createJobPicked(req.body);
      break;
    case 'job_delivered':
      itemToAdd = createJobDelivered(req.body);
      break;
    case 'job_complete':
      itemToAdd = createJobComplete(req.body);
      break;
    case 'job_late':
      itemToAdd = createJobLate(req.body);
      break;
  }
 
  getLatLong(req.body, function(item){saveChatInDatabase(req, res, next, item);});

};

var saveChatInDatabase = function(req, res, next, itemToAdd){
  console.log('adding', itemToAdd);
  var newChat = new Chat(itemToAdd);
  console.log('new chat', newChat);
  newChat.provider = 'local';
  newChat.save(function(err) {
    console.log('err', err);
    if (err) return res.json(400, err);
    req.logIn(newChat, function(err) {
      if (err) return next(err);
      return res.json(req.newChat);
    });
  });
};

var createCourierCheckIn = function(obj){
  obj.body = "HELLO: " + obj.user + " has checked in.";
  return obj;
};

var createCourierCheckOut = function(obj){
  obj.body = "BYE: " + obj.user + " has checked out. " + slogan();
  return obj;
};
var createJobCreated = function(obj){
  obj.body =  "NEW: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just created by " + obj.user + '. ' + slogan();
  return obj;
};
var createJobCancelled = function(obj){
  obj.body =  "CANCEL: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just canceled by " + obj.user + '. ' + slogan();
  return obj;
};
var createJobEdited = function(obj){
  obj.body = "EDIT: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just edited by " + obj.user + '. ' + slogan();;
  return obj;
};
var createJobReady = function(obj){
  obj.body = "READY: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " is ready. " + slogan();
  return obj;
};
var createJobAssigned = function(obj){
  obj.body = "CLAIMED: " + obj.user + " claimed " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + '. ' + slogan();
  return obj;
};
var createJobPicked = function(obj){
  obj.body = "PICK: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + '. ' + slogan();
  return obj;
};
var createJobDelivered = function(obj){
  obj.body =  "DROP: " + obj.user + " dropped the " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + '. ' + slogan();
  return obj;
};
var createJobComplete = function(obj){
  obj.body = "COMPLETE: " + obj.user + " dropped the " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + '. ' + slogan();
  return obj;
};
var createJobLate = function(obj){
  obj.body = "LATE: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " is overdue. " + slogan();
  return obj;
};


var slogan = function(){
  var catchPhrase =[
  "Get hot slug",
  "Seans mom",
  "Cookin not lookin",
  "Jammer time",
  "Fuck you pay me ",
  "Hey what's up man",
  "Get in the drops",
  "What're you working? ",
  "Turn and burn",
  "Jays on hayes",
  "Shut the fuck up Andres",
  "Fuckin Fixie ",
  "Call the guy",
  "CALL THE GUY!!!!!",
  "Check the wiki",
  "Check the tip",
  "Let's try and have a good nite",
  "You gonna take this one first?",
  "EVERYTHING ON IT",
  "HOW ARE YOU ENJOYING EVERYTHING!?!",
  "Yeah I'm going to text the codes",
  "Why you no text code?!",
  "Fuck you Grandma",
  "Y U NO DLVR BB?",
  "I'm the ducking BOSSMAN",
  "#hired",
  "#fired",
  "Your BLOWING IT!",
  "Who has a rack?",
  "Hash out with the cash out.",
  "Who cares.",
  "NTCB.",
  "Monday blunt day.",
  "Hold that.",
  "Roam your radio. ",
  "I've got it onboard. ",
  "Can you close that job for me?",
  "What's the cross street?",
  "Which shift meals are open?",
  "Hey, what's the delivery fee?",
  "Does anyone have an extra... Radio? ",
  "Does anyone have an extra... Battery? ",
  "Does anyone have an extra... Tube? ",
  "Does anyone have an extra... Patch? ",
  "Does anyone have an extra... iPhone 5 charger? ",
  "Does anyone have an extra... Shift meal? ",
  "Throw it in my queue. ",
  "Going down the hill.",
  "Going up the hill.",
  "One handing it.",
  "Pics or it didn't happen",
  "Don't duck my calls",
  "TODD IS VOMITING",
  "GODDAMMIT JOEL!!!",
  "Free Frankie",
  "Save DJ",
  "Save Seanmon",
  "Does anybody copy me",
  "Roam your radio",
  "That was all wind",
  "Robot talk",
  "Shut the fuck up Andres ",
  "Rest5 Manager ",
  "Did you text the code",
  "What's the delivery fee",
  "Who's buying donuts",
  "Who can take my 400 Alvarado",
  "Where's Wilmont Alley",
  "Sal called",
  "Why'd you miss the call",
  "Showdogs call",
  "It's already ready already",
  "Who's on Hayes",
  "Who's taking the last down town run",
  "Why'd you blow it",
  "The curry up exploded in my bag",
  "Tarbash is pissed",
  "I'm literally going to rip your face off",
  "Don't cry wolf in the Marina",
  "Driving the shortbus in the Mission",
  "I appreciate your effort",
  "Flower gravy",
  "Is there anyone at the office",
  "Where's the opps",
  "Your neck of the woods",
  "Grandma's dog is sick",
  "Todd's cat is depressed",
  "Gabe switched the deliveries",
  "Gino's girlfriend broke up with him",
  "Frankie got arrested at the benches",
  "Dave rode off a cliff",
  "Cliff compressed his spine ",
  "Katy puked on the corner",
  "Seany crashed into a parked car",
  "Joel James is in Jail",
  "Rob went 427 Bryant",
  "Mark is a Belt Sander",
  "Big Liz vs. Hammer Fist Hodges",
  "Don't tell Alex, the eye is closed",
  "I'm not on the emails anymore",
  "Why didn't you bcc?",
  "You forgot the soda",
  "It was a seamless",
  "What's the unknown client bucket?",
  "Somebody call Doug",
  "Airplanes broke",
  "You're the boss now dog",
  "Can you close out my jobs",
  "Put it in my queue",
  "Dispatch leaves at 9",
  "They both quite at the #sametime",
  "nothing is ducked here",
  "Don't drown in the gravy",
  "Who gave you a radio?",
  "Who's got that 88 Townsend?",
  "Dylan's locked in the wine hub.",
  "We broke airplanes",
  "Be Excellent to Each Other",
  "MAINTAIN THE VEIL",
  "TEXT THE CODE",
  "TCB",
  "NTCB",
  "maintain de plane",
  "Saturday shit show",
  "He's in personal land",
  "acevedo just ordered",
  "daves going to serrano",
  "Radish is bottlenecked",
  "Hello this is TCB with your Gagalee Delivery (Seanmon)",
  "Frankie sing me some Alanis Morisette",
  "Fucking crosstown doubles",
  "The mission is fucked",
  "TCB army of amateur ",
  "Im at curry up now, now.",
  "You gonna drop this one first bro",
  "Wing wings is out of wings...",
  "make the youngblood do it",
  "same time",
  "10:9 10:9 10:9",
  "Hey Rudy, whats your 20, Ok now whats your 20.",
  "totally ducked"
  ]
  return catchPhrase[Math.floor(Math.random() * catchPhrase.length)];
}