if (Meteor.isClient) {    

    Template.main.userwrite = function(){
	if (Session.get("userview") == "write"){
	    return true;
	}
    }
    Template.main.usersearch = function() {
	if (Session.get("userview") == "search"){
	    return true;
	}
    }
    Template.main.userstats = function() {
	if (Session.get("userview") == "stats"){
	    return true;
	}
    }
    Template.main.usersocial = function() {
	if (Session.get("userview") == "social"){
	    return true;
	}
    }
    Template.main.usersettings = function() {
	if (Session.get("userview") == "settings"){
	    return true;
	}
    }

    Template.main.events({
	'click a#write': function(e) {
	    e.preventDefault();
	    Session.set("userview", "write");
	    $(document).ready( function(){

	    });
	},
	'click a#search': function(e) {
	    e.preventDefault();
	    Session.set("userview", "search");
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

}

if (Meteor.isServer) {
    Meteor.startup(function () {
	// code to run on server at startup
	Session.set("userview", "write");
    });
}
