Sections = new Meteor.Collection('sections')
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
		Meteor.setTimeout(function(){
		    $("#thisday").datepicker({
			onSelect: function(selectedDate){
			    thisday = new Date(selectedDate);
			    datestring =  thisday.getMonth()+1 + "/" + thisday.getDate() + "/" + thisday.getFullYear();
			    $('#thisday').val(datestring);
			    Session.set("selected_date", datestring);
			    console.log(Session.get("selected_date"));
			    $('.writingbox').first().focus();
			}
		    });

		    $('.writingbox').autosize();
		    $('.writingbox').first().focus();
		    $('#below-writingbox').click( function(e){
			e.preventDefault();
			$('.writingbox').first().focus();
		    });

		}, 100);
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

    Template.userwrite.date = function(){
	var d = new Date().toLocaleDateString();
	return d;
    }
    
    Template.userwrite.content = Sections.find({user: Meteor.userId, date: Session.get("selected-date")}).content;

    Template.userwrite.events({
	'keypress .writingbox': function(e) {
	    console.log(e.which);
	    _id = Sections.insert({user: Meteor.userId, date: Session.get("selected-date"), content: this.value});
	    console.log(_id);
	}
    });

}

if (Meteor.isServer) {
    Meteor.startup(function () {
	// code to run on server at startup
    });
}
