'use strict';

module.exports = Employee;
var bcrypt = require('bcrypt');
var employees = global.nss.db.collection('employees');
var email = require('../lib/email');

/* ---------------------------------- *
 * Employee
 * _id
 * email
 * password
 * role
 *
 * #register
 * .findByEmailAndPassword
 * ---------------------------------- */

function Employee(employee){
  this.name = employee.name;
  this.email = employee.email;
  this.password = employee.password;
}

Employee.prototype.register = function(fn){
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

