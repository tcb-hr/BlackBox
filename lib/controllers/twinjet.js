'use strict';

module.exports.createCourierCheckIn = function(obj){
  obj.type = 101;
  obj.body = "HELLO: " + obj.user + " has checked in.";
  return obj;
};

module.exports.createCourierCheckOut = function(obj){
  obj.type = 102;
  obj.body = "BYE: " + obj.user + " has checked out. ";
  return obj;
};
module.exports.createJobCreated = function(obj){
  obj.controls = true;
  obj.type = 103;
  obj.body =  "NEW: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just created by " + obj.user + '. ';
  return obj;
};
module.exports.createJobCancelled = function(obj){
  obj.type = 104;
  obj.body =  "CANCEL: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just canceled by " + obj.user + '. ';
  return obj;
};
module.exports.createJobEdited = function(obj){
  obj.type = 105;
  obj.body = "EDIT: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just edited by " + obj.user + '. ';;
  return obj;
};
module.exports.createJobReady = function(obj){
  controls = true;
  obj.type = 106;
  obj.body = "READY: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " is ready. ";
  return obj;
};
module.exports.createJobAssigned = function(obj){
  obj.type = 107;
  obj.body = "CLAIMED: " + obj.user + " claimed " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + '. ';
  return obj;
};
module.exports.createJobPicked = function(obj){
  obj.type = 108;  
  obj.body = "PICK: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + '. ';
  return obj;
};
module.exports.createJobDelivered = function(obj){
  obj.type = 109;
  obj.body =  "DROP: " + obj.user + " dropped the " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + '. ';
  return obj;
};
module.exports.createJobComplete = function(obj){
  obj.type = 110;
  obj.body = "COMPLETE: " + obj.user + " dropped the " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + '. ';
  return obj;
};
module.exports.createJobLate = function(obj){
  obj.type = 111;
  obj.body = "LATE: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " is overdue. ";
  return obj;
};


module.exports.slogan = function(){
  var catchPhrase =[
  "Get hot slug",
  "Seans mom",
  "Cookin not lookin",
  "Jammer time!",
  "Fuck you pay me ",
  "Hey what's up man",
  "Get in the drops",
  "What're you working? ",
  "Turn and burn",
  "Jays on hayes",
  "Shut the fuck up Andres",
  "Fuckin Fixie",
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
  "Your BLOWING it!",
  "Who has a rack?",
  "Hash out with the cash out.",
  "Who cares....",
  "NTCB.",
  "Monday blunt day.",
  "Someone's got a case of the Monday-blunt-days.",
  "Hold that.",
  "Roam your radio. ",
  "I've got it on-board.",
  "Can you close that job for me?",
  "What's the cross street?",
  "Which shift meals are open?",
  "Hey, what's the delivery fee?",
  "Does anyone have an extra... Radio?",
  "Does anyone have an extra... Battery?",
  "Does anyone have an extra... Tube? ",
  "Does anyone have an extra... Patch? ",
  "Does anyone have an extra... iPhone 5 charger? ",
  "Does anyone have an extra... Shift meal?",
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
  "Did you text the code?",
  "What's the delivery fee?",
  "Who's buying donuts?",
  "Who can take my 400 Alvarado",
  "Where's Wilmont St?",
  "Sal called",
  "Why'd you miss the call",
  "Showdogs called",
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
  "I appreciate your due diligence",
  "Flower gravy",
  "Is there anyone at the office?",
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
  "TCB? or NTCB?",
  "maintain de plane",
  "Saturday shit show",
  "He's in personal land",
  "Acevedo just ordered",
  "Dave's going to Serrano's",
  "Radish is bottlenecked",
  "Hello this is TCB with your Gajalee Delivery",
  "Frankie sing me some Alanis Morisette",
  "Fucking crosstown doubles",
  "The mission is fucked",
  "TCB army of amateur ",
  "Im at Curry Up Now, now.",
  "You gonna drop this one first bro",
  "Wing Wings is out of wings...",
  "make the youngblood do it",
  "same time",
  "10:9 10:9 10:9",
  "Hey Rudy, whats your 20? Ok now whats your 20?",
  "totally ducked",
  "Would like some updog with your order?"
  ]
  return catchPhrase[Math.floor(Math.random() * catchPhrase.length)];
}
