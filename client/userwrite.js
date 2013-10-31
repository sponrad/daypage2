Entries = new Meteor.Collection('entries')
Days = new Meteor.Collection('days') //Why have this if there is a datestamp on entries

if (Meteor.isClient) {    

    function setEntry(date){
	entry = Entries.findOne({user: Meteor.userId(), date: date});
	//console.log(entry);
	if (entry){
	    localStorage.setItem("entry-id", entry._id);
	    localStorage.setItem("selected-date", date);
	}
	else {
	    entry = Entries.insert({
		user: Meteor.userId(), 
		date: date, 
	    });
	    localStorage.setItem("entry-id", entry._id);
	    localStorage.setItem("selected-date", date);
	}
	return entry
    }

    function countWords(str){
	var count = 0,
	i,
	foo = str.length;

	for (i = 0; i <= foo; i++) {
	    if (str.charAt(i) == " ") {
		count ++;
	    }

	}
	return (count + 1);  
    }

    Template.userwrite.rendered = function(){
	thisday = new Date()
	datestring =  thisday.getMonth()+1 + "/" + thisday.getDate() + "/" + thisday.getFullYear();
	entry = setEntry(datestring);
	$('#writingbox').focus();
	$("#writingbox").val( entry.content );

	Meteor.setTimeout(function(){
	    $("#thisday").datepicker({
		onSelect: function(selectedDate){
		    thisday = new Date(selectedDate)
		    tdatestring =  thisday.getMonth()+1 + "/" + thisday.getDate() + "/" + thisday.getFullYear();
		    $('#thisday').val(tdatestring);
		    console.log(tdatestring);
		    $('#writingbox').focus();
		    entry = setEntry(tdatestring);
		    $('#writingbox').val( entry.content );
		    $('#writingbox').autogrow();

		    Countable.live(document.getElementById("writingbox"), function(counter){
			//console.log(this, counter);
			//{ all: 0, characters: 0, paragraphs: 0, words: 0 }
			$("#characters").html("Characters: " + counter.characters);
			$("#words").html(" Words: " + counter.words);			
			
		    });
		}
	    });

	    $('#writingbox').autogrow();

	    Countable.live(document.getElementById("writingbox"), function(counter){
		//console.log(this, counter);
		//{ all: 0, characters: 0, paragraphs: 0, words: 0 }
		$("#characters").html("Characters: " + counter.characters);
		$("#words").html(" Words: " + counter.words);			
		
	    });

	    $('#below-writingbox').click( function(e){
		e.preventDefault();
		$('#writingbox').focus();
	    });

	}, 100);
	
    }

    Template.userwrite.date = function(){
	var d = new Date().toLocaleDateString();
	return d;
    }
    
    Template.userwrite.events({
	'keypress #writingbox': function(e){
	    console.log(e.which);
	    date = $("#thisday").val();
	    entry = setEntry(date);
	    console.log(localStorage.getItem("selected-date"));
	    Meteor.setTimeout( function(){
		Entries.update(
		    entry._id, 
		    {$set: {content: $('#writingbox').val()}}
		);
		console.log(entry);
	    }, 2000);
	},

	'click #entrybox': function(e){
	    val = Session.get("entry-hover");
	    if (val){
		Session.set("entry-hover", false);
	    }
	    else{
		Session.set("entry-hover", true);
	    }
	}
    });

    Template.userwrite.count = function(){
	date = $("#thisday").val();
	count = Entries.find({user: Meteor.userId(), date: date}).count(); 
	return count;
    }

    Template.userwrite.showentryhover = function(){
	return Session.get("entry-hover")
    }
}
