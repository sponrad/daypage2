if (Meteor.isClient){
    Template.usersearch.events({
	'keydown #searchInput': function(e){
	    console.log("search key pressed");
	    Session.set("searchString", $("#searchInput").val());
	}
    })

    Template.usersearch.entries = function(){
	if (Session.equals("searchString", "")){
	    searchString = "";
	}
	else{
	    searchString = Session.get("searchString");
	}
	entries = Entries.find({
	    user: Meteor.userId(),
	    content: RegExp(searchString, "gim")
	}, {sort: {date: -1}}).fetch();
	return entries;
    }
}
