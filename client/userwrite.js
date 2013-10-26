if (Meteor.isClient) {    
    /*
      TODO
      When userwrite template is rendered need to:
      Check to see if an entry exists, grab the first one
      If one does not exist: create an empty Entry object 
      
      save the id of the entry to the session so that later on it can be instantly updated.
    */
    Template.userwrite.rendered = function(){
	thisday = new Date()
	var datestring =  thisday.getMonth()+1 + "/" + thisday.getDate() + "/" + thisday.getFullYear();

	Meteor.setTimeout(function(){
	    $("#thisday").datepicker({
		onSelect: function(selectedDate){
		    $('#thisday').val(datestring);
		    console.log(datestring);
		    $('.writingbox').first().focus();
		    Session.set("selected-date", datestring);
		}
	    });

	    $('.writingbox').autosize();
	    $('.writingbox').first().focus();
	    $('#below-writingbox').click( function(e){
		e.preventDefault();
		$('.writingbox').first().focus();
	    });

	}, 100);
	
    }

    Template.userwrite.date = function(){
	var d = new Date().toLocaleDateString();
	return d;
    }
    
    Template.userwrite.events({
	'keypress .writingbox': function(e) {
	    console.log(e.which);
	},
    });

}
