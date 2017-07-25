
// Filename: app.js
define([
  'jquery',
  'async',
  'underscore', 
  'backbone',
  'router', // Request router.js
  'sapp'
], function($, async, _, Backbone, Router, Sapp){
  var initialize = function(){
  	
    // Pass in our Router module and call it's initialize function
    //Router.initialize();
    Sapp.router = new Router();
    Backbone.history.start();
  };

  return { 
    initialize: initialize
  };
});
