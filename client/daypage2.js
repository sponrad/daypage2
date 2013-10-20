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
	    $(document).ready( 
		setTimeout(function(){
		    $('.writingbox').autosize();
		    $('.writingbox').first().focus();
		    $('#below-writingbox').click( function(e){
			e.preventDefault();
			$('.writingbox').first().focus();
		    });
		}, 100) 
	    );
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

    Template.userwrite.date = function(){
	var d = new Date().toLocaleDateString();
	return d;
    }

    Template.userwrite.events({
	'keyup .writingbox': function(e) {
	    console.log(e.which);
	}
    });

}

if (Meteor.isServer) {
    Meteor.startup(function () {
	// code to run on server at startup
    });
}
