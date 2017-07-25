define([
  'underscore',
  'backbone',
  'service'
], function(_, Backbone, Service) {
// Create a collection of services
	var ServiceList = Backbone.Collection.extend({

		// Will hold objects of the Service model
		model: Service,
		url:'/api/services',
		// initialize: function(){
		// 	this.on('sync', function () { console.log('synced!'); });
		// 	this.on('remove', function () { console.log('removed!'); })
		// },
		// parse: function(data) {
			// console.log("parse called")
		    // return data.services;
		// },

		// Return an array only with the checked services
		getChecked: function(){
			return this.where({checked:true});
		}

	});
	return ServiceList;
});