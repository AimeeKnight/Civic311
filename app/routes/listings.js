'use strict';

var Listing = require('../models/listing');

exports.fresh = function(req, res){
  res.render('listings/fresh', {title: 'New Listing'});
};

exports.create = function(req, res){
  var listing = new Listing(req.body);
  listing.insert(function(){
    res.redirect('/');
  });
};

exports.index = function(req, res){
  Listing.findAll(function(listings){
    res.render('listings/index', {listings:listings, title: 'Listings'});
  });
};

exports.query = function(req, res){
  Listing.findByGeo(req.query, function(listings){
    res.send({listings:listings});
  });
};

