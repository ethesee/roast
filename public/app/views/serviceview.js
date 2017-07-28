define([
  'jquery',
  'underscore',
  'backbone',
  'dispatcher',
  'sapp',
  'text!templates/servicebox.html'
  //'text!templates/serviceTemplate.html'
], function($,_, Backbone, dispatcher,sapp,serviceTemplate) {
// This view turns a Service model into HTML
	var ServiceView = Backbone.View.extend({
		//tagName: 'li',
		tagName: 'div',
		template: serviceTemplate,
		events:{
			//'click [type="checkbox"]': 'toggleService'
			//'click' : 'selectThumb',
			'click #swipe-right': "swipeRight",
			'click #swipe-left': "swipeLeft",
			'click #replylink': "handleReply"
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			dispatcher.on('showim', this.toggleDiv, this);
		},

		render: function(){
            var tmpl = _.template(this.template);
            if ( this.model.get('id')){
            	this.$el.html(tmpl(this.model.toJSON()));
            	//this.$('input').prop('checked', this.model.get('checked'));
            }
            
            
            
			return this;
		},
		selectThumb: function(e){
			e.preventDefault();
			//console.log("clicked on image: + " + this.model.get('title'))
			//sapp.router.navigate('/:' + this.model.get('id'),true);
			sapp.router.navigate('Home', true);
		},
		toggleService: function(e){	
			this.model.toggle();			
		},
		handleReply: function(e){
			console.log("handleReply")
			var parent = $( "#replylink" ).parent();
			parent.empty();
			parent.html("<textarea id='roast" + this.model.get("_id") + "'></textarea>");
			$("#roast" + this.model.get("_id")).keypress(_.bind(function(e){
				if (e.which == 13) {
					console.log("saving:" + $("#roast" + this.model.get("_id")).val());
				}
			},this))
			 
		},
		swipeRight: function(e){replylink
			e.preventDefault();
			//console.log("swipeRight:" + this.model.get("_id"));
			dispatcher.trigger("page",{direction: "right", id: this.model.get("_id")});
		},
		swipeLeft: function(e){
			e.preventDefault();
			//console.log("swipeLeft:" + this.model.get("_id"));
			dispatcher.trigger("page",{direction: "left", id: this.model.get("_id")});
		}
	});
	return ServiceView;
});
