define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/flashTemplate.html',
  'dispatcher'
], function($,_, Backbone,flashTemplate,dispatcher) {
// The main view of the application
	var FlashMessage = Backbone.Model.extend({
		defaults: {
			title : "",
			price : ""
		}
	});
	var FlashMessageView = Backbone.View.extend({

		// Base the view on an existing element
		el: $('#flashdiv'),
		template: flashTemplate,
		
		initialize: function(){
			this.model = new FlashMessage();
			dispatcher.on('add', this.resetModel, this);
			this.render();
		},

		render: function(){
			if ( this.title === ''){
				return this;
			}
			var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html
        	this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
            return this;

		},
		resetModel: function(model){
			this.model = model;
			this.render();
		}

	});
	return FlashMessageView;

});