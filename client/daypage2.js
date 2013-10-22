Entries = new Meteor.Collection('entries')
Days = new Meteor.Collection('days')

if (Meteor.isClient) {    

    Template.footer.year = function() {
	var d = new Date().getFullYear();
	return d;
    }

    Template.user.userwrite = function(){
	if (Session.get("userview") == "write"){
	    return true;
	}
    }
    Template.user.userstats = function() {
	if (Session.get("userview") == "stats"){
	    return true;
	}
    }
    Template.user.usersocial = function() {
	if (Session.get("userview") == "social"){
	    return true;
	}
    }
    Template.user.usersettings = function() {
	if (Session.get("userview") == "settings"){
	    return true;
	}
    }

    Template.user.events({
	'click a#write': function(e) {
	    e.preventDefault();
	    Session.set("userview", "write");
	    $(document).ready( function(){

	    });
	},
	'click a#stats': function(e) {
	    e.preventDefault();
	    Session.set("userview", "stats");
	},
	'click a#social': function(e) {
	    e.preventDefault();
	    Session.set("userview", "social");
	},
	'click a#settings': function(e) {
	    e.preventDefault();
	    Session.set("userview", "settings");
	}

    });
    
    /*
      TODO
      When userwrite template is rendered need to:
      Check to see if an entry exists, grab the first one
      If one does not exist: create an empty Entry object 
      
      save the id of the entry to the session so that later on it can be instantly updated.
    */
    Template.userwrite.rendered = function(){
	Meteor.setTimeout(function(){
	    $("#thisday").datepicker({
		onSelect: function(selectedDate){
		    thisday = new Date(selectedDate);
		    datestring =  thisday.getMonth()+1 + "/" + thisday.getDate() + "/" + thisday.getFullYear();
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

	var lastVal = $("#writingbox").value;
	Meteor.setInterval(function(){
	    if($("#writingbox").val() != lastVal) {
		// the text changed
		lastVal = $("#writingbox").val();

		//update existing
		if (Session.equals("entry-id", "none")){
		    Entries.update(Session.get("entry-id"), {content: lastVal});
		}
		//create new
		else {
		    Entries.insert({date: Session.get("selected-date"), user: Meteor.userId, content: lastVal}, function(error, _id){
			Session.set("entry-id", _id);
			console.log("that worked? " + error);
		    });

		}
	    }
	}, 5000);
    }

    Template.userwrite.date = function(){
	var d = new Date().toLocaleDateString();
	return d;
    }
    
    Template.userwrite.content = function(){
	entry = Entries.findOne({user: Meteor.userId, date: Session.get("selected-date")});
	if (entry){
	    Session.set("entry-id", entry._id);
	    return entry.content;
	}
	else{
	    return null;
	}
    }

    Template.userwrite.events({
	'keypress .writingbox': function(e) {
	    console.log(e.which);
	}
    });

}

if (Meteor.isServer) {
    Meteor.startup(function () {
	// code to run on server at startup
    });
}
