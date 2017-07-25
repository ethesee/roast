define([
  'underscore',
  'backbone',
], function(_, Backbone) {
	var dispatcher = {};  
	_.extend(dispatcher, Backbone.Events);
	return dispatcher;
});