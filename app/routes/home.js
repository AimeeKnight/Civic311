'use strict';

exports.index = function(req, res){
  res.render('home/index', {title: 'Welcome to Civic311'});
};

