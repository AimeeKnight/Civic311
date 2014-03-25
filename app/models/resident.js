'use strict';

module.exports = Resident;
var Mongo = require('mongodb');
var bcrypt = require('bcrypt');
var residents = global.nss.db.collection('residents');
var welcomeEmail = require('../lib/welcomeEmail');
var _ = require('lodash');

/* ---------------------------------- *
 * Resident
 * _id
 * email
 * password
 * ---------------------------------- */

function Resident(resident){
  this.name = resident.name || null;
  this.email = resident.email || null;
  this.password = resident.password || null;
  this.facebookId = resident.facebookId || null;
  this.reports = resident.reports || [];
}

Resident.prototype.fbInsert = function(fn){
  var self = this;
  residents.findOne({facebookId:this.facebookId}, function(err, record){
    if(!record){
      residents.insert(self, function(err, residents){
        fn(residents[0]);
      });
    }else{
      fn(err);
    }
  });
};

Resident.prototype.update = function(fn){
  residents.update({_id:this._id}, this, function(err, count){
    fn(err, count);
  });
};

Resident.prototype.register = function(fn){
  var self = this;

  hashPassword(self.password, function(hashedPwd){
    self.password = hashedPwd;
    insert(self, function(err){
      if(self._id){
        welcomeEmail.sendWelcome({to:self.email}, function(err, body){
          console.log('HHHHHHH', body);
          fn(err, body);
        });
      }else{
        fn();
      }
    });
  });
};

Resident.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  residents.findOne({_id:_id}, function(err, resident){
    fn(_.extend(resident, Resident.prototype));
  });
};

Resident.findByEmailAndPassword = function(email, password, fn){
  residents.findOne({email:email}, function(err, resident){
    if(resident){
      bcrypt.compare(password, resident.password, function(err, result){
        if(result){
          fn(resident);
        }else{
          fn();
        }
      });
    }else{
      fn();
    }
  });
};

Resident.findByFacebookId = function(fbId, fn){
  residents.findOne({facebookId:fbId}, function(err, resident){
    fn(_.extend(resident, Resident.prototype));
  });
};

function insert(resident, fn){
  residents.findOne({email:resident.email}, function(err, residentFound){
    if(!residentFound){
      residents.insert(resident, function(err, record){
        fn(err);
      });
    }else{
      fn();
    }
  });
}

function hashPassword(password, fn){
  bcrypt.hash(password, 8, function(err, hash){
    fn(hash);
  });
}

