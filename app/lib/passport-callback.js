'use strict';
var Resident = require('../models/resident');

module.exports = function facebookCallback(accessToken, refreshToken, profile, done){
  process.nextTick(function() {

    Resident.findByFacebookId(profile.id.toString(), function(user){
      if(user){
        return done(null, user);
      }else{
        var newResident = new Resident({});
        newResident.facebookId = profile.id;
        newResident.name = profile.displayName;
        newResident.fbInsert(function(user){
          return done(null, user);
        });
      }
    });
  });
};
