define([
  'jquery',
  'underscore',
  'backbone',
  'service',
  'servicelist',
  'serviceview',
  'dispatcher',
  'utils',
  'text!templates/photogrid/photogridtemplate.html',
  'sapp'
], function($,_, Backbone,Service,ServiceList,ServiceView,dispatcher,Utils,photoGridTemplate,Sapp) {
// The main view of the application
	var PhotogridView = Backbone.View.extend({

		// Base the view on an existing element
		el: $('#Wcontainer'),
		//template: chooserTemplate,
		idIterator: "",
		memoizer: {},
		loaded: false,
		initialize: function(options){
			// this.router = options.router;
			this.services = options.collection;
			//this.services.on("reset", this.render, this);
			this.fetchPromise = this.services.fetch({reset: true});
			this.fetchPromise.done(_.bind(function(){
				//collection is loaded/populated from db. Ready to show
				setTimeout(_.bind(function(){
					this.createServiceViews();
				},this),2000);
				
			},this));
	        this.render();
			//this.listenTo(this.services, 'change', this.render);
			//this.listenTo(this.services, 'add', this.render);
			
			dispatcher.on('insert', this.addService, this);
			dispatcher.on('page', this.pageService, this);
		},
		setIterator: function(id){
			this.idIterator = id;
		},
		firstRender: function(){
			this.services.each(function(service){
				var id = service.get("_id");
				if ( ! (id in this.memoizer) ){
					this.memoizer[id] = 0;
					if ( ! this.loaded ){
						minKey = id;
						minVal = 1;
						this.memoizer[id] = 1;
						var view = new ServiceView({ model: service });
						this.list.append(view.render().el);
						this.loaded = true;
					}
					
				}
				 
			}, this);	// "this" is the context in the callback
		},
		otherRender: function(memKeys){
			 
			if (memKeys.length > 0 && this.loaded ){
				var key = _.first(memKeys);
				var service;
				if ( this.idIterator !== ""){
					var usedKey = this.idIterator;
					var unusedServices = _.filter(this.services.models,function(model){
						return model.get("_id") !== usedKey;
					});
					
					var memory = this.memoizer;
					//find the key used the least.
					var minKey = Object.keys(memory).reduce(function(a, b){ 
								return memory[a] < memory[b] ? a : b 
							});

					service = _.first(_.filter(unusedServices,function(s){
						return s.get("_id") == minKey;
					}));

				}else{
					service = _.first(_.filter(this.services.models,function(model){
						return model.get("_id") == key;
					}));
				}
				

				var view = new ServiceView({ model: service });
				var id = service.get("_id");
				this.list.append(view.render().el);
				this.memoizer[id] += 1;
			}
		},

		createServiceViews: function(){
			
			this.list.empty();
			this.total = $('#total span');
			var showNext = false;
			
			var memKeys = _.keys(this.memoizer);
			 

			if (memKeys.length > 0 && this.loaded ){
				this.otherRender(memKeys);
			}else{
				this.firstRender();
				
			}

			
		},
		showBar: function(){
			var progressDiv = $('<div class="progress"></div>');
			progressDiv.appendTo(this.list);
			var totalWidth = 400;
			var intval = setInterval(function(){
				var currentWidth = parseInt(progressDiv.width(),10) + 20;
				progressDiv.css({width: currentWidth + "px"});
				if ( currentWidth == totalWidth){
					clearInterval(intval);		
				}
			},100);
		},
		render: function(){
			
			this.template = _.template(photoGridTemplate);
			this.$el.html(this.template());
			this.list = $('#services');
			
			
			if (this.loaded) {
				this.createServiceViews();
			}else{
				console.log("showbar will execute")
				this.showBar();
			}
            
			return this;

		},

		
		events: { 
			'click #order': "orderMessage",
			'click #del': "delProducts",
			'click #showAdd': "toggleAddForm",
			//'click #addService': "addService"
		},
		pageService: function(s){
			//console.log("pageService called:", s);
			this.setIterator(s.id);
			this.render();
		},
		addService: function(s){
		    		
		    console.log("addService called")
			var stitle = s.title, sprice = Utils.roundToTwo(parseFloat(s.price));

			if ( s.image ){
				//with image
				this.services.create({ title: stitle, price: sprice, checked: false, image: s.image});
			}else{
				this.services.create({ title: stitle, price: sprice, checked: false});
			}

			//this.createServiceViews();
			//this.services.trigger('change',{});
			Utils.activeLink('Home');
			
			
			//this.router.navigate();
			Sapp.router.navigate('/', true);
			
		},

		orderMessage: function(event){
			this.uncheckAll();
		},
		uncheckAll: function(){
			var total = 0;

			_.each(this.services.getChecked(), function(elem){
				elem.toggle();
			});
		},
		delProducts: function(event){
			
			var self = this;
			_.each(this.services.getChecked(), function(elem){
				
				var elemid = elem.get("_id");
				self.services.where({_id: elemid})[0].destroy();
				
			});
			this.createServiceViews();
			
			this.services.trigger('change',{});
			
		}

	});
	return PhotogridView;

});