define([
  'jquery',
  'underscore',
  'backbone',
  'service',
  'servicelist',
  'serviceview',
  'text!templates/addserviceTemplate.html',
  'dispatcher'
], function($,_, Backbone,Service,ServiceList,ServiceView,addserviceTemplate,dispatcher) {
// The main view of the application
	var AddServiceView = Backbone.View.extend({

		// Base the view on an existing element
		//el: $('#addForm'),
		el: $('#Wcontainer'),
		template: addserviceTemplate,

		initialize: function(){
			//this.render();
		},

		render: function(){

			var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html
        	this.$el.html(tmpl(/*this.model.toJSON()*/));
        	
            return this;

		},

		events: { 
			'click #addService': "addEntry",
			'change #coverImage': "processUpload"
		},
		
        processUpload: function(e){
            
            var fileInput = $("#coverImage");
            var files = fileInput[0].files;
            
            this.formData = new FormData();
            this.files = [];

            for (var i = 0; i < files.length; i++) {
			  var file = files[i];

			  // Check the file type.
			  if (!file.type.match('image.*')) {
			    continue;
			  }
              
			  // Add the file to the request.
			  this.files.push(file);
			  //this.formData.append('file',file);
			  this.formData.append('photos[]', file, file.name);
			}
			var fileField = $("#coverImage");
			fileField.replaceWith(fileField.val('').clone(true));
            this.showPreview(); 
        },

        showPreview: function(){
        	var files = this.files;
		    for(var i=0; i<files.length; i++){
		        this.previewImage(files[i]);
		    }
        },
        sendAjax: function(s){
        	var _this = this;
        	var theService = s;
        	$('.progress-bar').text('0%');
    		$('.progress-bar').width('0%');
    		console.log("sendAjax called.")
			return $.ajax({
			  url: '/upload',
			  type: 'POST',
			  data: _this.formData,
			  processData: false,
			  contentType: false,
			  beforeSend: function(data){
				$("#sname").val("");
				$("#sprice").val("");
			  },
			  success: function(data){
			      console.log('upload successful!');
			  },
		      xhr: function() {
				  // create an XMLHttpRequest
				  var xhr = new XMLHttpRequest();

				  // listen to the 'progress' event
				  xhr.upload.addEventListener('progress', function(evt) {

				    if (evt.lengthComputable) {
				      // calculate the percentage of upload completed
				      var percentComplete = evt.loaded / evt.total;
				      percentComplete = parseInt(percentComplete * 100);

				      // update the Bootstrap progress bar with the new percentage
				      $('.progress-bar').text(percentComplete + '%');
				      $('.progress-bar').width(percentComplete + '%');

				      // once the upload reaches 100%, set the progress bar text to done
				      if (percentComplete === 100) {
				        $('.progress-bar').html('Done');
				   
				        setTimeout(function(){
				        	_this.files.length = 0;
				        	dispatcher.trigger("insert",theService);
						},700);
				      }

				    }

				  }, false);
				  
				  return xhr;
				}

			});
        	
		},
        previewImage: function(file){
        	 
		    var galleryId = "gallery";

		    var gallery = $("#gallery");//document.getElementById(galleryId);
		    var imageType = /image.*/;

		    if (!file.type.match(imageType)) {

		        throw "File Type must be an image";

		    }
		    
		    var thumb = document.createElement("div");
		    var thumb = $("<div></div>");
		    thumb.addClass('thumbnail'); // Add the class thumbnail to the created div
		    var img = document.createElement("img");
		    img.file = file;
		    //thumb.appendChild(img);
		    thumb.append(img);
		    //gallery.appendChild(thumb);
		    gallery.append(thumb);
		    // Using FileReader to display the image content
		    var reader = new FileReader();
		    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
		    reader.readAsDataURL(file);
			

        },
		addEntry: function(event){
			var _this = this;
			var s = { title: $("#sname").val(), price: $("#sprice").val()};

			// var s = new Service({ title: $("#sname").val(), price: $("#sprice").val()});
			// if ( (_this.files && _this.files.length > 0) && _this.files[0].name ){
			// 	s = new Service({ title: $("#sname").val(), price: $("#sprice").val(), image: _this.files[0].name});
			// }
			if ( (_this.files && _this.files.length > 0) && _this.files[0].name ){
				//s = new Service({ title: $("#sname").val(), price: $("#sprice").val(), image: _this.files[0].name});
				var s = { title: $("#sname").val(), price: $("#sprice").val(), image: _this.files[0].name};
			}
			var formdata = _this.formData;
			//console.log("uploading:",formdata);
			if (formdata && _this.files.length) {	
				this.sendAjax(s);					
			}else{
				//if ( $("#sname").val() && $("#sprice").val() ){
				if ( s.title && s.price){
					dispatcher.trigger("insert",s);
				}
				
				
				$("#sname").val("");
				$("#sprice").val("");
			}
			
			
		}

	});
	return AddServiceView;

});