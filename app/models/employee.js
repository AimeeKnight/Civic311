'use strict';

module.exports = Employee;
var Mongo = require('mongodb');
var bcrypt = require('bcrypt');
var employees = global.nss.db.collection('employees');
var email = require('../lib/email');

/* ---------------------------------- *
 * Employee
 * _id
 * email
 * password
 * ---------------------------------- */

function Employee(employee){
  this.name = employee.name || '';
  this.email = employee.email || '';
  this.password = employee.password || '';
  this.token = employee.token || '';
  this.reports = employee.reports || [];
}

Employee.prototype.register = function(fn){
  var self = this;

  hashPassword(self.password, function(hashedPwd){
    self.password = hashedPwd;
    insert(self, function(err){
      var token = self.token;
      if(self._id){
        email.sendAccess({to:self.email, token:token}, function(err, body){
          fn(err, body);
        });
      }else{
        fn();
      }
    });
  });
};


Employee.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  employees.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};


Employee.findByEmailAndPassword = function(email, password, fn){
  employees.findOne({email:email}, function(err, employee){
    if(employee){
      bcrypt.compare(password, employee.password, function(err, result){
        if(result){
          fn(employee);
        }else{
          fn();
        }
      });
    }else{
      fn();
    }
  });
};

Employee.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  employees.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

function insert(employee, fn){
  employees.findOne({email:employee.email}, function(err, employeeFound){
    if(!employeeFound){
      employees.insert(employee, function(err, record){
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

