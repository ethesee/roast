define(['jquery'],function ($) {  
  return { 
  	places: 2,
    roundToTwo: function(num) {
		return +(Math.round(num + "e+" + this.places)  + "e-" + this.places);
	},
	activeLink: function(which){
		$('.nav.navbar-nav li.active').removeClass('active');
	    var az = $(".nav.navbar-nav li");
	    az.each(function(index){
	       
	        var ltext = $("a",az[index]).text();
	        
	        if ( ltext === which){
	          console.log("found:" + which);
	          console.log("az:", az[index]);
	          $(this).addClass("active");
	        }
	    });
	}
  };
});
