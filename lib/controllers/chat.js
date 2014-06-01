'use strict';

var server = require('../../server'),
    mongoose = require('mongoose'),
    Chat = mongoose.model('Chat'),
    Racer = mongoose.model('Racer'),
    qs = require('qs'),
    fs = require('fs'),
    tj = require('./twinjet.js'),
    map = require('./leaflet.js');

/**
 * Create chat message
 */

exports.create = function (req, res, next) {
  var newObj = req.body;
  newObj.type = 200;
  var newChat = new Chat(newObj);
//  var newChat = new Chat(req.body);
  // console.log('chat create invoked');
  newChat.provider = 'local';
  // console.log('creating');
  newChat.save(function(err) {
    if (err) {
      // console.log('err', err);
      return res.json(400, err);
    } else{
      return res.end();
    }
  });
};

exports.gram = function(tag, req, res, next) {
  var request = require('request-promise');
  // URL for non-batch requests 'http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2gprocess.env.INSTA_IDbl1%2Cra%3Do5-9ual56'  
  // console.log('in gram',  process.env.INSTA_ID);
  request('https://api.instagram.com/v1/tags/' + tag + '/media/recent?client_id=301ad345308c49578d03a01ceaf5f258')
    .then(function(response) {
      // console.log('received instagram response');
      var dbObj = {};
      var resObj = JSON.parse(response);
      dbObj.body = ' INSTAGRAM: ' + resObj.data[0].caption.text;
      // dbObj.timestamp = resObj.data[0].created_time;
      dbObj.user = resObj.data[0].user.username;
      dbObj.image = resObj.data[0].images.low_resolution.url;
      dbObj.pic = resObj.data[0].user.profile_picture;
      dbObj.avatar = resObj.data[0].user.profile_picture;
      dbObj.type = 300;
      console.log('gram bd', dbObj);
      saveChatInDatabase(req, res, next, dbObj);
    }).catch(function(response) {
      console.log('Error fetching Instagram!', response);
    });
};


exports.livefeed = function (req, res, next){

  console.log('hello live: ', req.body);

//   standings: 
//    [ { current_earnings: 66,
//        racer_photo_medium: 'img/no_racer_photo_medium.png',
//        number_of_jobs: 0,
//        racer_photo_large: 'img/no_racer_photo.png',
//        city: 'San Francisco',
//        racer_name: 'Doug Suriano',
//        country: 'US',
//        place: 1,
//        racer_number: '320',
//        team: 'TCB',
//        racer_photo_small: 'img/no_racer_photo_mini.png' } ],

  if (req.body.standings.length >= 1) {
    console.log('standings loop')
    var standlen = req.body.standings.length;
    for (var i = 0; i < standlen; i ++){
      var itemToAdd = {
        //slogan : tj.slogan(),
        type : 500, 
        pic : req.body.standings[i].racer_photo_small,
        user : req.body.standings[i].racer_name,
        image : req.body.standings[i].racer_photo_large,
        place: req.body.standings[i].place,
        team: req.body.standings[i].team,
        country: req.body.standings[i].country,
        city: req.body.standings[i].city,
        racer_number: req.body.standings[i].racer_number,
        current_earnings: req.body.standings[i].current_earnings,
        number_of_jobs: req.body.standings[i].number_of_jobs
      }
      console.log('hello Racer itemToAdd ', itemToAdd);
      //var newRacer = new Racer(itemToAdd);
      Racer.findOneAndUpdate({'racer_name' : itemToAdd.racer_name}, 
        {
          'place': itemToAdd.place, 
          'current_earnings': itemToAdd.current_earnings
        }, function (err, racer){
        if (err) {
          console.log('racer err', err);
        }
        if (racer){
          console.log('racer update!', racer);
          // Racer.update({ 'racer_number' : itemToAdd.racer_number}, itemToAdd,
          //   function(err) {
          //     if (err) {
          //       // console.log('err', err);
          //       return res.json(400, err);
          //     } else{
          //       return res.end();
          //     }
          // });
        } else if (!racer) {
          console.log('racer NO!')
        //   var newRacer = new Racer(itemToAdd);
        //   newRacer.save(function(err, data) {
        //     if (err) {
        //       // console.log('err', err);
        //       return res.json(400, err);
        //     } else{
        //       console.log('saved racer', data)
        //       return res.end();
        //     }
        //   });
        }
      })
    }
  }

  // if (req.body.events.length >= 1) {
  //   // console.log('event loop')
  //   var len = req.body.events.length;
  //   for (var i = 0; i < len; i ++){
  //     var racEvent = {
  //       //slogan : tj.slogan(),
  //       type : 600, 
  //       pic : req.body.events[i].racer_photo_small,
  //       user : req.body.events[i].racer_number + ' ' + req.body.events[i].racer_name,
  //       image : req.body.events[i].message_photo || req.body.racer_photo_medium,
  //       body : req.body.events[i].message
  //     }
  //     // console.log('hello racEvent ', racEvent);
  //     var newChat = new Chat(racEvent);
  //     newChat.save(function(err) {
  //       if (err) {
  //         // console.log('err', err);
  //         return res.json(400, err);
  //       } else{
  //         return res.end();
  //       }
  //     });
  //   }
  // }
};

// { 
//   events: 
//    [ { racer_photo_large: 'img/no_racer_photo.png',
//        timestamp: 1400964669,
//        poster_name: '',
//        racer_photo_medium: 'img/no_racer_photo_medium.png',
//        message_photo: '',
//        message: 'Is not doing any jobs because he is fat.',
//        city: 'San Francisco',
//        racer_name: 'Doug Suriano',
//        poster_photo: '',
//        country: 'US',
//        racer_number: '320',
//        team: 'TCB',
//        racer_photo_small: 'img/no_racer_photo_mini.png' } ] 
// }


var saveChatInDatabase = function(req, res, next, itemToAdd) {
  console.log('Saving chat in database');
  var newChat = new Chat(itemToAdd);
  newChat.provider = 'local';
  
  newChat.save(function(err) {
    if (err){
      console.log('chat db err', err);
      fs.appendFile('/home/feed_me/www/feed/db.log', err, function (err) {
         if (err) throw err;
      });
    }
  // newChat.update( { image: itemToAdd.image }, itemToAdd, { upsert:true },function(err) {
  // if (err){
  //   console.log('chat db err', err);
  //   fs.appendFile('/home/feed_me/www/feed/db.log', err, function (err) {
  //      if (err) throw err;
  //   });
  // }
  });
};
