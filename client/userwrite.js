Entries = new Meteor.Collection('entries')
Days = new Meteor.Collection('days')

if (Meteor.isClient) {    

    function setEntry(date){
	entry = Entries.findOne({user: Meteor.userId(), date: date});
	if (entry){
	    Session.set("entry-id", entry._id);
	    Session.set("selected-date", date);
	}
	else {
	    entry = Entries.insert({user: Meteor.userId(), date: date, content: ""})
	    Session.set("entry-id", entry._id);
	    Session.set("selected-date", date);
	}
	return entry
    }

    Template.userwrite.rendered = function(){
	thisday = new Date()
	datestring =  thisday.getMonth()+1 + "/" + thisday.getDate() + "/" + thisday.getFullYear();
	entry = setEntry(datestring);

	Meteor.setTimeout(function(){
	    $("#thisday").datepicker({
		onSelect: function(selectedDate){
		    thisday = new Date(selectedDate)
		    tdatestring =  thisday.getMonth()+1 + "/" + thisday.getDate() + "/" + thisday.getFullYear();
		    $('#thisday').val(tdatestring);
		    console.log(tdatestring);
		    $('.writingbox').first().focus();
		    entry = setEntry(tdatestring);
		    $(".writingbox").first().val( entry.content );
		    $('.writingbox').autosize();

		}
	    });

	    $('.writingbox').autosize();
	    $('.writingbox').first().focus();
	    $(".writingbox").first().val( entry.content );
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
	    date = $("#thisday").val();
	    entry = setEntry(date);
	    console.log(Session.get("selected-date"));
	    entry = Entries.update(entry._id, {$set: {content: $('#writingbox').val()} });
	},
    });

    Template.userwrite.content = function(){
	date = $("#thisday").val();
	entry = setEntry(date);
	if (entry && entry.content != ""){
	    return entry.content;
	}
    }
}
