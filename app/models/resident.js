'use strict';

module.exports = Resident;
var Mongo = require('mongodb');
var bcrypt = require('bcrypt');
var residents = global.nss.db.collection('residents');
var email = require('../lib/email');

/* ---------------------------------- *
 * Resident
 * _id
 * email
 * password
 * ---------------------------------- */

function Resident(resident){
  this.name = resident.name || '';
  this.email = resident.email || '';
  this.password = resident.password || '';
  this.reports = resident.reports || [];
}

Resident.prototype.register = function(fn){
  var self = this;

  hashPassword(self.password, function(hashedPwd){
    self.password = hashedPwd;
    insert(self, function(err){
      if(self._id){
        email.sendWelcome({to:self.email}, function(err, body){
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

  residents.findOne({_id:_id}, function(err, record){
    fn(record);
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

